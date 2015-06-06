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
        x('http://www.enikos.gr/',
        '.content-list ul li',
        [{
          title: '.title h2 a',
          link: '.title h2 a@href',
          time: '.hour'
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
