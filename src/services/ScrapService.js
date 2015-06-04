'use strict';

/** External dependencies **/
var q = require('Q');
var scrap = require('scrap');

/***************
Private functions
***************/

/*
 * Returns the htmlNodes for the latest news Section
 *
 * @param {String} website's url
 * @param {String} the jqery selector
 * @return {promise} a promise that when will be resolved it will return the htmlNodes
 *
 */
function _getLatestNewsNodes(url, selector){
  var deferred = q.defer();

  scrap(url, function(err, $) {
    var newsNodes = $(selector);
    deferred.resolve({ 'newsNodes': newsNodes });
  });

  return deferred.promise;
}

/***************
Public module
***************/
function ScrapService(){
  return {
    getLatestNewsNodes: _getLatestNewsNodes
  };
}


module.exports = new ScrapService();
