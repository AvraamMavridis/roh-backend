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
      x('http://www.in.gr/',
      '#in-home_latest_articles > .main > [class^="section"]',
      [{
        title: '.sectionText',
        link: '.sectionText a@href',
        time: '.sectionTime'
      }])(function(err, result){
        if(err) reject(err)
        else resolve(result)
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
