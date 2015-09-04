(function() {
	'use strict';
	var _ = require('underscore');

	exports.init = function(model) {
		return function(req, res, next) {
			if (!model) return res.status(500).send({reason: 'Technical error : mongoose model is not defined'});
			req.model = model;
			next();
		};
	};

	exports.count = function(req,res,next) {
		var range = req.happyRest.range;
		if (range !== undefined && range.offset !== undefined && range.limit !== undefined) {
			var model = req.model;
			var mongoReq = model.count();
			_.mapObject(req.happyRest.filters, function(val, key) {
				mongoReq = model.count().where(key).in(val);
			});	
		
			mongoReq.exec().then(function(res) {
				req.count = res;				
				next();	
			});				
		}
	};

	exports.find = function(req, res, next) {
		var model = req.model;
		var range = req.happyRest.range;
		var mongoReq = model.find();
		//add filters
		_.mapObject(req.happyRest.filters, function(val, key) {
			mongoReq = model.find().where(key).in(val);
		});	
		//add sort
		_.each(req.happyRest.sort, function(sort) {
			mongoReq = mongoReq.sort(sort);
		});			
		//add range
		if (range && range.offset && range.limit) {
			mongoReq.skip(range.offset).limit(range.limit - range.offset + 1);
		}		

		mongoReq.exec().then(function(res) {
			req.result = res;
			next();
		});	
	};

}) ();