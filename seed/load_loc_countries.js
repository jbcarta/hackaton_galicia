
// Load States desde CSV


var States = require('../models/loc_countries');

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
var reader = csv.createCsvFileReader('loc_countries.csv');
var data = [];
var arrayobject = [];
var done = 0;



reader.on('data', function(rec) 
{
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
		new States({
			country: vals1[0],
			a2: vals1[1],
			a3: vals1[2],
			country_number : vals1[3]
		}));

		done++;

//	data.push(rec);
}).on('end', function() 
{
	console.log("done:",done);
	console.log("arrayobject.length:",arrayobject.length);
	j=0
	for (var i=0; i < arrayobject.length; i++) {
	console.log("record nro. ",i);
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


