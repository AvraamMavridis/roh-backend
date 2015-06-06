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
      x('http://www.protothema.gr/',
      '.scrollflow > .content .viewport ul li ul li',
      [{
        title: 'a',
        link: 'ul li p a@href',
        time: 'span'
      }])(function(err, result){
        if(err) reject(err)
        else resolve(result)
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
