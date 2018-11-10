var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var operationSchema = new Schema (
{
	operation: {type: String, required: false}, // 01-NewProposal
    date_operation:  {type: String, required: false},
    status:  {type: String, required: false},    // 01-esperando respuesta 02-rechazado 03-aceptado
    status_date: {type: String, required: false},
    asset_key : {type: String, required: false},
    owner_publicKey: {type: String, required: false},
    investment_publicKey: {type: String, required: false},
	amount_requested: {type: String, requiered: false},
	numbers_payment:  {type: String, required: false},
	first_payment:  {type: String, required: false},
	interest_rate:  {type: String, required: false},    
	frecuency:  {type: String, required: false}	
});

module.exports = mongoose.model('Operation', operationSchema);

