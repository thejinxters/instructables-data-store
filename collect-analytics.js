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


var getAllItems = function(limit, offset, sort, type, items){
    var completed = false;
    items.every( function(el) {
        // Grab all Items untill last one (egg scramble)
        if (el.id != "ER5FGMQVCMEP285YRF"){
            if (el.instructableType == "I"){
                getItemFromDb(el);
            }
            return true;
        }
        else{
            completed = true;
            return false;
        }
    });

    if (!completed){
        var newOffset = limit + offset;
        api.instructablesGetListApi(limit, newOffset, sort, type, getAllItems);
    }
    else{
        console.log('Done gathering new items from the API.');
        setTimeout(
            function()
            {
                db.connection.end();
            }, 1000 * 60 * 30);
    }
};


// Collect original Data
var getItemFromDb = function(apiItem){
    item.getItem(apiItem, db, collectEvents);
};

// Collect all Associated Events
var collectEvents = function(dbItem, apiItem){
    if(dbItem) {
        event.collectChanges(db, dbItem, apiItem, addEventData);
    }
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

    var apiTranslation = {
        title: apiItem.title,
        category: apiItem.category,
        channel: apiItem.channel,
        featured: apiItem.featured,
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

api.instructablesGetListApi(null, null, null, null, getAllItems);


