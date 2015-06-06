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
    n.time = moment(n.time,'HH:mm');
    n.displayTime = moment(n.time).format('dddd, HH:mm a');
    n.date = moment(n.time).toDate().getTime();
    return n;
  });
}

function _hashNews(news){
  return _.map(news, function(n){
    n.hash = md5(n.title + n.link + n.source);
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
function _getLatestNewsFromAllTheWebsites(){

  var ctrlPromises = [];

  return Walker.walkControllersFolder()
        .then(function(controllersNames){
            ctrlPromises = _.map(controllersNames,function(name){
              var ctrl = require(name);
              return ctrl.getLatestNews();
            });

            return Promise.settle(ctrlPromises)
                          .then(function(results){
                                var news = [];
                                for(var i = 0; i < results.length; i++){
                                    if(results[i].isFulfilled()){
                                      news.push(results[i].value());
                                }
                              }
                              return news;
                          });
        })
        .then(function(listOfNews){
          listOfNews = _.flatten(listOfNews);
          listOfNews = _parseNews(listOfNews);
          listOfNews = _sortNews(listOfNews);
          listOfNews = _hashNews(listOfNews);
          return Promise.resolve(listOfNews);
        })
        .catch(function(error){
          logger.log(error);
        });
}

/*
 * Returns the news from a website
 *
 * @param {string} The website name uppercase
 * @return {promise} a promise that when will be resolved it will return the htmlNodes
 *
 */
function _getLatestNewsFromOneWebsite(website){
  var ctrl  = null;
  return new Promise(function(resolve, reject){
    ctrl = require('../controllers/' + website + 'Controller');
    if(_.isUndefined(ctrl)){
      var msg = 'Unable to require ../controllers/' + website + 'Controller';
      return Promise.reject(msg);
    }
    else{
      ctrl.getLatestNews()
          .then(function(listOfNews){
            listOfNews = _.flatten(listOfNews);
            listOfNews = _parseNews(listOfNews);
            listOfNews = _sortNews(listOfNews);
            listOfNews = _hashNews(listOfNews);
            return Promise.resolve(listOfNews);
          });
    }
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
  getLatestNewsFromOneWebsite:     _getLatestNewsFromOneWebsite,
  getListOfNewsSources:            _getListOfNewsSources
};
