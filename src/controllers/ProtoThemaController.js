'use strict';

/** External dependencies **/
var q = require('Q');
var cheerio = require('cheerio');

/** Internal dependencies **/
var ScrapService = require('../services/ScrapService');
var NewsObject = require('../models/NewsObject');

/** Configuration of Controller **/
var config = {
  url: 'https://www.protothema.gr/',
  latestNewsSelector: '.scrollflow > .content .viewport ul li ul li',
};

/***************
Private functions
***************/
function _getLatestNews(){
  var deferred = q.defer();
  var latestNews = [];

  console.log('>>>>>>>>>>>>>>>>>>>>>>>>>PROTO>>>>>>>>>>>>>>>');

  ScrapService.getLatestNewsNodes(config.url, config.latestNewsSelector)
              .then(function(results){
                  console.log('>>>>>>>>>>>>>>>>>>>>>>',results);
                  var newsNodes = results.newsNodes;
                  var $ = cheerio.load(newsNodes);
                  for(var i = 0; i<5; ++i){
                    var title = $(newsNodes[i]).find('a').text().trim();
                    var link = config.url + $(newsNodes[i]).find('ul li p a').attr('href');
                    var time = $(newsNodes[i]).find('span').text().replace(/[^0-9:.]|/g, '');
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
function ProtoThemaController(){
  return{
    getLatestNews: _getLatestNews
  };
}

module.exports = new ProtoThemaController();
