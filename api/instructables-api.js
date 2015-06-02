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
 * @param callback
 */
Api.instructablesGetListApi = function(limit, offset, sort, type, callback){
    //Set Defaults
    var useLimit = limit || 200;
    var useOffset = offset || 0;
    var useSort = sort || 'recent';
    var useType = type || 'id';

    var url = "https://devru-instructables.p.mashape.com/list?limit="+ useLimit +
        "&offset=" + useOffset +
        "&sort=" + useSort +
        "&type=" + useType;

    unirest.get(url)
        .header("X-Mashape-Key", mashapeKey)
        .header("Accept", "application/json")
        .end(function (result) {
            var items = result.body.items;
            callback(useLimit, useOffset, useSort, useType, items);
        });

};


Api.instructablesGetDetails = function(id, callback){

    if (!id){
        return;
    }

    var url = "https://devru-instructables.p.mashape.com/json-api/showInstructable?id=" + id;

    unirest.get(url)
        .header("X-Mashape-Key", mashapeKey)
        .header("Accept", "application/json")
        .end(function (result) {
            var itemDetails = result.body;
            callback(itemDetails);
        });

};