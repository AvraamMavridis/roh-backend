'use strict';

/** External dependencies **/
var winston = require('winston');
var Promise = require('bluebird');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('lodash');

// Define article Schema
var articleSchema = new Schema({
  title:  { type: String, required : true, unique: true, dropDups: true },
  link:   { type: String, required : true },
  description:   { type: String, required : true },
  image: { type: String },
  moment: { type: String },
  source: { type: String },
  time: { type: Date, default: Date.now() }
});

// Define article model
function Article(){
  var _Article = mongoose.model('_Article', articleSchema);

  this.find = function(){

    return new Promise(function(resolve, reject){
      _Article.find({}, function(err, articles){
        resolve(articles);
      });
    });

  }

  this.create = function(article){
    article.moment = JSON.stringify(article.moment);
    return new Promise(function(resolve, reject){
      _Article.create(article,function(err, data){
        if(err){
          console.error('Failed to save article');
          reject(err);
        }
        else{
          console.info('Article saved');
          resolve(data);
        }
      });
    });
  }
}


module.exports = new Article();
