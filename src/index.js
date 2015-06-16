'use strict';

var server = require('./server');
var Socket = require('./services/SocketIO');
var winston = require('winston');

server.start(function (err) {
  winston.info(server.info.uri);
  //winston.log(err);
});

process.on('uncaughtException', function (exception) {
   console.log(exception);
});
