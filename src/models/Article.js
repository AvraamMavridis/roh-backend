/** External dependencies **/
var winston = require('winston');
var Promise = require('bluebird');

/** Internal dependencies **/
var db = require('../database');
var Schema = db.Schema;

// Define article Schema
var articleSchema = new Schema({
  title:  { type: String, required: true},
  link:   { type: String, required: true},
  time:   { type: String, required: true},
  source: { type: String, required: true},
  date:   { type: Date, default: Date.now },
  summary: { type: Date, default: '' },
  imageUrl: { type: Date, default: '' },
  hash:   { type: String, required: true},
  username: { type: String, default: '' }
});

// Define article model
function Article(){
  var _Article = db.model('_Article', articleSchema);

  this.create = function(article){
    return new Promise(function(resolve, reject){
      _Article.create(article,function(err, data){
        if(err){ reject(err);}
        else{ resolve(data);}
      });
    });
  }
}


module.exports = new Article();
