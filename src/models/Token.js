/** Internal dependencies **/
var db = require('../database');
var Schema = db.Schema;
var Promise = require('bluebird');

// Define article Schema
var tokenSchema = new Schema({
  token: { type: String, unique: true },
  username: { type: String },
  createdAt: { type: Date, expires: 86400, default: Date.now }
});

// Define article model
function Token(){
  var _Token = db.model('_Token', tokenSchema);

  this.create = function(token){
    return new Promise(function(resolve, reject){
      _Token.create(token,function(err, data){
        if(err){
          reject(err);
        }
        else{
          resolve(data);
        }
      });
    });
  }

  this.findAll = function(){
    return _Token.find().exec();
  }

  this.find = function(query){
    return _Token.find(query).exec();
  }
}


module.exports = new Token();
