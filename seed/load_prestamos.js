
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



        var asset_alldata = 
        {
            operation : "50-Prestamo Tomado",
            owner_publicKey: "FY6tCC2YNQSCkoFuXHnVpoB4Mhs6UCk9tcKW7HWsSmck",  
            investment_publicKey : "w5LJ45WDfpNh1P1bHEKBfNNBj1X3rUiGp931HtwBbNw",
            asset_id :  "1fdcfaf45993bc35f08599ecc857b7a276c0c7fc9267af189005f20ad66e6718",
            proposal : "5be50c8a786e3f2820a65b26",
            account_number: "400184205134",
            amount_requested: "1000000",
            numbers_payment: "12",
            first_payment: "2018-Ene",
            interest_rate: "10",
            frecuency : "Mensual"
        }    

        const tx = driver.Transaction.makeCreateTransaction(
            asset_alldata,
            {},
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

	exit();



function exit() {
	console.log("exit.");	
	mongoose.disconnect();
	console.log("exit - despues de mongoose.");		
}


