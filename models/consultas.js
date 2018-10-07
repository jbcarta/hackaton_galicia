var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
		name: {type: String, required: true},
		surname: {type: String, required: true},
		area: {type: String, required: false},
		email: {type: String, required: false},
		phone: {type: String, required: false},
		comments: {type: String, required: false},

});

module.exports = mongoose.model('consultas', schema);