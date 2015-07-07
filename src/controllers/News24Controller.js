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
      x('http://news247.gr/eidiseis/',
      '.stories .article',
      [{
        title: '.title',
        link: '.title@href',
        time: '.time',
        image: 'img@src',
        description: '.summary > p'
      }])(function(err, result){
        if(err) reject(err)
        else{
          result = _.filter(result, function(res){ return _.has(res, 'title') && _.has(res, 'time'); });
          result = _.map(result, function(res){
              var date = res.time.split(' ')[1]
              var hour = res.time.slice(-5);
              date = date + ' ' + (moment().get('month') + 1) + ' ' + moment().get('year');
              var mom = moment(date + ' ' + hour, 'DD-MM-YYYY HH:mm');
              res.moment = mom;
              res.source = 'news247';
              res.title = res.title.trim();
              res.description = res.description.trim();
              res.type = "Πολιτική";
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
function News24Controller(){
  return{
    getLatestNews: _getLatestNews
  };
}

module.exports = new News24Controller();
