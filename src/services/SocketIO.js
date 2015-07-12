


/** Internal dependencies **/

var server = require('../server.js');
var socket = null;
var NewsAggregatorService = require('../services/NewsAggregatorService');


var io = require('socket.io')(server.info.port);

io.on('connection', function(socket){
  console.log('User connected');
  setInterval(function(){
    console.log('getLatestNewsFromAllTheWebsites');
    NewsAggregatorService.getLatestNewsFromAllTheWebsites(socket);
  }, 60000);

});


module.export = socket
