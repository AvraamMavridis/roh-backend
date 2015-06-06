'use strict';

/** External dependencies **/
var Xray = require('x-ray');
var x = Xray();
var Promise = require('bluebird');

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
        time: '.story-date .time'
      }])(function(err, result){
        if(err) reject(err)
        else resolve(result)
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
