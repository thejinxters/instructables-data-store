var item = module.exports = {};

var moment = require('moment');
var bodyText = require('./body-text');

// Table schema
var tableSchema =  "id VARCHAR(100), " +
        // Item Base Info
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

        // Item Description
        "author_id VARCHAR(100), " +
        "type VARCHAR(100), " +
        "status VARCHAR(100), " +
        "edit_version INT, " +
        "display_category VARCHAR(100), " +
        "display_channel VARCHAR(100), " +
        "comments INT, " +
        "step_count INT, " +
        "popular_flag BOOLEAN, " +
        "feature_flag BOOLEAN, " +
        "sponsored_flag BOOLEAN, " +
        "pg_flag BOOLEAN, " +
        "tags TEXT, " +
        "tags_count INT, " +
        "attached_files INT, " +
        "attached_images INT, " +
        "min_step_wordcount INT, " +
        "max_step_wordcount INT, " +
        "average_step_wordcount INT, " +
        "steps_containing_words INT, " +
        "license_name VARCHAR(255), " +
        "license_url VARCHAR(100), " +

        // Set Primary Key
        "PRIMARY KEY(id)";

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

    // Format Date for SQL
    var publishDate = moment(insertItem.publishDate, "ddd MMM DD HH:mm:ss Z YYYY ").format("YYYY-MM-DD HH:mm:ss");

    var fields = [ 'id', 'url', 'title', 'category', 'channel', 'author',
        'publish_date', 'image_url', 'featured', 'views', 'favorites',
        'instructable_type'
    ];
    var data = [insertItem.id, insertItem.url, insertItem.title, insertItem.category,
        insertItem.channel, insertItem.author, publishDate, insertItem.imageUrl,
        insertItem.featured, insertItem.views, insertItem.favorites, insertItem.instructableType
    ];

    db.connection.query(
        "INSERT IGNORE INTO ?? (??) VALUES (?) ",
        [table, fields, data],
        itemCallback
    );
};

item.updateDetails = function(db, itemDetails){

    // Create Tags string
    var itemTags = itemDetails.keywords[0];
    for (var i = 1; i < itemDetails.keywords.length; i++){
        itemTags += ', ' + itemDetails.keywords[i];
    }

    //Get Image Counts
    var itemImageCount = 0;
    for (var j = 0; j < itemDetails.files.length; j++){
        var imgTypes = /[.]jpg$|[.]png$/;
        if (imgTypes.test(itemDetails.files[j].name)){
            itemImageCount++;
        }
    }

    //Get Word Counts
    var itemMaxWordcount = 0;
    var itemMinWordcount = Number.POSITIVE_INFINITY;
    var itemAverageWordcount = 0;
    try {
    for (var k = 0; k < itemDetails.steps.length; k++){
        var stepWordcount = itemDetails.steps[k].wordCount;
        if (stepWordcount > itemMaxWordcount){
            itemMaxWordcount = stepWordcount;
        }
        if (stepWordcount < itemMinWordcount) {
            itemMinWordcount = stepWordcount;
        }
        itemAverageWordcount += stepWordcount;

        bodyText.insert(db, itemDetails.id, itemDetails.steps[k]);
    }
    }
    catch (err) {
        console.log(err);
    }
    itemAverageWordcount /= itemDetails.steps.length;

    var data = {
        author_id: itemDetails.author.id,
        type: itemDetails.type,
        status: itemDetails.status,
        edit_version: itemDetails.editVersion,
        display_category: itemDetails.displayCategory,
        display_channel: itemDetails.displayChannel,
        comments: itemDetails.comments,
        step_count: itemDetails.stepCount,
        popular_flag: itemDetails.popularFlag,
        feature_flag: itemDetails.featureFlag,
        sponsored_flag: itemDetails.sponsoredFlag,
        pg_flag: itemDetails.pgFlag,
        tags: itemTags,
        tags_count: itemDetails.keywords.length,
        attached_files: itemDetails.files.length,
        attached_images: itemImageCount,
        min_step_wordcount: itemMinWordcount,
        max_step_wordcount: itemMaxWordcount,
        average_step_wordcount: parseInt(itemAverageWordcount),
        steps_containing_words: itemDetails.numStepsByWordCount,
        license_name: itemDetails.license.fullName,
        license_url: itemDetails.license.url
    };

    db.connection.query(
        "UPDATE ?? SET ? WHERE `id`=?",
        [table, data, itemDetails.id],
        itemCallback
    )
};


item.getMostRecentItem = function(db, callback){
    db.connection.query(
        "SELECT * FROM ?? ORDER BY publish_date DESC LIMIT 1",
        [table],
        function (err, result){
            var mostRecentId = [];
            if (err) {
                console.log("MySQL Recent Item "+ err);
            }
            else{
                if (result.length > 0) {
                    mostRecentId = result[0].id;
                }
                callback(mostRecentId);
            }

        }
    );
};

item.getAllItemIds = function(db, callback){
    db.connection.query(
        "SELECT id FROM ??",
        [table],
        function (err, result){
            if (err) {
                console.log("MySQL Get Item Ids "+ err);
            }
            else {
                callback(result);
            }
        }

    );
};

item.getItem = function(apiItem, db, callback){
  db.connection.query(
      "SELECT * FROM ?? WHERE id = ? LIMIT 1",
      [table, apiItem.id],
      function (err, result){
          if (err) {
              console.log("MySQL Get Item "+ err);
          }
          else {
              callback(result[0], apiItem);
          }
      }
  );
};