var event = module.exports = {};

var moment = require('moment');

// Table schema
var tableSchema =  "event_id INT NOT NULL AUTO_INCREMENT, " +
        "event_date DATETIME, " +
        "event_key VARCHAR(100), " +
        "id VARCHAR(100), " +
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


            // Set Primary Key
        "PRIMARY KEY(event_id)";

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

event.insert = function(db, id, eventField, eventData) {
    var eventDate = moment().format("YYYY-MM-DD HH:mm:ss");
    db.connection.query(
        "INSERT INTO ?? (??) VALUES (?) ",
        [table, ['id', 'event_date', 'event_key', eventField], [id, eventDate, eventField, eventData]],
        itemCallback
    )
};

event.collectChanges = function(db, dbItem, apiItem, callback){
    db.connection.query(
        "SELECT * FROM ?? WHERE id=?",
        [table, dbItem.id],
        function(err, result){
            if (err) {
                console.log("MYSQL Event changes " + err);
            }
            else{
                callback(result, dbItem, apiItem);
            }
        }
    )
};