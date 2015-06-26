/**
 * Mysql Setup Module
 * @type {exports|module.exports}
 */

// Load Dependencies
var config = require('../config.json');
var mysql = require('mysql2');

var database = config.database;
var db = module.exports = {};

db.connection = mysql.createConnection({
    host        : database.host,
    user        : database.user,
    password    : database.pass,
    database    : database.database
});


