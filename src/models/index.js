const mongoose = require('mongoose');
const schema = require('./user');

exports.User = mongoose.model('User', schema);
