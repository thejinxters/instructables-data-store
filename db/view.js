var view = module.exports = {};

var moment = require('moment');

// Table schema
var tableSchema =  "view_id INT NOT NULL AUTO_INCREMENT, " +
    "view_date DATETIME, " +
    "id VARCHAR(100), " +
    "views INT, " +
    "daily_views INT, " +
        // Set Primary Key
    "PRIMARY KEY(view_id)";

var table = 'views';

var itemCallback = function(err, result){
    if (err) {
        console.log("MySQL View "+ err);
    }
    else {
        console.log(result);
    }
};

view.setup = function(db){
    db.connection.query(
        "CREATE TABLE IF NOT EXISTS ?? (" + tableSchema + ")",
        [table],
        itemCallback
    );
};

view.insert = function(db, dbItem, apiItem){
    var viewDate = moment().format("YYYY-MM-DD HH:mm:ss");
    var keys = ['id', 'views', 'daily_views', 'view_date'];
    var dailyViews = apiItem.views - dbItem.views;
    var values = [dbItem.id, apiItem.views, dailyViews,viewDate];
    db.connection.query(
        "INSERT INTO ?? (??) VALUES (?)",
        [table, keys, values],
        itemCallback
    )
};

view.collectViews = function(db, dbItem, apiItem, callback){
    db.connection.query(
        "SELECT * from ?? WHERE id=?",
        [table, dbItem.id],
        function(err, result){
            if(err){
                console.log("MySQL View Collection "+ err);
            }
            else{
                callback(result, dbItem, apiItem);
            }
        }
    )
};
