'use strict';

/** External dependencies **/
var _ = require('lodash');
var moment = require('moment');
var Promise = require('bluebird');
var md5 = require('crypto-md5');


/** Internal dependencies **/
var Walker = require('./ControllersLookupService');

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
    moment.locale('el');
    n.time = moment(n.time || 0,'HH:mm');
    n.displayTime = moment(n.time).format('dddd, HH:mm a');
    n.date = moment(n.time).toDate().getTime();
    return n;
  });
}

function _hashNews(news){
  return _.map(news, function(n){
    n.hash = md5(JSON.stringify(n.title + n.link + n.source));
    return n;
  })
}

/*
 * Sort news by time
 *
 * @param {array} Array of news items
 * @return {array} a promise that when will be resolved it will return the htmlNodes
 *
 */
function _sortNews(news){
  var sortedNews =  news.sort(function(a, b) {
    return a.date - b.date;
  });

  return sortedNews;
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
function _getLatestNewsFromAllTheWebsites(website){

  return Walker.walkControllersFolder()
        .then(function(controllersNames){

          var ctrlPromises = [];
          for(var i = 0; i<controllersNames.length; i++){
            if(website){
              var p = controllersNames[i].toLowerCase();
              if(_.contains(p, website)){
                var ctrl = require(controllersNames[i]);
                ctrlPromises.push(ctrl.getLatestNews());
              }
            }
            else{
              var ctrl = require(controllersNames[i]);
              ctrlPromises.push(ctrl.getLatestNews());
            }

          }

          return controllersNames.concat(website);

        })
        .then(function(ctrlPromises){
          //ctrlPromises = _.compact(ctrlPromises);
          return ctrlPromises
        })
        .then(function(dt){
          //var listOfNews = _.compact(data);
          //listOfNews = _.flatten(listOfNews);
          //listOfNews = _parseNews(listOfNews);
          //listOfNews = _sortNews(listOfNews);
          //listOfNews = _hashNews(listOfNews);
          return dt;
        })
        .catch(function(error){
          return Promise.reject(error);
        });
}


function _getListOfNewsSources(){
  return new Promise(function(resolve, reject){
    Walker.walkControllersFolder()
          .then(function(listOfNewsSources){
            listOfNewsSources = _parseSources(listOfNewsSources);
            Promise.resolve(listOfNewsSources);
          })
          .catch(function(error){
            reject(error);
          });
  })
}

/***************
Public module
***************/
module.exports = {
  getLatestNewsFromAllTheWebsites: _getLatestNewsFromAllTheWebsites,
  getLatestNewsFromOneWebsite:     _getLatestNewsFromAllTheWebsites,
  getListOfNewsSources:            _getListOfNewsSources
};
