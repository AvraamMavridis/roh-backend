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
      x('http://www.protothema.gr/articles-full-list/',
      '.search-list >   ul li',
      [{
        title: 'h4 a',
        link: 'h4 a@href',
        time: '.time',
        image: '.img-holder > img@src',
        description: 'p:nth-of-type(2)'
      }])(function(err, result){
        if(err) reject(err)
        else{
          result = _.map(result, function(res){
            var hour = res.time;
            var date = moment().get('date') + ' ' + (moment().get('month') + 1) + ' ' + moment().get('year');
            var mom = moment(date + ' ' + hour, 'DD-MM-YYYY HH:mm');
            res.moment = mom;
            delete res.time;
            res.type = "Πολιτική";
            res.source = 'protothema';
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
function ProtoThemaController(){
  return{
    getLatestNews: _getLatestNews
  };
}

module.exports = new ProtoThemaController();
