'use strict';

var Schema = require('mongoose').Schema;

module.exports = new Schema({
	alterations: [{
		user: {
			type: String
		},
		date: {
			type: Date,
			default: Date.now
		}
	}],
	created: {
		date: {
			type: Date,
			default: Date.now
		},
		user: {
			type: String
		}
	}
}, {
	discriminatorKey: '_type'
}, { versionKey: false });