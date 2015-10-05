'use strict';

var winston = require('winston');
var db = require('./database');
var server = require('./server');
var articlesRoutes = new require('./routes/articlesRoutes')(server);

var NewsAggregatorService = require('./services/NewsAggregatorService');

db.connect()
  .then(function(){
    setInterval(function(){
      NewsAggregatorService.getLatestArticlesFromAllTheWebsites()
        .then(function(data){
          console.log(Date.now() + ' articles saved.');
        });
    }, 6000)

    server.start(console.info.bind(console, `Server running at: ${server.info.uri}`))
  })
  .catch(console.err);
