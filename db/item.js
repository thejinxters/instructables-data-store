var item = module.exports = {};

// Table schema
var tableSchema =  "id VARCHAR(100), ";
tableSchema += "url VARCHAR(100), ";
tableSchema += "title VARCHAR(100), ";
tableSchema += "category VARCHAR(100), ";
tableSchema += "channel VARCHAR(100), ";
tableSchema += "author VARCHAR(100), ";
tableSchema += "publish_date VARCHAR(100), ";
tableSchema += "image_url VARCHAR(100), ";
tableSchema += "featured BOOLEAN, ";
tableSchema += "views int, ";
tableSchema += "favorites int, ";
tableSchema += "instructable_type VARCHAR(100), ";
tableSchema += "PRIMARY KEY(id)";

var table = 'items';

// Function for error reporting

var itemCallback = function(err, result){
    if (err) {
        console.log("MySQL Item "+ err);
    }
    else {
        console.log(result);
    }
};

item.setup = function(db){
    db.connection.query(
        "CREATE TABLE IF NOT EXISTS ?? (" + tableSchema + ")",
        [table],
        itemCallback
    );
};

item.insert = function(db, insertItem){

    var table = 'items';
    var fields = [ 'id', 'url', 'title', 'category', 'channel', 'author',
        'publish_date', 'image_url', 'featured', 'views', 'favorites',
        'instructable_type'
    ];
    var data = [insertItem.id, insertItem.url, insertItem.title, insertItem.category,
        insertItem.channel, insertItem.author, insertItem.publishDate, insertItem.imageUrl,
        insertItem.featured, insertItem.views, insertItem.favorites, insertItem.instructableType
    ];

    db.connection.query(
        "INSERT IGNORE INTO ?? (??) VALUES (?) ",
        [table, fields, data],
        itemCallback
    );
};

item.getMostRecentItem = function(db, callback){
    db.connection.query(
        "SELECT * FROM ?? ORDER BY publish_date DESC LIMIT 1",
        [table],
        function (err, result){
            var mostRecentId = result[0].id;
            callback(mostRecentId);
        }
    );
};