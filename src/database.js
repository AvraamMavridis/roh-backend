'use strict';

var mongoose = require('mongoose');
var Promise = require('bluebird');

var connection = mongoose.connection;


class Database{

  constructor(){}

  static connect(){
    mongoose.connect('mongodb://root:12345678@ds029224.mongolab.com:29224/results');
    return new Promise(function(resolve, reject){
      connection.once('open', function(data){
         console.info('Connection to the database established.');
         resolve('Connection to the database established.')
      });

      connection.on('error', function(error){
        console.error('Connection to the database failed.');
        reject(error)
      });
    });
  }
}

module.exports = Database;
