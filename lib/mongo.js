(function() {
	'use strict';
	var _ = require('underscore');

	var getFilters = function(filters) {
		var filtersResult = {};
		_.mapObject(filters, function(val, key) {
			filtersResult[key] = { "$in" : val };
		});	
		return filtersResult;		
	};

	var getSorts = function(sorts) {
		var sortsResult = {};
		_.each(sorts, function(sort) {
			if (sort.substring(0,1) === '-') {
				sortsResult[sort.substring(1,sort.length)] = -1;
			}
			else {
				sortsResult[sort] = 1;
			}
		});
		return sortsResult;
	};

	exports.init = function(collectionName) {
		return function(req, res, next) {
			if (!req.db) {
				return res.status(500).send({reason: 'Technical error : no database defined (req.db)'});
			}
			if (!collectionName) {
				return res.status(500).send({reason: 'Technical error : database collection name is not defined'});
			}
			req.collection = req.db.collection(collectionName);
			next();
		};
	};

	exports.count = function(req,res,next) {
		var collection = req.collection;
		var range = req.happyRest.range;
		if (range !== undefined && range.offset !== undefined && range.limit !== undefined) {			
			collection.find(getFilters(req.happyRest.filters)).count(function(err, res) {
				req.count = res;
				next();					
			});
		}
	};

	exports.find = function(req, res, next) {
		var collection = req.collection;
		var range = req.happyRest.range;			
		collection.find(getFilters(req.happyRest.filters)).sort(getSorts(req.happyRest.sort)).skip(parseInt(range.offset)).limit(parseInt(range.limit) - parseInt(range.offset) + 1).toArray(function(err, res) {
			req.result = res;
			next();
		});
	};

}) ();