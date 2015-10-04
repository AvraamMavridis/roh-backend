'use strict';

var winston = require('winston');
var db = require('./database');

var NewsAggregatorService = require('./services/NewsAggregatorService');

db.connect()
  .then(function(){
    setInterval(function(){
      NewsAggregatorService.getLatestNewsFromAllTheWebsites()
        .then(function(data){
          console.log(Date.now() + ' articles saved.');
        });
    }, 6000)

  })
  .catch(function(err){
    console.log('err');
  })
