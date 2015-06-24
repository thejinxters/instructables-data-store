/**
 * Collect Data Script for Mysql
 *
 * Author: Brandon Mikulka
 */


// Load Local Dependencies
var api = require('./api/instructables-api');
var db = require('./db/mysql-setup');
var item = require('./db/item');
var author = require('./db/author');
var bodyText = require('./db/body-text');
var RateLimiter = require('limiter').RateLimiter;

//limit api calls to 1 every 250 ms
var limiter = new RateLimiter(1, 250);

// Connect to MySQL
db.connection.connect();

// Setup tables if it is needed
item.setup(db);
author.setup(db);
bodyText.setup(db);

// Setup Script
var mostRecentId = '';
var runScript = function(id){
    // Call instructables API
    mostRecentId = id;
    // Uncommment the following to gather every instructable to date
    //mostRecentID = "ER5FGMQVCMEP285YRF";
    api.instructablesGetListApi(null, null, null, null, saveItem);
};

// Step 1: get most recently added ID from database
item.getMostRecentItem(db, runScript);

// Step 2: call api and save values until we hit the most recently added ID
var saveItem = function(limit, offset, sort, type, items){
    var completed = false;
    items.every( function(el) {
        // Save only new items
        if (el.id != mostRecentId){
            if (el.instructableType == "I"){
                item.insert(db, el);
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
        api.instructablesGetListApi(limit, newOffset, sort, type, saveItem);
    }
    else{
        console.log('Done gathering new items from the API.');
        //db.connection.end();
    }
};