(function () {
  'use strict';
  var flow = require('./lib/flow'),
      mongoose = require('./lib/mongoose'),
      mongo = require('./lib/mongo'),
      happyRestFilters = require('happyrestfilters'),
      happyRestFields = require('happyrestfields'),
      happyRestRange = require('happyrestrange'),
      happyRestSort = require('happyrestsort');

  module.exports = {
    findMongoose : function(app, resourceRoute, resourceName, maxResult, model) {
      app.get(resourceRoute, flow.init(resourceName, maxResult), mongoose.init(model), happyRestFilters.extractFilters, happyRestRange.extractRange, happyRestSort.extractSort, mongoose.count, mongoose.find, happyRestFields.selectionFields, happyRestRange.setHeader, flow.endFind);
    },
    findMongo : function(app, resourceRoute, resourceName, maxResult, collectionName) {
      app.get(resourceRoute, flow.init(resourceName, maxResult), mongo.init(collectionName), happyRestFilters.extractFilters, happyRestRange.extractRange, happyRestSort.extractSort, mongo.count, mongo.find, happyRestFields.selectionFields, happyRestRange.setHeader, flow.endFind);
    },
  };
}) ();