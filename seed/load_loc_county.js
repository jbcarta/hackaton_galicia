
// Load States desde CSV

const utf8 = require('utf8');

var recNode = require('../models/loc_county');

var mongoose = require('mongoose');


//mongoose.connect('mongodb://127.0.0.1:27017/casupo');
mongoose.connect('mongodb://testuser:20160707@ds017175.mlab.com:17175/shopping');
//mongoose.connect('mongodb://invoice:Inv.1984@admapps01:27017/invoice2pay');

var db = mongoose.connection;

mongoose.connection.on('open', function() {
    console.log("Connected to Mongoose...");
});

db.on('error', console.error.bind(console, 'connection error:'));

var csv = require('ya-csv');
var reader = csv.createCsvFileReader('ar_county2.csv');
//var reader = csv.createCsvFileReader('caracteres_especiales.csv');
var data = [];
var arrayobject = [];
var done = 0;


// -----------------------------
//  VERSION NUEVA UTF8

/*
fs = require("fs");
var csvText = fs.readFileSync('ar_county1.csv', 'utf8');


console.log(csvText[10]);
console.log(csvText[10].toString('utf8'));
//var stream = fs.createReadStream(filePath);
 
RETURN
*/
//  END NUEVA UTF8
// -----------------------------------

reader.on('data', function(rec) 
{
    //let bufferOne = Buffer.from(rec[0]);
    //console.log(bufferOne);    
    //console.log(bufferOne.toString('utf8'));
    console.log(rec[0]);

    
	vals = rec[0];	
	vals1 = vals.split(";");
	//	console.log(vals1[0]);
	//	console.log(vals1[1]);
	//	console.log(vals1[2]);
	//	console.log(vals1[3]);
	//	console.log(vals1[4]);
//	console.log("rec:",done," Supplier creation in progress..", vals1[0]);

	arrayobject.push( 
		new recNode({
			country: vals1[0],
			state: vals1[1],
            county : vals1[2]
		}));

		done++;

//	data.push(rec);
}).on('end', function() 
{
	console.log("done:",done);
	console.log("arrayobject.length:",arrayobject.length);
	j=0
	for (var i=0; i < arrayobject.length; i++) {
	//console.log("record nro. ",i);
	arrayobject[i].save(function(err, result) {
        //	var stack = new Error().stack
		console.log( "Grabando:",j, result, err );
		j++;
		if (j === arrayobject.length) {
			exit();
		}
	});
}

});


function exit() {
	console.log("exit.");	
	mongoose.disconnect();
	console.log("exit - despues de mongoose.");		
}


