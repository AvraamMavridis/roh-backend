'use strict';

/** External dependencies **/
var q = require('Q');
var cheerio = require('cheerio');

/** Internal dependencies **/
var ScrapService = require('../services/ScrapService');
var NewsObject = require('../models/NewsObject');

/** Configuration of Controller **/
var config = {
  url: 'http://www.in.gr/',
  latestNewsSelector: '#in-home_latest_articles > .main > [class^="section"]'
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
                  for(var i = 0; i<newsNodes.length; ++i){
                    var title = $(newsNodes[i]).find('.sectionText').text().trim();
                    var link = $(newsNodes[i]).find('.sectionText > a').attr('href');
                    var time = $(newsNodes[i]).find('.sectionTime').text().replace(/[^0-9:.]|/g, '');
                    latestNews.push(new NewsObject(config.url, title, link, time));
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
function IngrController(){
  return{
    getLatestNews: _getLatestNews
  };
}

module.exports = new IngrController();
