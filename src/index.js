'use strict';

var server = require('./server');
var winston = require('winston');

server.start(function (err) {
  winston.info(server.info.uri);
  //winston.log(err);
});
