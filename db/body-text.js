var bodyText = module.exports = {};


var tableSchema = "id INT NOT NULL AUTO_INCREMENT, " +
        "item_id VARCHAR(100), " +
        "step_number INT, " +
        "body_text TEXT, " +
        "PRIMARY KEY (ID)";


var table = 'body_text';

var itemCallback = function(err, result){
    if (err) {
        console.log("MySQL Body Text "+ err);
    }
    else {
        console.log(result);
    }
};

bodyText.setup = function(db){
    db.connection.query(
        "CREATE TABLE IF NOT EXISTS ?? (" + tableSchema + ")",
        [table],
        itemCallback
    );
};


bodyText.insert = function(db, itemId, insertStep){

    var fields = [ 'item_id', 'step_number', 'body_text'];
    var data = [itemId, insertStep.stepIndex, insertStep.body];

    if (insertStep.body){
        db.connection.query(
            "INSERT IGNORE INTO ?? (??) VALUES (?) ",
            [table, fields, data],
            itemCallback
        );
    }

};