


/** Internal dependencies **/

var server = require('../server.js');
var socket = null;
var NewsAggregatorService = require('../services/NewsAggregatorService');


var io = require('socket.io')(server.info.port);

io.on('connection', function(socket){

  setInterval(function(){
    NewsAggregatorService.getLatestNewsFromAllTheWebsites(socket);
  }, 3000);

});


module.export = socket
