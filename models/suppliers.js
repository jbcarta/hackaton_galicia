var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var suppliercecos = new mongoose.Schema({
	ceco : {type: String, required: false}
})

var supplierconcept = new mongoose.Schema({
	concept : {type: String, required: false}
})

var schema = new Schema({
		codsupplier: {type: String, required: true},
		name: {type: String, required: true},		
		fiscal_number: {type: String, required: false},			
		country: {type: String, required: false},
		concepts:{type: Array, required: false},		
		account_group:{type: String, required: false},
		comments:{type: String, required: false},
		concepts:[supplierconcept],
		cecos: [suppliercecos]
});

module.exports = mongoose.model('suppliers', schema);