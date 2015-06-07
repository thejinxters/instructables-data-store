/**
 * Collect Analytics Script for Mysql
 *
 * Author: Brandon Mikulka
 */

// Load Local Dependencies
var api = require('./api/instructables-api');
var db = require('./db/mysql-setup');
var item = require('./db/item');
var event = require('./db/event');
var view = require('./db/view');
var RateLimiter = require('limiter').RateLimiter;

//limit api calls to 1 every 250 ms
var limiter = new RateLimiter(1, 250);

// Connect to MySQL
db.connection.connect();

// Setup tables if it is needed
event.setup(db);
view.setup(db);

// Retrieve a list of ids
var collectIds = function() {
    item.getAllItemIds(db, retrieveNewData);
};

// Call the API
var retrieveNewData = function(itemIds) {

    itemIds.every(function(row){
        limiter.removeTokens(1, function(err, remainingRequests) {
            api.instructablesGetDetails(row.id, getItemFromDb);
        });
        return true;
    });
};

// Collect original Data
var getItemFromDb = function(apiItem){
    item.getItem(apiItem, db, collectEvents);
};

// Collect all Associated Events
var collectEvents = function(dbItem, apiItem){
    event.collectChanges(db, dbItem, apiItem, addEventData);
};

// Update current Item to include event data
var addEventData = function(result, dbItem, apiItem){

    var updatedItem = dbItem;
    for(var i = 0; i < result.length; i++){
        var key = result[i].event_key;
        updatedItem[key] = result[i][key];
    }
    collectViews(updatedItem, apiItem);
};

var collectViews = function(dbItem, apiItem){
    view.collectViews(db, dbItem, apiItem, addViewData);
};

var addViewData = function(result, dbItem, apiItem){
    var updatedItem = dbItem;
    for(var i = 0; i < result.length; i++){
        updatedItem.views = result[i].views;
    }
    compareItemData(updatedItem, apiItem);
};


// Add New event if data is different
var compareItemData = function(dbItem, apiItem){

    var itemTags = apiItem.keywords[0];
    for (var i = 1; i < apiItem.keywords.length; i++){
        itemTags += ', ' + apiItem.keywords[i];
    }

    //Get Image Counts
    var itemImageCount = 0;
    for (var j = 0; j < apiItem.files.length; j++){
        var imgTypes = /[.]jpg$|[.]png$/;
        if (imgTypes.test(apiItem.files[j].name)){
            itemImageCount++;
        }
    }

    //Get Word Counts
    var itemMaxWordcount = 0;
    var itemMinWordcount = Number.POSITIVE_INFINITY;
    var itemAverageWordcount = 0;
    for (var k = 0; k < apiItem.steps.length; k++){
        var stepWordcount = apiItem.steps[k].wordCount;
        if (stepWordcount > itemMaxWordcount){
            itemMaxWordcount = stepWordcount;
        }
        if (stepWordcount < itemMinWordcount) {
            itemMinWordcount = stepWordcount;
        }
        itemAverageWordcount += stepWordcount;
    }
    itemAverageWordcount /= apiItem.steps.length;

    var apiTranslation = {
        status: apiItem.status,
        edit_version: apiItem.editVersion,
        display_category: apiItem.displayCategory,
        display_channel: apiItem.displayChannel,
        comments: apiItem.comments,
        step_count: apiItem.stepCount,
        popular_flag: apiItem.popularFlag,
        feature_flag: apiItem.featureFlag,
        sponsored_flag: apiItem.sponsoredFlag,
        pg_flag: apiItem.pgFlag,
        tags: itemTags,
        tags_count: apiItem.keywords.length,
        attached_files: apiItem.files.length,
        attached_images: itemImageCount,
        min_step_wordcount: itemMinWordcount,
        max_step_wordcount: itemMaxWordcount,
        average_step_wordcount: parseInt(itemAverageWordcount),
        steps_containing_words: apiItem.numStepsByWordCount,
        title: apiItem.title,
        category: apiItem.category,
        channel: apiItem.channel,
        featured: apiItem.featureFlag,
        views: apiItem.views,
        favorites: apiItem.favorites
    };

    var keys = Object.keys(apiTranslation);

    keys.every(function(key){
        if (dbItem[key] != apiTranslation[key]){
            if (key == "views"){
                // Store to views table
                view.insert(db, dbItem, apiTranslation);
            }
            else{
                //Store to events table
                event.insert(db, dbItem.id, key, apiTranslation[key]);
            }
            console.log(key + " is different!!");
        }
        return true;
    });

};


collectIds();