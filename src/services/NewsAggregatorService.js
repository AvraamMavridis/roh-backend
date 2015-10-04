'use strict';

/** External dependencies **/
var _ = require('lodash');
var moment = require('moment');
var Promise = require('bluebird');
var md5 = require('crypto-md5');
var fs = require('fs');
var Article = require('../models/Article');

/***************
Private functions
***************/

/*
 * Parse newsItems
 *
 * @param {array} Array of news items
 * @return {array} a promise that when will be resolved it will return the htmlNodes
 *
 */
function _parseNews(news){

  return _.map(news, function(n){
    n.time = n.moment.format('DD-MM-YYYY HH:mm');
    n.displayTime = n.moment.format('HH:mm');
    n.date = n.moment.toDate();
    return n;
  });
}

function _hashNews(news){
  return _.map(news, function(n){
    n.hash = md5(JSON.stringify(n.title + n.link + n.source));
    return n;
  })
}


function _parseSources(sources){
  return _.map(sources, function(source){ return source.replace(/Controller|..\/controllers\/|.js|/g,'').toLowerCase();})
}

/*
 * Aggregates and returns the news for all the websites
 *
 * @return {promise} a promise that when will be resolved it will return the htmlNodes
 *
 */
function _getLatestNewsFromAllTheWebsites(){
    let controllersNames = fs.readdirSync('./controllers/').map( (name) => `../controllers/${name}` );
    let newsPromises = [];

    for(var i = 0; i<controllersNames.length; i++){
       let ctrl = require(controllersNames[i]);
       newsPromises.push(ctrl.getLatestNews());
    }


    return Promise.settle(newsPromises).then(function(results){
        for(var i = 0; i < results.length; i++){
            if(results[i].isFulfilled()){
              _.map(results[i].value(), Article.create)
            }
        }
    });

}


function _getListOfNewsSources(){
  return fs.readdirSync('./controllers/').map( (name) => name.replace('Controller','') );
}

/***************
Public module
***************/
module.exports = {
  getLatestNewsFromAllTheWebsites: _getLatestNewsFromAllTheWebsites,
  getListOfNewsSources:            _getListOfNewsSources
};
