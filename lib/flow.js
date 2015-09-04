(function() {
	'use strict';
	exports.init = function(resourceName, maxResult) {
		return function(req, res, next) {
			if (!resourceName) return res.status(500).send({reason: 'Technical error : resourceName is not defined'});
			if (!maxResult) return res.status(500).send({reason: 'Technical error : maxResult is not defined'});
			req.resourceName = resourceName;
			req.maxResult = maxResult;
			next();
		};
	};

	exports.endFind = function(req, res, next) {
		var status = 200;		 
	    if (req.result.length < req.count) {
	    	status = 206;
	    }
	    return res.status(status).json(req.result);
	};

}) ();