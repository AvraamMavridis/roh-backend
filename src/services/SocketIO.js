


/** Internal dependencies **/
var NewsAggregatorService = require('../services/NewsAggregatorService');
var server = require('../server.js');

var io = require('socket.io')(server.info.port);

io.on('connection', function(socket){
  console.log('a user connected');

  setInterval(function(){
    NewsAggregatorService.getLatestNewsFromAllTheWebsites()
      .then(function(data){
        socket.emit('news arrived', data);
      });
      console.log('News for socket: ', socket.id);
  }, 3000);

});


module.export = {}
