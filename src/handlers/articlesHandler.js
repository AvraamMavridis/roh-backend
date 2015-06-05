// External Dependencies
var Boom = require('boom');

/** Internal dependencies **/
var Article = require('../models/Article');
var Token = require('../models/Token');

function saveArticle(request, reply){

  Token.find({ token: request.payload.token})
    .then(function(data){
      if(data.length){
        delete request.payload.token;
        Article.create(request.payload)
          .then(function(data){
            reply(data);
          });
      }
      else{
        var boom = Boom.unauthorized('User not auth yet.');
        reply(boom);
      }
    });
}

function deleteArticle(request, reply){
  reply('Delete article');
}

function getArticle(reque, reply){
  reply('Get Article');
}

module.exports = {
  saveArticle: saveArticle,
  deleteArticle: deleteArticle,
  getArticle: getArticle
}
