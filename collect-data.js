/**
 * Collect Data Script for Mysql
 *
 * Author: Brandon Mikulka
 */


// Load Local Dependencies
var api = require('./api/instructables-api');
var db = require('./db/mysql-setup');
var testConnection = require('./db/test-connection');

api.instructablesGetListApi();
db.connection.connect();

// MySQL connections
testConnection.setup(db);
testConnection.insert(db,['test', ['test2'], ['another test']]);
testConnection.query(db, 'test');

db.connection.end();



