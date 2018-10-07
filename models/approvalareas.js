var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AAsupplier = new mongoose.Schema({
	supplier : {type: String, required: false},
	description: {type: String, required: false}
})


var schema = new Schema({
	approvalarea: {type: String, required: true},
	description: {type: String, required: true},
	suppliers: [AAsupplier]
});

module.exports = mongoose.model('approvalareas', schema);