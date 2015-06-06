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
      x('http://news247.gr/',
      '.liveblog .blog',
      [{
        title: '.sum-right a:nth-child(2)',
        link: 'a@href',
        time: '.time_published'
      }])(function(err, result){
        if(err) reject(err)
        else resolve(result)
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
