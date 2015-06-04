// Internal dependencies
var Token = require('../models/Token');
var User = require('../models/User');
var uuid = require('node-uuid');
var AuthenticationHandler = require('../handlers/authenticationHandler.js');
var Joi = require('joi');

function tokenRoutes(server){
  server.route({
    method: ['POST'],
    path: '/login',
    config: {
      handler: AuthenticationHandler.login,
      validate:{
        payload:{
          username: Joi.string().required(),
          password: Joi.string().required()
        }
      }
    }
  });

  server.route({
    method: ['POST'],
    path: '/signup',
    config: {
      handler: AuthenticationHandler.signup,
      validate:{
        payload:{
          username: Joi.string().required(),
          password: Joi.string().required()
        }
      }
    }
  });

  server.route({
    method: 'POST',
    path: '/validate',
    config: {
      handler: AuthenticationHandler.validate,
      validate:{
        payload: {
          token: Joi.string().required()
        }
      }
    }
  });
}

module.exports = tokenRoutes;
