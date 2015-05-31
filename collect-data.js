/**
 * Collect Data Script for Mysql
 *
 * Author: Brandon Mikulka
 */


// Load Local Dependencies
var api = require('./api/instructables-api');
var db = require('./db/mysql-setup');
var item = require('./db/item');

// Connect to MySQL
db.connection.connect();

// Setup items table if it is needed
item.setup(db);


// Setup Script
var mostRecentId = '';
var runScript = function(id){
    // Call instructables API
    mostRecentId = id;
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
            item.insert(db, el);
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

        // TODO: get details for new items
    }
    else{
        console.log('Done gathering new items from the API.');
        db.connection.end();
    }
};











