// External dependencies
var Joi = require('joi');
// Internal dependencies
var articlesHandler = require('../handlers/articlesHandler.js');

function articleRoutes(server){
  server.route({
    method: ['POST'],
    path: '/articles',
    config: {
      handler: articlesHandler.saveArticle,
      validate:{
        payload:{
          title: Joi.string().required(),
          link: Joi.string().required(),
          image: Joi.string(),
          username: Joi.string().required(),
          token: Joi.string().required(),
          hash: Joi.string().required(),
          summary: Joi.string(),
          time: Joi.string(),
          date: Joi.date(),
          source: Joi.string(),
          displayTime: Joi.string()
        }
      }
    }
  });

  server.route({
    method: ['GET'],
    path: '/articles',
    config: {
      handler: articlesHandler.getArticle,
      validate:{
        query:{
          username: Joi.string().required()
        }
      }
    }
  });

  server.route({
    method: ['DELETE'],
    path: '/articles',
    config: {
      handler: articlesHandler.deleteArticle,
      validate:{
        payload:{
          title: Joi.string().required(),
          link: Joi.string().required(),
          image: Joi.string(),
          username: Joi.string().required(),
          token: Joi.string().required(),
          hash: Joi.string().required(),
          summary: Joi.string(),
          time: Joi.string(),
          date: Joi.date(),
          source: Joi.string(),
          displayTime: Joi.string()
        }
      }
    }
  });
}


module.exports = articleRoutes
