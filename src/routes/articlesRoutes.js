// External dependencies
var Joi = require('joi');
// Internal dependencies
var articlesHandler = require('../handlers/articlesHandler.js');

/**
 * Register articles routes
 * @param{object} server
 */
function articleRoutes(server){
  server.route({
    method: ['GET'],
    path: '/articles/{article_id?}',
    config: {
      handler: articlesHandler.getArticles,
      validate:{
        query:{
          article_id: Joi.string()
        }
      }
    }
  });
}

module.exports = articleRoutes
