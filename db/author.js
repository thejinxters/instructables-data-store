var author = module.exports = {};


var tableSchema = "id VARCHAR(100), " +
        "screen_name VARCHAR(100), " +

        // Set Primary Key
        "PRIMARY KEY(id)";


var table = 'authors';

var itemCallback = function(err, result){
    if (err) {
        console.log("MySQL Author "+ err);
    }
    else {
        console.log(result);
    }
};

author.setup = function(db){
    db.connection.query(
        "CREATE TABLE IF NOT EXISTS ?? (" + tableSchema + ")",
        [table],
        itemCallback
    );
};


author.insert = function(db, insertAuthor){

    var fields = [ 'id', 'screen_name'];
    var data = [insertAuthor.id, insertAuthor.screenName];

    db.connection.query(
        "INSERT IGNORE INTO ?? (??) VALUES (?) ",
        [table, fields, data],
        itemCallback
    );
};