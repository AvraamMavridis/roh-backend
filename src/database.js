var mongoose = require('mongoose');
var winston = require('winston');
var logger = new winston.Logger();

// mongoose.connect('mongodb://localhost/users');
// var db = mongoose.connection;
//
// db.on('error', console.error.bind(console, 'connection error:'));
//
// db.once('open', function () {
//   console.log('Connection to the database established.')
// });

module.exports = mongoose;
