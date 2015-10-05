// External Dependencies
var Boom = require('boom');
var Article = require('../models/Article');

/**
 * Return all the articles
 */
function _getArticles(request, reply){
  Article.find().then(reply)
}

module.exports = {
  getArticles: _getArticles
}
