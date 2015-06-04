'use strict';

/** External dependencies **/
var cheerio = require('cheerio');
var Promise = require('bluebird');

/** Internal dependencies **/
var ScrapService = require('../services/ScrapService');
var NewsObject = require('../models/NewsObject');

/** Configuration of Controller **/
var config = {
  url: 'http://www.newsbomb.gr/oles-oi-eidhseis',
  latestNewsSelector: '.stories-list .story-block',
  source: 'http://www.newsbomb.gr'
};

/***************
Private functions
***************/
function _getLatestNews(){
  var latestNews = [];

  return new Promise(function(resolve, reject){
    ScrapService.getLatestNewsNodes(config.url, config.latestNewsSelector)
                .then(function(results){
                    var newsNodes = results.newsNodes;
                    var $ = cheerio.load(newsNodes);
                    for(var i = 0; i<5; ++i){
                      var title = $(newsNodes[i]).find('.story-title a').text().trim();
                      var link = config.source + $(newsNodes[i]).find('.story-title a').attr('href');
                      var time = $(newsNodes[i]).find('.story-date .time').text().replace(/[^0-9:.]|/g, '').slice(-5);
                      latestNews.push(new NewsObject(config.source, title, link, time));
                    }

                    resolve(latestNews);
                },

                function(error){
                  reject(error);
                  console.log('Error', error);
                })
                .catch(function(error){
                  console.log('Error', error);
                  reject(error);
                });
  });

}

/***************
Public module
***************/
function NewsBombController(){
  return{
    getLatestNews: _getLatestNews
  };
}

module.exports = new NewsBombController();
