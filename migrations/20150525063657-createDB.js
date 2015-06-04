var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;
var mongoose = require('mongoose');

exports.up = function(db, callback) {

};

exports.down = function(db, callback) {
  callback();
};
