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
function _getLatestNewsFromAllTheWebsites(socket){

  return Walker.walkControllersFolder()
        .then(function(controllersNames){

          var ctrlPromises = [];
          for(var i = 0; i<controllersNames.length; i++){
            var ctrl = require(controllersNames[i]);
              ctrl.getLatestNews()
                  .then(function(listOfNews){
                    listOfNews = _.compact(listOfNews);
                    listOfNews = _.flatten(listOfNews);
                    listOfNews = _parseNews(listOfNews);
                    listOfNews = _hashNews(listOfNews);
                    socket.emit('news arrived', listOfNews);
                  })

            }

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
