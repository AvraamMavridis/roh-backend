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
        x('http://www.enikos.gr/',
        '.content-list ul li',
        [{
          title: '.title h2 a',
          link: '.title h2 a@href',
          time: '.hour',
          image: 'img@src',
          description: '.text > p > a'
        }])(function(err, result){
          if(err) reject(err)
          else{
            result = _.map(result, function(res){
                var hour = res.time.slice(0,5);
                var date = moment().get('date') + ' ' + (moment().get('month') + 1) + ' ' + moment().get('year');
                var mom = moment(date + ' ' + hour, 'DD-MM-YYYY HH:mm');
                res.moment = mom;
                res.source = 'enikos';
                if(!_.isUndefined(res.description)){
                  res.description = res.description.split('\n')[0];
                }
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
