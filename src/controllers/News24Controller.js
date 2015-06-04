'use strict';

/** External dependencies **/
var q = require('Q');
var cheerio = require('cheerio');

/** Internal dependencies **/
var ScrapService = require('../services/ScrapService');
var NewsObject = require('../models/NewsObject');

/** Configuration of Controller **/
var config = {
  url: 'http://news247.gr/',
  latestNewsSelector: '.liveblog .blog'
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
                    var title = $(newsNodes[i]).find('.sum-right a:nth-child(2)').text().trim();
                    var link = $(newsNodes[i]).find('a').attr('href');
                    var time = $(newsNodes[i]).find('.time_published').text().replace(/[^0-9:.]|/g, '');
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
function News24Controller(){
  return{
    getLatestNews: _getLatestNews
  };
}

module.exports = new News24Controller();
