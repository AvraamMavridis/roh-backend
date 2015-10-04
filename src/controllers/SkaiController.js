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
      x('http://www.skai.gr/newsdesk',
      '.listing-container article',
      [{
        title: 'h1',
        link: 'h1 a@href',
        time: '.time',
        image: 'img@src',
        description: '.excerpt'
      }])(function(err, result){
        if(err) reject(err)
        else{
          result = _.map(result, function(res){
            var time = _.unescape(res.time).replace(/\t|\n|\r|/g, '').split('|');
            var hour = _.trim(time[1].replace(' ',''));
            var date = _.trim(time[0].replace(' ',''));
            var mom = moment(date + ' ' + hour, 'DD-MM-YYYY HH:mm');
            res.moment = mom;
            delete res.time;
            res.source = 'skai';
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
function SkaiController(){
  return{
    getLatestNews: _getLatestNews
  };
}

module.exports = new SkaiController();
