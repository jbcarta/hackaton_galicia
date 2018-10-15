var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
		country: {type: String, required: true},
		a2: {type: String, required: true},
		a3: {type: String, required: true},
        country_number : {type: String, required: true}
});

module.exports = mongoose.model('loc_countries', schema);

	