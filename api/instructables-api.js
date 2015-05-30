/**
 * Instructables Api Calls
 */

// Load Dependencies
var unirest = require('unirest');
var config = require('../config.json');

var mashapeKey = config.mashapeKey;
var Api = module.exports = {};

/**
 * Creates and makes an API call to return a list of instructable items
 * @param limit
 * @param offset
 * @param sort
 * @param type
 */
Api.instructablesGetListApi = function(limit, offset, sort, type){
    //Set Defaults
    var useLimit = limit || 20;
    var useOffset = offset || 0;
    var useSort = sort || 'recent';
    var useType = type || 'id';

    var url = "https://devru-instructables.p.mashape.com/list?limit="+ useLimit +
        "&offset=" + useOffset +
        "&sort=" + useSort +
        "&type=" + useType;

    unirest.get("https://devru-instructables.p.mashape.com/list?limit=20&offset=0&sort=recent&type=id")
        .header("X-Mashape-Key", mashapeKey)
        .header("Accept", "application/json")
        .end(function (result) {
            var items = result.body.items;
            items.forEach( function(item) {
                console.log(item);
            });
        });
};
