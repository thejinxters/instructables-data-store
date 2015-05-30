
var testConnection = module.exports = {};

// Table schema
tableSchema =  "test1 int, ";
tableSchema += "test2 VARCHAR(100), ";
tableSchema += "PRIMARY KEY(test1)";

// Function for error reporting
function _reportError(err){
    console.log("Mysql "+ err);
}


testConnection.setup = function(db){
    db.connection.query(
        "CREATE TABLE IF NOT EXISTS ?? (" + tableSchema + ")",
        ['test'],
        function (err, result){
            if (err){
                _reportError(err)
            }
            else{
                console.log(result);
            }
        }
    );
};


testConnection.insert = function(db, values){
    db.connection.query("INSERT IGNORE INTO ?? (??) VALUES (?) ",
        values,
        function (err, result) {
            if (err) {
                _reportError(err);
            }
            else {
                console.log(result);
            }
        }
    );
};

testConnection.query = function(db, table){
    db.connection.query("SELECT * FROM ??", [table], function(err, result){
    if (err){
        _reportError(err);
    }
    else{
        result.forEach( function(row){
            console.log(row.test2);
        });
    }
});
}
