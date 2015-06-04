var event = module.exports = {};

var moment = require('moment');

// Table schema
var tableSchema =  "id VARCHAR(100), " +
        // Item Base Info
    "collected_date DATETIME, " +
    "url VARCHAR(255), " +
    "title VARCHAR(255), " +
    "category VARCHAR(100), " +
    "channel VARCHAR(100), " +
    "author VARCHAR(100), " +
    "publish_date DATETIME, " +
    "image_url VARCHAR(255), " +
    "featured BOOLEAN, " +
    "views INT, " +
    "favorites INT, " +
    "instructable_type VARCHAR(10), " +

        // Item Description
    "author_id VARCHAR(100), " +
    "type VARCHAR(100), " +
    "status VARCHAR(100), " +
    "edit_version INT, " +
    "display_category VARCHAR(100), " +
    "display_channel VARCHAR(100), " +
    "comments INT, " +
    "step_count INT, " +
    "popular_flag BOOLEAN, " +
    "feature_flag BOOLEAN, " +
    "sponsored_flag BOOLEAN, " +
    "pg_flag BOOLEAN, " +
    "tags TEXT, " +
    "tags_count INT, " +
    "attached_files INT, " +
    "attached_images INT, " +
    "min_step_wordcount INT, " +
    "max_step_wordcount INT, " +
    "average_step_wordcount INT, " +
    "steps_containing_words INT, " +
    "license_name VARCHAR(255), " +
    "license_url VARCHAR(100), " +

        // Set Primary Key
    "PRIMARY KEY(id)";

var table = 'events';

var itemCallback = function(err, result){
    if (err) {
        console.log("MySQL Event "+ err);
    }
    else {
        console.log(result);
    }
};

event.setup = function(db){
    db.connection.query(
        "CREATE TABLE IF NOT EXISTS ?? (" + tableSchema + ")",
        [table],
        itemCallback
    );
};

event.insert = function() {

};