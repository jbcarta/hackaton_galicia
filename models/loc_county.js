var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
		country: {type: String, required: true},
		state: {type: String, required: true},
        county: {type: String, required: true}
});

module.exports = mongoose.model('loc_county', schema);

	