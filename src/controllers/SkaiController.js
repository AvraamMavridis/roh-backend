'use strict';

/** External dependencies **/
var Xray = require('x-ray');
var x = Xray();
var Promise = require('bluebird');

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
        time: '.time'
      }])(function(err, result){
        if(err) reject(err)
        else resolve(result)
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
