// External Dependencies
var Boom = require('Boom');

// Internal Dependencies
var Token = require('../models/Token');
var User = require('../models/User');
var uuid = require('node-uuid');

function signup(request, reply){
    var token = {
      username: request.payload.username,
      token: uuid.v4()
    }

    User.find( {'username': request.payload.username })
        .then(function(users){

          if(users.length > 0){
            var boom = Boom.conflict('user Exists');
            reply(boom);
          }
          else{
            var user = {
              username: request.payload.username,
              password: request.payload.password
            }
            User.create(user)
             .then(function(user){
                Token.create(token)
                  .then(function(token){
                    reply(token);
                  })
                  .catch(function(err){
                    var boom = Boom.badImplementation(JSON.stringify(err));
                    reply(boom);
                  });
            });
          }
        });
}

function login(request, reply){
  var token = {
    username: request.payload.username,
    token: uuid.v4()
  }

  User.find( {'username': request.payload.username, 'password': request.payload.password })
      .then(function(users){
        console.log(users);
        if(users.length){
          Token.create(token)
            .then(function(token){
              console.log(token)
              reply(token);
            })
            .catch(function(err){
              reply({error: JSON.stringify(err)});
            });
        }
        else{
          var boom = Boom.unauthorized('User not found.');
          reply(boom);
        }
      });
}

function validate(request, reply){
  Token.find({ token: request.payload.token})
    .then(function(data){
      if(data.length){
        reply(data[0]);
      }
      else{
        var boom = Boom.unauthorized('User not auth yet.');
        reply(boom);
      }
    })
}

module.exports = {
  signup : signup,
  login: login,
  validate: validate
};
