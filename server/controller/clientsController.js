var {mongoose} = require('../db/mongoose');
var moment = require('moment');
const _ = require('lodash');

var base = require('./baseController');
var {Project} = require('../models/project');
var {User} = require('./../models/user');


var read = (req, res, next) => {
	var body = _.pick(req.body, ['email']);
	
}

module.exports = {read};
