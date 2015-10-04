'use strict';

/** External dependencies **/
var Xray = require('x-ray');
var x = Xray();
var Promise = require('bluebird');
var _ = require('lodash');
var moment = require('moment');

/***************
Private functions
***************/
function _getLatestNews(){

  return new Promise(function(resolve, reject){
      x('http://news.in.gr/latestnews/',
      '#in-news-list',
      [{
        title: 'a',
        link: 'a@href',
        time: 'ins',
        image: 'img@src',
        description: 'td[style^="font-size:12px;color:#000000;"]'
      }])(function(err, result){
        if(err) reject(err)
        else{
          result = _.map(result, function(res){
            var mom = moment(res.time, 'DD-MM-YYYY HH:mm');
            res.moment = mom;
            res.source = 'in';
            delete res.time;
            return res;
          });
          resolve(result);
        }
      });
  });
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
