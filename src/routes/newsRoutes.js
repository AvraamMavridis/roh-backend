/** External dependencies **/
var winston = require('winston');
var _ = require('lodash');

/** Internal dependencies **/
var NewsAggregatorService = require('../services/NewsAggregatorService');

/** Define routes **/
function newsRoutes(server){
  // Add the route
  server.route({
      method: 'GET',
      path:'/news/{site?}',
      handler: function (request, reply) {
        var site = request.params.site;
        if(_.isUndefined(site)){
          NewsAggregatorService.getLatestNewsFromAllTheWebsites()
            .then(function(data){
              winston.info('News retrieved');
              reply(data);
            });
        }
        else {
          NewsAggregatorService.getLatestNewsFromAllTheWebsites(site)
            .then(function(data){
              reply([10,20,30]);
            })
            .catch(function(error){
              reply(error);
            });
        }

      }
  });

  // Add the route
  server.route({
      method: 'GET',
      path:'/sources',
      handler: function (request, reply) {
        NewsAggregatorService.getListOfNewsSources()
          .then(function(data){
            reply(data);
          })
          .catch(function(error){
            reply(error);
          });
      }
  });
}

module.exports = newsRoutes;
