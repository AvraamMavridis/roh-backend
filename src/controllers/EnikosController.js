'use strict';

/** External dependencies **/
var cheerio = require('cheerio');
var Promise = require('bluebird');

/** Internal dependencies **/
var ScrapService = require('../services/ScrapService');
var NewsObject = require('../models/NewsObject');

/** Configuration of Controller **/
var config = {
  url: 'http://www.enikos.gr/',
  latestNewsSelector: '.content-list ul li',
  source: 'http://www.enikos.gr/'
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
                      var title = $(newsNodes[i]).find('.title h2 a').text().trim();
                      var link = config.source + $(newsNodes[i]).find('.title h2 a').attr('href');
                      var time = $(newsNodes[i]).find('.hour').text().replace(/[^0-9:.]|/g, '').slice(-5);
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
