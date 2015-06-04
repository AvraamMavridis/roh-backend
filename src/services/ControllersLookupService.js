'use strict';

/** External dependencies **/
var walk    = require('walk');
var Promise = require('bluebird');
var winston = require('winston');
var logger = new winston.Logger();

/***************
Private functions
***************/

/*
 * Walk controllers folder to find the list of controllers
 *
 * @return {promise} A promise which when resolves returns an array
 * of the names of the controllers in the /controllers folder
 *
 */
function _walkControllersFolder(){
  // Walker options
  var walker  = walk.walk('./src/controllers', { followLinks: false });
  var files   = [];

  return new Promise(function(resolve, reject){

    walker.on('file', function(root, stat, next) {
        files.push('../controllers/' + stat.name);
        next();
    })
    .on('end', function() {
        resolve(files);
    })
    .on('error', function() {
        logger('Unable to walk controllers folder');
        reject('Unable to walk controllers folder');
    });

  });


}

/***************
Public module
***************/
function Walker(){
  return{
    walkControllersFolder: _walkControllersFolder
  };
}

module.exports = new Walker();
