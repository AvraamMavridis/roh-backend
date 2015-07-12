'use strict';

/** External dependencies **/
var Xray = require('x-ray');
var x = Xray();
var Promise = require('bluebird');
var _ = require('lodash');
var moment = require('moment');

/********
Private functions
***************/
function _getLatestNews(){

  return new Promise(function(resolve, reject){
      x('http://www.newsbomb.gr/oles-oi-eidhseis',
      '.stories-list .story-block',
      [{
        title: '.story-title a',
        link: '.story-title a@href',
        time: '.story-date .time',
        image: 'img@src',
        description: '.story-intro'
      }])(function(err, result){
        if(err) reject(err)
        else{
          result = _.map(result, function(res){
            var hour = res.time;
            var date = moment().get('date') + ' ' + (moment().get('month') + 1) + ' ' + moment().get('year');
            var mom = moment(date + ' ' + hour, 'DD-MM-YYYY HH:mm');
            res.moment = mom;
            res.source = 'newsbomb';
            res.description = res.description.trim();
            res.type = "ΠΟΛΙΤΙΚΗ";
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
function NewsBombController(){
  return{
    getLatestNews: _getLatestNews
  };
}

module.exports = new NewsBombController();
