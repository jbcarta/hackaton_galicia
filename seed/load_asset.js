
// Load States desde CSV


var States = require('../models/loc_countries');

var mongoose = require('mongoose');

    const bcDb_driver = require('bigchaindb-driver');

    //const API_PATH = 'http://localhost:9984/api/v1/';

    //const conn = new driver.Connection(API_PATH);

    const connDb = new bcDb_driver.Connection(
              "https://test.bigchaindb.com/api/v1/",
            {
                app_id: '385b62f9',
                app_key: '185a4d7d619448dbf0c725f3485fa0b6'
            });


var public_key = "FY6tCC2YNQSCkoFuXHnVpoB4Mhs6UCk9tcKW7HWsSmck";
var private_key = "6bBfBJAhbE6VJQGtdiXBY8oKqZYsWNutmQ7txWXFQAyA";


//mongoose.connect('mongodb://127.0.0.1:27017/casupo');
mongoose.connect('mongodb://testuser:20160707@ds017175.mlab.com:17175/shopping');
//mongoose.connect('mongodb://invoice:Inv.1984@admapps01:27017/invoice2pay');

var db = mongoose.connection;

mongoose.connection.on('open', function() {
    console.log("Connected to Mongoose...");
});

db.on('error', console.error.bind(console, 'connection error:'));

// ---------------------
//     Blockchain
                
        const driver = require('bigchaindb-driver');
        console.log("public_key:", public_key);
        console.log("private_key:", private_key);                  


        const conn = new driver.Connection(
            'https://test.bigchaindb.com/api/v1/',
            { app_id: '385b62f9',
              app_key: '185a4d7d619448dbf0c725f3485fa0b6' });

        var csv = require('ya-csv');
        var reader = csv.createCsvFileReader('haciendas.csv');
        var data = [];
        var arrayobject = [];
        var done = 0;

        var asset_schema = 
            {
                publicKey_owner: {type: String, required: true},
                asset_type: {type: String, required: true},
                asset_name: {type: String, required: true},
                year_foundation: {type: String, required: true},
                asset_cuit: {type: String, required: true},
                asset_tipo_doc: {type: String, required: true},
                asset_num_doc: {type: String, required: true},
                asset_bank_register: {type: String, required: true},
                cadastro: {type: String, required: true},
                country: {type: String, required: true},
                state: {type: String, required: true},
                city: {type: String, required: true},
                location: {type: String, required: true},
                latitude: {type: String, required: true},
                longitude: {type: String, required: true},
                surface_total: {type: String, required: true},
                surface_agricultura: {type: String, required: true},
                owner_name: {type: String, required: true},
                owner_cuit: {type: String, required: true},
                owner_doc_type: {type: String, required: true},
                owner_num_type: {type: String, required: true},
                owner_bank_register: {type: String, required: true}
            };


        var metadata_schema = 
            {
                products: {type: String, required: true},
                period: {type: String, required: true},
                agricultural_system: {type: String, required: true},
                surface_planted: {type: String, required: true},
                tons_harvested: {type: String, required: true},
                income_gross: {type: String, required: true},
                income_net: {type: String, required: true}            
            };


reader.on('data', function(rec) 
{
    //console.log(rec);
	vals = rec[0];
    //console.log(vals);    
	vals1 = vals.split(";");
		console.log("asset_type: "+vals1[0]);
		console.log("asset_name: "+vals1[1]);
        console.log("year_foundation :"+vals1[2]);
        console.log("asset_cuit :"+vals1[3]);
        console.log("asset_tipo_doc :"+vals1[4]);
        console.log("asset_num_doc:  :"+ vals1[5]);
        console.log("asset_bank_register :"+ vals1[6]);
        console.log("cadastro :"+ vals1[7]);
        console.log("country :"+ vals1[8]);
        console.log("state :"+ vals1[9]);
        console.log("city :"+ vals1[10]);
        console.log("location :"+ vals1[11]);
        console.log("latitude :"+ vals1[12]);
        console.log("longitude:"+ vals1[13]);
        console.log("surface_total:"+ vals1[14]);
        console.log("surface_agricultura:"+ vals1[15]);
        console.log("owner_name:"+ vals1[16]);
        console.log("owner_cuit:"+ vals1[17]);
        console.log("owner_doc_type:"+ vals1[18]);
        console.log("owner_num_type:"+ vals1[19]);
        console.log("owner_bank_register:"+ vals1[20]);
        console.log("products:"+ vals1[21]);
        console.log("period:"+ vals1[22]);
        console.log("agricultural_system:"+ vals1[23]);
        console.log("surface planted:"+ vals1[24]);
        console.log("tons_harvested:"+ vals1[25]);
        console.log("income_gross:"+ vals1[26]);
        console.log("income_net:"+vals1[27]);  
        console.log("amount_requested:"+vals1[28]);
        console.log("numbers_payment:"+vals1[29]);
        console.log("first_payment:"+vals1[30]);
        console.log("interest_rate:"+vals1[31]);
        console.log("frecuency:"+vals1[32]);
	//console.log("rec:",done," Supplier creation in progress..", vals1[0]);

//	arrayobject.push( 
//      rec_schema({
    
        var asset_alldata = 
        {
            user_publicKey: "FY6tCC2YNQSCkoFuXHnVpoB4Mhs6UCk9tcKW7HWsSmck",           
            asset_type: vals1[0],
            asset_name: vals1[1],
            year_foundation: vals1[2],
            asset_cuit : vals1[3],
            asset_tipo_doc: vals1[4],
            asset_num_doc: vals1[5],
            asset_bank_register: vals1[6],
            cadastro: vals1[7],
            country: vals1[8],
            state: vals1[9],
            city: vals1[10],
            location: vals1[11],
            latitude: vals1[12],
            longitude: vals1[13],
            surface_total: vals1[14],
            surface_agricultura: vals1[15],
            owner_name: vals1[16],
            owner_cuit: vals1[17],
            owner_doc_type: vals1[18],
            owner_num_type: vals1[19],
            owner_bank_register: vals1[20],
            products: vals1[21], 
            period: vals1[22],
            agricultural_system: vals1[23],
            surface_planted: vals1[24],
            tons_harvested: vals1[25],
            income_gross: vals1[26],
            income_net: vals1[27],
            amount_requested: vals1[28],
            numbers_payment: vals1[29],
            first_payment: vals1[30],
            interest_rate: vals1[31],
            frecuency : vals1[32]
        }    
        var asset_data = 
        {
            user_publicKey: "FY6tCC2YNQSCkoFuXHnVpoB4Mhs6UCk9tcKW7HWsSmck",             
            asset_type: vals1[0],
            asset_name: vals1[1],
            year_foundation: vals1[2],
            asset_cuit : vals1[3],
            asset_tipo_doc: vals1[4],
            asset_num_doc: vals1[5],
            asset_bank_register: vals1[6],
            cadastro: vals1[7],
            country: vals1[8],
            state: vals1[9],
            city: vals1[10],
            location: vals1[11],
            latitude: vals1[12],
            longitude: vals1[13],
            surface_total: vals1[14],
            surface_agricultura: vals1[15],
            owner_name: vals1[16],
            owner_cuit: vals1[17],
            owner_doc_type: vals1[18],
            owner_num_type: vals1[19],
            owner_bank_register: vals1[20]
        };
    
        var asset_metadata = 
        {
            products: vals1[21], 
            period: vals1[22],
            agricultural_system: vals1[23],
            surface_planted: vals1[24],
            tons_harvested: vals1[25],
            income_gross: vals1[26],
            income_net: vals1[27]
        }
	//	}));
    
  


                const tx = driver.Transaction.makeCreateTransaction(
                    asset_alldata,
                    asset_metadata,
                    [ driver.Transaction.makeOutput(
                        driver.Transaction.makeEd25519Condition(public_key))],
                    public_key)
                const txSigned = driver.Transaction.signTransaction(tx, private_key);
                console.log("antes de commit");
                conn.postTransactionCommit(txSigned);
                console.log("after commit:");
                console.log(txSigned);    

		done++;

//	data.push(rec);
}).on('end', function() 
{
	exit();
});


function exit() {
	console.log("exit.");	
	mongoose.disconnect();
	console.log("exit - despues de mongoose.");		
}


