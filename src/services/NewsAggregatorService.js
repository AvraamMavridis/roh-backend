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
 * Parse ArticlesItems
 *
 * @param {array} Array of Articles items
 * @return {array} a promise that when will be resolved it will return the htmlNodes
 *
 */
function _parseArticles(articles){

  return _.map(articles, function(n){
    n.time = n.moment.format('DD-MM-YYYY HH:mm');
    n.displayTime = n.moment.format('HH:mm');
    n.date = n.moment.toDate();
    return n;
  });
}

function _hashArticles(articles){
  return _.map(articles, function(n){
    n.hash = md5(JSON.stringify(n.title + n.link + n.source));
    return n;
  })
}


function _parseSources(sources){
  return _.map(sources, function(source){ return source.replace(/Controller|..\/controllers\/|.js|/g,'').toLowerCase();})
}

/*
 * Aggregates and returns the Articles for all the websites
 *
 * @return {promise} a promise that when will be resolved it will return the htmlNodes
 *
 */
function _getLatestArticlesFromAllTheWebsites(){
    let controllersNames = fs.readdirSync('./controllers/').map( (name) => `../controllers/${name}` );
    let articlesPromises = [];

    for(var i = 0; i< controllersNames.length; i++){
       let ctrl = require(controllersNames[i]);
       articlesPromises.push(ctrl.getLatestNews());
    }


    return Promise.settle(articlesPromises).then(function(results){
        for(var i = 0; i < results.length; i++){
            if(results[i].isFulfilled()){
              let arts = _hashArticles(results[i].value())
              _.map(arts, Article.create)
            }
        }
    });

}


function _getListOfArticlesSources(){
  return fs.readdirSync('./controllers/').map( (name) => name.replace('Controller','') );
}

/***************
Public module
***************/
module.exports = {
  getLatestArticlesFromAllTheWebsites: _getLatestArticlesFromAllTheWebsites,
  getListOfArticlesSources:            _getListOfArticlesSources
};
