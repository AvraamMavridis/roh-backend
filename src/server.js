var Hapi = require('hapi');
var winston = require('winston');
var logger = new winston.Logger();
var newsRoutes = require('./routes/newsRoutes');
var tokenRoutes = require('./routes/tokenRoutes');
var articlesRoutes = require('./routes/articlesRoutes');

// Create a server with a host and port
var server = new Hapi.Server();

server.connection({
    port: process.env.PORT || 5000,
    routes: {
      cors: true
    }
});


var serverOptions = {
    reporters: [{
        reporter: require('good-console'),
        events: {
            start: '*',
            stop: '*',
            ops: '*',
            request: '*',
            response: '*',
            log: '*',
            error: '*'
          }
    }]
};

server.register([
  {
    register: require('good'),
    options: serverOptions
  },
  {
    register: require('blipp')
  }]
,function (err) {

    if (err) {
        logger.error(err);
    }
    else {
        server.start(function () {
            logger.log('Server started at ' + server.info.uri);
        });
    }
});

newsRoutes(server);
tokenRoutes(server);
articlesRoutes(server);

module.exports = server;
