/** External dependencies **/
var winston = require('winston');
var Promise = require('bluebird');

/** Internal dependencies **/
var db = require('../database');
var Schema = db.Schema;

// Define article Schema
var userSchema = new Schema({
  username: { type: String },
  password: { type: String }
});

// Define article model
function User(){
  var _User = db.model('_User', userSchema);

  this.create = function(user){
    return new Promise(function(resolve,reject){
      _User.create(user, function(err,data){
        if(err){
          console.log(err);
          reject(err)
        }
        else{
          resolve(data);
        }
      });
    });
  }

  this.findAll = function(){
    return _User.find().exec();
  }

  this.find = function(query){
    return _User.find(query).exec();
  }
}


module.exports = new User();
