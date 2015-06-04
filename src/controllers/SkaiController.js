'use strict';

/** External dependencies **/
var q = require('Q');
var cheerio = require('cheerio');

/** Internal dependencies **/
var ScrapService = require('../services/ScrapService');
var NewsObject = require('../models/NewsObject');

/** Configuration of Controller **/
var config = {
  url: 'http://www.skai.gr/newsdesk',
  latestNewsSelector: '.listing-container article',
  source: 'http://www.skai.gr'
};

/***************
Private functions
***************/
function _getLatestNews(){
  var deferred = q.defer();
  var latestNews = [];

  ScrapService.getLatestNewsNodes(config.url, config.latestNewsSelector)
              .then(function(results){
                  var newsNodes = results.newsNodes;
                  var $ = cheerio.load(newsNodes);
                  for(var i = 0; i<5; ++i){
                    var title = $(newsNodes[i]).find('h1').text().trim();
                    var link = config.source + $(newsNodes[i]).find('h1 a').attr('href');
                    var time = $(newsNodes[i]).find('.time').text().replace(/[^0-9:.]|/g, '').slice(-5);
                    latestNews.push(new NewsObject(config.source, title, link, time));
                  }

                  deferred.resolve(latestNews);
              },

              function(error){
                deferred.reject(error);
                console.log('Error', error);
              })
              .catch(function(error){
                console.log('Error', error);
                deferred.reject(error);
              });

  return deferred.promise;
}

/***************
Public module
***************/
function SkaiController(){
  return{
    getLatestNews: _getLatestNews
  };
}

module.exports = new SkaiController();
