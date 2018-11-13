var mongo = require('mongodb');



var emaildestino = "jbcarta@hotmail.com";

var express = require('express');
var path = require('path');
var router = express.Router();



var numeral = require('numeral');
var csv = require('ya-csv');
var formidable = require('formidable');
var fs = require('fs');
var request = require('request');


// Mensajes espaciales de errores
	var flash = require('connect-flash');

// filtrar parametros desde html
const querystring = require('querystring');

var url = require("url");

var passport = require('passport');

// email

var nodemailer = require('nodemailer');

// twilio mensage de textos
                const accountSid = 'AC50f5c041158be840e607172e8951159e';
                const authToken = 'ea5f7bd3d9fbae19e4718f16dc33595f';
                const Twilio = require('twilio'); 

// -----------------------------------
// 		BigchainDB definitions
// -----------------------------------

        
    // -----------------------------------
    // 			Modelos
    // -----------------------------------
    var Countries = require('../models/loc_countries');
    var States = require('../models/loc_states');
    var County = require('../models/loc_county');
    var Proposal = require('../models/proposal');

    const bcDb_driver = require('bigchaindb-driver');

    //const API_PATH = 'http://localhost:9984/api/v1/';

    //const conn = new driver.Connection(API_PATH);

    const connDb = new bcDb_driver.Connection(
              "https://test.bigchaindb.com/api/v1/",
            {
                app_id: '385b62f9',
                app_key: '185a4d7d619448dbf0c725f3485fa0b6'
            });


    // Bigchain in Mongodb to direct query

     /*
    const MongoClient = require('mongodb').MongoClient
    const assert = require('assert')


    const urlMongo = "https://test.bigchaindb.com/api/v1/"; 
    const dbName = 'bigchain'

	MongoClient.connect(urlMongo, function(err, client) {
	  assert.equal(null, err);
	  console.log("Connected successfully to server")

	  const db = client.db(dbName);
        console.log("db:",db);
        
	  const collection = db.collection('assets');
        console.log("despues de collection");
     

    });
    */

    //connDb.define("crabModel", "https://schema.org/v1/crab");


	// -------------------------------------
	//      get api /api/countries
	// -------------------------------------	
	router.get('/api/countries', function(req, res, next) 
	{
		// console.log('Entro en /api/countries.........');
	   	Countries.find({ country: { $exists: true } } , {country : 1}, function(err, alldata)
		{
			// console.log('Entro en /api/countries .. dentro de find');

			if (err)
			{
				console.log('api-error:',err);
				res.send(err);
			}

            //console.log('alldata :',alldata);
            // console.log('alldata.size:',alldata.length);
			var totrec = alldata.length;
            //		console.log('totrec :',totrec);
		    var output = { "iTotalRecords" : totrec, "iTotalDisplayRecords" : 10 };
		    output["data"] = alldata;

            // res.json(output);

					
			// Return all clients
            //  console.log(output);
            res.json(output);
		});

	});


	// -------------------------------------
	//      get api /api/state
	// -------------------------------------	
	router.get('/api/states', function(req, res, next) 
	{
		// console.log('Entro en /api/states.........');
        // console.log("req.query:", req.query);
        // console.log("Country:", req.query.country);
        //	   	States.find({ country: req.query.xcountry }, [{country : 1}, {state : 1}], function(err, alldata)
        States.find({ country: req.query.country }, function(err, alldata)        
		{
			console.log('Entro en /api/states .. dentro de find');

			if (err)
			{
				console.log('api-error:',err);
				res.send(err);

			}

            //console.log('alldata :',alldata);
            // console.log('alldata.size:',alldata.length);
			var totrec = alldata.length;
            //		console.log('totrec :',totrec);
		    var output = { "iTotalRecords" : totrec, "iTotalDisplayRecords" : 10 };
		    output["data"] = alldata;

	//		res.json(output);

					
			// Return all clients
	//		console.log(output);
	//		res.json(output);
            res.json(alldata);
		});

	});


	// -------------------------------------
	//      get api /api/county
	// -------------------------------------	
	router.get('/api/county', function(req, res, next) 
	{
		console.log('Entro en /api/county.........');
        console.log("req.query:", req.query);
        console.log("Country:", req.query.country);
        console.log("State:", req.query.state);
        
        //	   	States.find({ country: req.query.xcountry }, [{country : 1}, {state : 1}], function(err, alldata)
        County.find({ country: req.query.country, state: req.query.state }, function(err, alldata)        
		{
			console.log('Entro en /api/county .. dentro de find');

			if (err)
			{
				console.log('api-error:',err);
				res.send(err);

			}

            // console.log('alldata :',alldata);
            // console.log('alldata.size:',alldata.length);
			var totrec = alldata.length;
            //		console.log('totrec :',totrec);
		    var output = { "iTotalRecords" : totrec, "iTotalDisplayRecords" : 10 };
		    output["data"] = alldata;

	//		res.json(output);

					
			// Return all clients
	//		console.log(output);
	//		res.json(output);
            res.json(alldata);
		});

	});

// -----------------------------------
// 	    End	BigchainDB definitions
// -----------------------------------

        
// -----------------------------------
// 			Modelos
// -----------------------------------
	var Cart = require('../models/cart');
	var Product = require('../models/product');
	var User = require('../models/user');


 


    // Invoice2pay settings
    var settings = require('../I2P_settings.js');

    var Casupo = require('../public/js/casupolibs.js');

    console.log("settings.MongoServer :",settings.MongoServer);
    console.log("settings.sapWebServer :",settings.sapWebServer);



    // Evitar el robo de sesiones de browser
    // el servidor valida cada solicitud del
    // cliente se del mismo browser
        var csrf = require('csurf');
        var csrfProtection = csrf();


// -----------------------------------
//         Models    
// -----------------------------------
	var Approver = require('../models/approver');
	var Approvallevels = require('../models/approvallevels');
	var Approvalscheme = require('../models/approvalscheme');
	var Approvalareas = require('../models/approvalareas');
	var Supplierinvoice = require('../models/supplierinvoice');
	var Supplierinvoiceimagen = require('../models/supplierinvoiceimagen');	
	var Suppliers = require('../models/suppliers');
	var Concepts = require('../models/concepts');

	var Cecos = require('../models/cecos');
	var Accounts = require('../models/accounts');
	var Fiorders = require('../models/fiorders');
	var ServiceMonth = require('../models/servicemonth');

	var jsonfile = require('jsonfile');

// -----------------------------------
//     
// -----------------------------------
// var loaddata = require('../ownfunction/load_referencedata');


        function getDateTime_asString() 
        {
            var date = new Date();

            var hour = date.getHours();
            hour = (hour < 10 ? "0" : "") + hour;

            var min  = date.getMinutes();
            min = (min < 10 ? "0" : "") + min;

            var sec  = date.getSeconds();
            sec = (sec < 10 ? "0" : "") + sec;

            var year = date.getFullYear();

            var month = date.getMonth() + 1;
            month = (month < 10 ? "0" : "") + month;

            var day  = date.getDate();
            day = (day < 10 ? "0" : "") + day;

            return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;
        }



// ////////////////////////////////////////////////////////
//      F U N C I O N E S   D E   B L O C K C H A I N
// ////////////////////////////////////////////////////////




    router.get('/createKey', function (req, res) 
    {
            res.locals.activateIsotope = false; //showisotope();
            var keyExist = true; //false;
            var tmp_id = req.session.passport.user;
            var tmp_email = "sin valor";
            var tmp_name = "sin valor";
            console.log("****** Antes de findById......");   
            console.log("****** tmp_id    :", tmp_id);         
            User.findById(tmp_id, function (err, doc) 
            {  
                console.log("****** encontré user......");  
                // Handle any possible database errors
                if (err) 
                {
                    //res.status(500).send(err);
                } else 
                {
                    tmp_email = doc.email;
                    tmp_name = doc.name;                    
                    console.log("Exist doc:",doc);
                    if (doc.privateKey != undefined && doc.publicKey.length > 0)                
                    {
                        keyExist = true;
                    }
                };
                if(keyExist)
                {
                    console.log("**********  /verkey  *******************"); 
                    var keypair = 
                        {
                            publicKey : doc.publicKey,
                            privateKey : doc.privateKey

                        };

                    //console.log("doc.keypair.publicKey:", doc.keypair.publicKey);
                    console.log("keypair.publicKey:", keypair.publicKey);
                    console.log("keypair.privateKey:", keypair.privateKey);
                    var tmp_title = "Ver Key";
                    /*
                    res.render('blockchain/wallet', {   title: 'Create Key',  
                                                        keypair : keypair, 
                                                        keypair1 : xkeypair, 
                                                        publicKey : keypair.publicKey,
                                                        privateKey: keypair.privateKey,
                                                        name : tmp_name,
                                                        email : tmp_email   
                                                    });
                    */
                }
                else
                {
                    console.log("**********  /createKey  *******************"); 
                    var keypair = new bcDb_driver.Ed25519Keypair(); 
                         // const alice = new driver.Ed25519Keypair()
                    console.log("keypair:", keypair);
                    //var xpublicKey = keypair.publicKey;
                    //var xprivateKey = keypair.privateKey;                    
                    console.log("keypair.publicKey:", keypair.publicKey);
                    console.log("keypair.privateKey:", keypair.privateKey);

                    var tmp_title = "Create Key";

                    //res.redirect("/");
                    //var xkeypair = JSON.stringify(keypair);

                
				        doc.publicKey = keypair.publicKey;
				        doc.privateKey = keypair.privateKey;
                        doc.keypair = keypair;


				        // Save the updated document back to the database
                      
				        doc.save(function (err, todo) {
				            if (err) {
				                res.status(500).send(err)
				            }
				            console.log('doc saved:',doc)
				            //res.send(todo);
				        });                         

                    console.log("**********  end /createKey  *******************");         

                }

                res.render('blockchain/wallet', {   title: tmp_title,  
                                                    keypair : keypair, 
                                                    //keypair1 : keypair, 
                                                    publicKey : keypair.publicKey,
                                                    privateKey: keypair.privateKey,
                                                    name : tmp_name,
                                                    email : tmp_email,
                                                    keyExist : keyExist                                                
                                                });     
                
            });
        
     
    });

    //  --------------------
    //        assetlist
    //  --------------------
    router.get('/assetlist', function (req, res)
    {
        console.log("*************************************************");     
        console.log("//assetlist             -------------------------*");
        
        res.locals.activateIsotope = false; //showisotope();
        var keyExist = false;

        
        //connDb.searchAssets('PRIMARIA')
        //.then(assets => console.log('Found assets :', assets));

        res.render('blockchain/asset_all', { title: 'listado de Activos'});
    }); 


    //  ------------------------
    //        /api/assetlist
    //  ------------------------
    router.get('/api/assetlist', function (req, res)
    {
        var asset_alldata = [];
        console.log("*************************************************");     
        console.log("/api/assetlist         -------------------------*");
        var tmp_id = req.session.passport.user;
        var tmp_email = "sin valor";
        var tmp_name = "sin valor";
        console.log("****** Antes de findById......");   
        console.log("****** tmp_id    :", tmp_id);   
        var output = ""; // { "iTotalRecords" : 0, "iTotalDisplayRecords" : 10 };
        connDb.searchAssets('PRIMARIA')
        .then(assets => //console.log('Found assets :', assets));
        {
            console.log('Found assets :', assets);
            console.log('assets.length :', assets.length);
            var j = 0;
            for(i = 0; i < assets.length; i++) 
            {
                console.log("i: "+i+"<>"+assets[i].id); //data.asset_type);
                if (assets[i].data.asset_type != "Producci�n Primaria" && assets[i].data.user_publicKey != undefined)
                {
                    asset_alldata[j] = 
                    {
                        id: assets[i].id,
                        owner_publicKey : assets[i].data.owner_publicKey,
                        asset_type: assets[i].data.asset_type,
                        asset_name: assets[i].data.asset_name,
                        year_foundation: assets[i].data.year_foundation, 
                        asset_cuit : assets[i].data.asset_cuit,
                        asset_tipo_doc: assets[i].data.asset_tipo_doc,
                        asset_num_doc: assets[i].data.asset_num_doc,
                        asset_bank_register: assets[i].data.asset_bank_register,
                        cadastro: assets[i].data.cadastro,
                        country: assets[i].data.country,
                        state: assets[i].data.state,
                        city: assets[i].data.city,
                        location: assets[i].data.location,
                        latitude: assets[i].data.latitude,
                        longitude: assets[i].data.longitude,
                        surface_total: assets[i].data.surface_total,
                        surface_agricultura: assets[i].data.surface_agricultura,
                        owner_name: assets[i].data.owner_name,
                        owner_cuit: assets[i].data.owner_cuit,
                        owner_doc_type: assets[i].data.owner_doc_type,
                        owner_num_type: assets[i].data.owner_num_type,
                        owner_bank_register: assets[i].data.owner_bank_register,
                        products: assets[i].data.products, 
                        period: assets[i].data.period,
                        agricultural_system: assets[i].data.agricultural_system,
                        surface_planted: assets[i].data.surface_planted,
                        tons_harvested: assets[i].data.tons_harvested,
                        income_gross: assets[i].data.income_gross,
                        income_net: assets[i].data.income_net,
                        amount_requested: assets[i].data.amount_requested,
                        numbers_payment: assets[i].data.numbers_payment,
                        first_payment: assets[i].data.first_payment,
                        interest_rate: assets[i].data.interest_rate,
                        frecuency: assets[i].data.frecuency
                    };
                    console.log("j: "+j);                    
                    console.log("asset_alldata:"+asset_alldata[j].asset_name);                    
                    j++;
                    //output["data"].push(asset_alldata);
                };               
     
            }

            
            console.log("Encontré registros!!!...cantidad de registros: "+assets.length);
            var totrec = j; //assets.length;
            console.log('totrec :',totrec);
            var output = { "iTotalRecords" : totrec, "iTotalDisplayRecords" : 10 };
            //output["data"] = assets.data;
            output["data"] = asset_alldata;
            console.log('Json(output) :'+output["data"]);
            res.json(output);
        });

		        
        //res.redirect('/');      
    }); 


	// -------------------------------------------
	//      Post /asset_detail_view
	// -------------------------------------------	
		router.post('/asset_detail_view', function(req, res, next) 
		{

            var temp_id = req.body.post_id;

            //		tmp_id = temp_id.split(":")[0];
            console.log("---------------------------------: ");

            // aquiestoy
            console.log("post /asset_detail_view/post_id : "+temp_id);
            console.log("post /asset_detail_view -req.user.username : "+req.user.username);
            console.log("post /asset_detail_view - req.session: "+req.session);
            console.log("post /asset_detail_view - req.session.passport.user: "+req.session.passport);

            connDb.searchAssets(temp_id)
            .then(asset => //console.log('Found assets :', assets));
            {
                console.log('Found assets :', asset);
                //var results_mongodb = [];
                //results_mongodb.push(assets);
                //console.log("---------------------------------: ");

                //console.log("docs : "+docs);


                //console.log("results_mongodb : "+results_mongodb);

                res.render('blockchain/asset_detail_view', { title: 'Detalle del Activo', 
                                                                    recdata: asset
                                                                    //, 
                                                                    //xsup: results_mongodb.supplier,
                                                                    //user_id: req.user.username
                                                                    });
                console.log("despues de res.render ---------------------------------: ");                
                
            });
            console.log("fuera del connDB ---------------------------------: ");            



	       });


    //  ------------------------------
    //     Get   proposal_aprovreject
    //  ------------------------------
    router.get('/proposal_aprovreject', function (req, res)
    {
        console.log("*************************************************");     
        console.log("//proposal_aprovreject  ------------------------*");
        
        res.locals.activateIsotope = false; //showisotope();
        var keyExist = false;

        
        //connDb.searchAssets('PRIMARIA')
        //.then(assets => console.log('Found assets :', assets));

        res.render('blockchain/proposal_aprovreject', { title: 'Propuestas Pendientes'});
    }); 

	// -------------------------------------------
	//      Post /proposal_aprovreject_detail
	// -------------------------------------------	
        router.post('/proposal_approvreject_detail', function(req, res, next) 
        {
            var temp_id = req.body.post_id;            
            console.log("---------------------------------: ");
            console.log("/proposal_aprovreject_detail : ");            
            console.log("req.body : ",req.body);            
            console.log("temp_id : "+temp_id);

            // -------------------------------------
            //   Buscar propuestas

            Proposal.findById(temp_id, function (err, docs) 
            {  
                // Handle any possible database errors
                if (err) 
                {
                    console.log("Error:"+err);
                } 
                else 
                {                             
                    console.log("Encontré registro!!!...: "+docs);
                    
                    // proposal_approvrejec_detail_test
                    // proposal_approvreject_detail

                    res.render('blockchain/proposal_approvrejec_detail_test', 
                                        {   
                                            title: 'Detalle de la Propuesta', 
                                            recdata: docs
                                        });  
                }
            });
        });

	// -------------------------------------------
	//      Post /proposal_approvreject
	// -------------------------------------------	
		router.post('/proposal_approvreject', function(req, res, next) 
		{
            console.log("------------------------------------------");            
            console.log("post /proposal_approvreject --------------");
            console.log("req.body :",req.body);
            var temp_id = req.body.operation_id;
            console.log("temp_id :",temp_id);            
            
            // -------------------------------------
            //   Buscar propuesta 
            Proposal.findById(temp_id, function (err, docs) 
            {  
                // Handle any possible database errors
                if (err) 
                {
                    console.log("Error:"+err);
                } 
                else 
                {                             
                    console.log("proposal_approvreject -> Encontré registro!!!...: "+docs);
                    if(req.body.returnaction == 'REJECT')
                    {

                        docs.status = '02-rechazado',
                        docs.status_date = getDateTime_asString();

                        docs.save(function (err, todo) 
                        {
                            if (err) 
                            {
                                console.log(" error al grabar:"+err);   
                            }
                            else
                            {
                                console.log('doc saved:',docs);
                                //res.send(todo);                    
                        
                                // -------------------------------------
                                //   Enviar email de notificación

                                    var transporter = nodemailer.createTransport({
                                      service: 'gmail',
                                      auth: {
                                        user: 'sirmionep2planding@gmail.com',
                                        pass: 'Sirmione01.'
                                      }
                                    });

                                    var mailOptions = {
                                        from: 'sirmionep2planding@gmail.com',
                                        to: emaildestino,
                                        subject: 'Notificación sobre su Propuesta Enviada',
                                        text: 
                                            "Lamentamos informarle que su oferta no fue aceptada."+"\n"+"\n"+
                                            "Detalle de su propuesta:"+"\n"+
                                            "Nro. Propuesta:"+docs._id+"\n"+                                    
                                            "Monto Ofertado:"+docs.amount_requested+"\n"+                    
                                            "Nro. de Cuotas:"+docs.numbers_payment+"\n"+
                                            "Primer Pago   :"+docs.first_payment+"\n"+  
                                            "Tasa Interes  :"+docs.interest_rate+"\n"+                    
                                            "Frecuencia    :"+docs.frecuency+"\n"+"\n"+

                                            "SIRMIONE P2P Landing....Tu socio para ayudarte a crecer!"
                                    };

                                    transporter.sendMail(mailOptions, function(error, info)
                                    {
                                      if (error) 
                                      {
                                        console.log(error);
                                      } else 
                                      {
                                        console.log('Email sent: ' + info.response);
                                      }
                                    }); 
                                
                                res.redirect('/');
                            }
                        });    // docs.save                  
                        
                    }
                    else
                    {
                            var bank_id = 0;
                            var doc_type= "CI";
                            var doc_num="51060391"			  
                                    
                            var destinatioUrl = "http://apicast-hackaton-galicia.b9ad.pro-us-east-1.openshiftapps.com/api/v1/customers?apikey=b5776541fc93e7f10a07f7c5f0ec7c8e";
                            var options = 
                            {
                              uri: destinatioUrl,
                              method: 'GET'
                              //json: json_t_invoice
                              //body: json_t_invoice
                            };

                            console.log("----------------------------------");
                            console.log("Request --------------------------");			

                            request(options, function (error, response, body) 
                            {
                                if (!error && response.statusCode == 200) 
                                {
                                 console.log("body.id:",body.id) // Print the shortened url.
                                }
                                console.log("Error:", error);
                                //console.log("Response:", response);´´
                                //console.log("body:", body);

                                var t_body = JSON.parse(body);
                                var record_selected = -1;
                                console.log("t_body:", t_body);
                                for (var i = t_body.length-1; i > 0; i--) 
                                {
                                    console.log(t_body[i].Doc_Type+"<>"+doc_type+"<>"+i);
                                    //console.log(t_body[i].Doc_Type);                        
                                    if (t_body[i].Doc_Type == doc_type && t_body[i].Doc_Number == doc_num)
                                    {
                                        record_selected = i;
                                        console.log("RecSelected"+">"+t_body[i]+"<>"+t_body[i].Doc_Type+"<>"+i);
                                        i = -10;
                                    }

                                };
                                if (record_selected > -1)
                                {
                                    var bank_id = t_body[record_selected].Id;
                                    console.log("bank_id:"+bank_id);
                                //-----------------------------------    
			  
                                    
                                    var destinatioUrl = "http://apicast-hackaton-galicia.b9ad.pro-us-east-1.openshiftapps.com/api/v1/customers/"+bank_id+"/accounts?apikey=b5776541fc93e7f10a07f7c5f0ec7c8e";
                                    var options = 
                                    {
                                      uri: destinatioUrl,
                                      method: 'GET'
                                      //json: json_t_invoice
                                      //body: json_t_invoice
                                    };

                                    console.log("----------------------------------");
                                    console.log("Request --------------------------");			

                                    request(options, function (error, response, body) 
                                    {
                                        if (!error && response.statusCode == 200) 
                                        {
                                         console.log("body.id:",body.id) // Print the shortened url.
                                        }
                                        console.log("Error:", error);
                                        //console.log("Response:", response);´´
                                        //console.log("body:", body);

                                        var t_body = JSON.parse(body);
                                        var record_selected = -1;
                                        console.log("t_body:", t_body);
                                        for (var i = t_body.length-1; i > 0; i--) 
                                        {
                                            console.log(t_body[i].Doc_Type+"<>"+doc_type+"<>"+i);
                                            //console.log(t_body[i].Doc_Type);                        
                                            if (t_body[i].Type == "Checking")
                                            {
                                                record_selected = i;
                                                console.log("RecSelected"+">"+t_body[i]+"<>"+t_body[i].Account_Number+"<>"+i);
                                                i = -10;
                                            }

                                        };
                                        if (record_selected > -1)
                                        {
                                            var account_number = t_body[record_selected].Account_Number;
                                            console.log("Account_Number:"+account_number);
                                    
                                //------------------------------------        
                                        
                                            docs.status = '03-Aceptado, en espera de fondos',
                                            docs.status_date = getDateTime_asString();

                                            docs.save(function (err, todo) 
                                            {
                                                if (err) 
                                                {
                                                    console.log(" error al grabar:"+err);   
                                                }
                                                else
                                                {
                                                    console.log('doc saved:',docs);
                                                    //res.send(todo);                    

                                                    // -------------------------------------
                                                    //   Enviar email de notificación

                                                        var transporter = nodemailer.createTransport({
                                                          service: 'gmail',
                                                          auth: {
                                                            user: 'sirmionep2planding@gmail.com',
                                                            pass: 'Sirmione01.'
                                                          }
                                                        });

                                                        var mailOptions = {
                                                            from: 'sirmionep2planding@gmail.com',
                                                            to: emaildestino, //'jbcarta@hotmail.com',
                                                            subject: 'Su oferta fué aceptada!!',
                                                            text: 
                                                                "Tenemos en el agrado de informarles que su propuesta fué aceptada. Por favor proceda a realizar la transferencia a la cuenta Nro.:"+account_number+"\n"+
                                                                "Detalle de su propuesta:"+"\n"+
                                                                "Nro. Propuesta:"+docs._id+"\n"+                                    
                                                                "Monto Ofertado:"+docs.amount_requested+"\n"+                    
                                                                "Nro. de Cuotas:"+docs.numbers_payment+"\n"+
                                                                "Primer Pago   :"+docs.first_payment+"\n"+  
                                                                "Tasa Interes  :"+docs.interest_rate+"\n"+                    
                                                                "Frecuencia    :"+docs.frecuency+"\n"+"\n"+

                                                                "SIRMIONE P2P Landing....Tu socio para ayudarte a crecer!"
                                                        };

                                                        transporter.sendMail(mailOptions, function(error, info)
                                                        {
                                                          if (error) 
                                                          {
                                                            console.log(error);
                                                          } else 
                                                          {
                                                            console.log('Email sent: ' + info.response);
                                                          }
                                                        }); 

                                                    res.redirect('/');
                                                }
                                            });    // docs.save                  
                                        }
                                            
                                    });
                                }
                                else
                                {
                                    console.log("MENSAJE: No esta registrado en el Banco.  Recuerde usted dará mayor confianza a los inversores si posee cuentas en el BANCO GALICIA");
                                }

                              console.log("despues de body")
                            });
                            
                        


                    } // if(req.body.returnaction

                    

                }
            });            
            

        });

   //  -------------------------------
    //        /api/proposal
    //  ------------------------------
    router.get('/api/proposal', function (req, res)
    {
        var asset_alldata = [];
        console.log("*************************************************");     
        console.log("/api/proposal          -------------------------*");

        console.log("****** Antes de findById......");   
        console.log("****** tmp_id    :", tmp_id);   
        var output = ""; // { "iTotalRecords" : 0, "iTotalDisplayRecords" : 10 };
        
            // -------------------------------------
            //   Buscar publicKey del inversor
            
                var tmp_id = req.session.passport.user;
                var publicKey = "SinValor";
				User.findById(tmp_id, function (err, doc) 
                {  
				    // Handle any possible database errors
				    if (err) 
                    {
				        console.log("Error:"+err);
                        publicKey = err;
				    } 
                    else 
                    {                              
				        publicKey = doc.publicKey;
                        console.log("publicKey:",publicKey);
                        // -------------------------------------
                        //   Buscar propuestas
                        
                        Proposal.find({$and: 
                                       [    {status : "01-esperando respuesta" }, 
								            {operation : {$eq: "01-New Proposal" }}, 
				                            {owner_publicKey : {$eq: publicKey}} 
									   ]}, function (err, doc) 
                                {  
                                    // Handle any possible database errors
                                    if (err) 
                                    {
                                        console.log("Error:"+err);
                                    } 
                                    else 
                                    {                             
                                        console.log("Encontré registros!!!...cantidad de registros: "+doc.length);
                                        var totrec = doc.length;
                                        console.log('totrec :',totrec);
                                        var output = { "iTotalRecords" : totrec, "iTotalDisplayRecords" : 10 };
                                        //output["data"] = assets.data;
                                        output["data"] = doc;
                                        console.log('Json(output) :'+output["data"]);
                                        res.json(output);
                                    }
                                });
                    }
                });

		        
        //res.redirect('/');      
    }); 

    // Buscar findasset
    router.get('/findasset', function (req, res) 
    {
        console.log("*************************************************");     
        console.log("/findasset             -------------------------*");
        
        connDb.searchAssets('PRIMARIA')
        .then(assets => console.log('Found assets with serial number Hacienda Renacimiento:', assets));
        res.redirect('/');        
    }); 

    // Buscar AssetData
    router.get('/findassetxx', function (req, res) 
    {
        console.log("*************************************************");     
        console.log("/findasset             -------------------------*");
        
        connDb.searchAssets('Hacienda Renacimiento')
        .then(assets => console.log('Found assets with serial number Hacienda Renacimiento:', assets));
        
        res.redirect('/');        
    });        

    // Buscar Metadata
    router.get('/findMetadataxx', function (req, res) 
    {
        conn.searchMetadata('1.32')
                .then(assets => console.log('Found assets with serial number Bicycle Inc.:', assets));
        res.redirect('/');
    });        

    // Buscar createasset
    router.get('/createasset', function (req, res) 
    {
            res.locals.activateIsotope = false; //showisotope();
			var tmp_id = req.params.id;

			console.log("------------------------------: ");

			console.log("/createasset/get 1: ");		

			res.render('blockchain/asset_detail_create', { title: 'Crear Activos'});

			//  	return res.redirect('/process/supplierinvoice_edit');        
        
        
     
    });



    router.get('/createAsset_general', function (req, res) 
    {
            res.locals.activateIsotope = false; //showisotope();
            var keyExist = false;
            var tmp_id = req.session.passport.user;
            var tmp_email = "sin valor";
            var tmp_name = "sin valor";
            console.log("****** Antes de findById......");   
            console.log("****** tmp_id    :", tmp_id);         
            User.findById(tmp_id, function (err, doc) 
            {         
        
                const assetdata =   {
                                        "name": "Hacienda Renacimiento",
                                        "propietaria": "Sucesión Rodriguez Perez",
                                        "country": "Argentina",
                                        "region": "Buenos Aires",
                                        "year fundación": "1656",
                                        "tipo:":"Producción Primaria"
                                    }         

                /*
                
                  Datos base de la hacienda/finca
                  Pais
                  
                    provincia/estado
                    partido/municipio
                    ciudad
                    info adicional
                    coordenadas GPS:
                    Latitud:-34.6036844
                    Longitud: -58.381559100000004
                    https://www.coordenadas-gps.com/convertidor-de-coordenadas-gps
                
                */
                
                const driver = require('bigchaindb-driver');
                /*
                console.log("doc.keypair.publicKey:", doc.keypair.publicKey);
                console.log("doc.keypair.privateKey:", doc.keypair.privateKey);  
                */
                console.log("doc.publicKey:", doc.publicKey);
                console.log("doc.rivateKey:", doc.privateKey);                  
                
                
                const alice = 
                      {
                          publicKey : doc.publicKey,
                          privateKey: doc.privateKey
                      } //doc.keypair; //   new driver.Ed25519Keypair();
                console.log("alice.publicKey:", alice.publicKey);
                console.log("alice.privateKey:", alice.privateKey); 
                
                const conn = new driver.Connection(
                    'https://test.bigchaindb.com/api/v1/',
                    { app_id: '385b62f9',
                      app_key: '185a4d7d619448dbf0c725f3485fa0b6' })
                const tx = driver.Transaction.makeCreateTransaction(
                    assetdata,
                    {
                        "datetime": new Date().toString(),
                        "hectarea": "1000",
                        "hectarea_aptas" : "700",
                        "hectarea_sembradas" : "500"  
                    },
                    [ driver.Transaction.makeOutput(
                        driver.Transaction.makeEd25519Condition(alice.publicKey))],
                    alice.publicKey)
                const txSigned = driver.Transaction.signTransaction(tx, alice.privateKey);
                console.log("antes de commit");
                conn.postTransactionCommit(txSigned);
                console.log("after commit:");
                console.log(txSigned);
            });
        res.redirect('/');          

    });

    router.get('/createAsset_general_old_work_fine', function (req, res) 
    {

        const driver = require('bigchaindb-driver')

        const alice = new driver.Ed25519Keypair()
        const conn = new driver.Connection(
            'https://test.bigchaindb.com/api/v1/',
            { app_id: '385b62f9',
              app_key: '185a4d7d619448dbf0c725f3485fa0b6' })
        const tx = driver.Transaction.makeCreateTransaction(
            { message: '' },
            null,
            [ driver.Transaction.makeOutput(
                driver.Transaction.makeEd25519Condition(alice.publicKey))],
            alice.publicKey)
        const txSigned = driver.Transaction.signTransaction(tx, alice.privateKey);
        console.log("antes de commit");
        conn.postTransactionCommit(txSigned);
        console.log("after commit:");
        console.log(txSigned);
        res.redirect('/');          

    });

    router.get('/createasset1', function (req, res) 
    {

            var keyExist = false;
            var tmp_id = req.session.passport.user;
            var tmp_email = "sin valor";
            var tmp_name = "sin valor";
            console.log("****** Antes de findById......");   
            console.log("****** tmp_id    :", tmp_id);         
            User.findById(tmp_id, function (err, doc) 
            {  
                console.log("****** encontré user......");  
                // Handle any possible database errors
                if (err) 
                {
                    //res.status(500).send(err);
                } else 
                {
                    tmp_email = doc.email;
                    tmp_name = doc.name;                    
                    //console.log("Exist doc:",doc);
                    if (doc.privatekey != undefined && doc.publickey.length > 0)                
                    {
                        var keyPair = [];
                        keyPair.publicKey = doc.publickey;
                        keyPair.privateKey = doc.privatekey;
                        
                        console.log("doc.email:",doc.email);                        
                        console.log("doc.publickey:",doc.publickey);
                        console.log("doc.privatekey:",doc.privatekey);
                        
                        const assetdata = {
                            "name": "Hacienda Renacimiento",
                            "propietaria": "Sucesión Rodriguez Perez",
                            "country": "Argentina",
                            "region": "Buenos Aires",
                            "year": "1656"
                        } 
                        

                        // Construct a transaction payload
                        console.log("connDb:",connDb);
                        
                        console.log("------ ***** entrando a txCreateAsset ");                        
                        const txCreateAsset = bcDb_driver.Transaction.makeCreateTransaction(
                            // Asset field
                            {
                                assetdata,
                            },
                            // Metadata field, contains information about the transaction itself
                            // (can be `null` if not needed)
                            {
                                "datetime": new Date().toString(),
                                "hectarea": "1000",
                                "hectarea_aptas" : "700",
                                "hectarea_sembradas" : "500"  
                            },
                            // Output. For this case we create a simple Ed25519 condition
                            [bcDb_driver.Transaction.makeOutput(
                                //bcDb_driver.transaction.Ed25519Keypair(doc.publickey))],
                                bcDb_driver.Transaction.makeEd25519Condition(doc.publickey))],
                            // Issuers
                            doc.publicKey
                        );
                        console.log("txCreateAsset :",txCreateAsset);  
                        console.log("------ ***** txSigned ");                         
                        // The owner of the painting signs the transaction
                        const txSigned = bcDb_driver.Transaction.signTransaction(txCreateAsset,
                            doc.privatekey);

                        console.log("txSigned :",txSigned);
                        
                        // Send the transaction off to BigchainDB
                        console.log("------ ***** Commit ");  
                        
                      
                        connDb.postTransactionCommit(txSigned);
                        
                        // v2.0
                        //connDb.postTransactionCommit(txSigned)    
                        /*
                            .then(res => {
                                console.log("------ ***** postTransaction then: "+txtSigned);
                                document.body.innerHTML += '<h3>Transaction created</h3>';
                                document.body.innerHTML += txSigned.id
                                // txSigned.id corresponds to the asset id of the painting
                            });
                        */
                        console.log("------ ***** despues commit ");                        

      

                    }
                };
                res.redirect('/');     
            });
        
     
    });

    router.get('/createAsset_v2', function (req, res) 
    {

            var keyExist = false;
            var tmp_id = req.session.passport.user;
            var tmp_email = "sin valor";
            var tmp_name = "sin valor";
            console.log("****** Antes de findById......");   
            console.log("****** tmp_id    :", tmp_id);         
            User.findById(tmp_id, function (err, doc) 
            {  
                console.log("****** encontré user......");  
                // Handle any possible database errors
                if (err) 
                {
                    //res.status(500).send(err);
                } else 
                {
                    tmp_email = doc.email;
                    tmp_name = doc.name;                    
                    //console.log("Exist doc:",doc);
                    if (doc.privatekey != undefined && doc.publickey.length > 0)                
                    {
                        var keyPair = [];
                        keyPair.publicKey = doc.publickey;
                        keyPair.privateKey = doc.privatekey;
                        
                        console.log("doc.publickey:",doc.publickey);
                        console.log("doc.privatekey:",doc.privatekey);
                        
                        const assetdata = {
                            "name": "Hacienda Renacimiento",
                            "propietaria": "Sucesión Rodriguez Perez",
                            "country": "Argentina",
                            "region": "Buenos Aires",
                            "year": "1656"
                        } 
                        

                        // Construct a transaction payload
                        console.log("connDb:",connDb);
                        
                        console.log("------ ***** entrando a txCreateAsset ");                        
                        const txCreateAsset = bcDb_driver.Transaction.makeCreateTransaction(
                            // Asset field
                            {
                                assetdata,
                            },
                            // Metadata field, contains information about the transaction itself
                            // (can be `null` if not needed)
                            {
                                "datetime": new Date().toString(),
                                "hectarea": "1000",
                                "hectarea_aptas" : "700",
                                "hectarea_sembradas" : "500"  
                            },
                            // Output. For this case we create a simple Ed25519 condition
                            [bcDb_driver.Transaction.makeOutput(
                                //bcDb_driver.transaction.Ed25519Keypair(doc.publickey))],
                                bcDb_driver.Transaction.makeEd25519Condition(doc.publickey))],
                            // Issuers
                            doc.publicKey
                        );
                        console.log("txCreateAsset :",txCreateAsset);  
                        console.log("------ ***** txSigned ");                         
                        // The owner of the painting signs the transaction
                        const txSigned = bcDb_driver.Transaction.signTransaction(txCreateAsset,
                            doc.privatekey);

                        console.log("txSigned :",txSigned);
                        
                        // Send the transaction off to BigchainDB
                        console.log("------ ***** Commit ");  
                        
                        // v1.0                        
                        bcDb_driver.postTransactionCommit(txSigned)
                        
                        // v2.0
                        //connDb.postTransactionCommit(txSigned)                        
                            .then(res => {
                                console.log("------ ***** postTransaction then: "+txtSigned);
                                document.body.innerHTML += '<h3>Transaction created</h3>';
                                document.body.innerHTML += txSigned.id
                                // txSigned.id corresponds to the asset id of the painting
                            });
                        console.log("------ ***** despues commit ");                        

      

                    }
                };
                res.redirect('/');     
            });
        
     
    });


// *++++++++++++++++++++++++++++++++++++++++
//
//   investment functions
//
// *++++++++++++++++++++++++++++++++++++++++

    //  --------------------
    //        newinvestment
    //  --------------------
    router.get('/asset_newinvestment', function (req, res)
    {
        console.log("******************************************************");     
        console.log("//newinvestment             -------------------------*");
        
        res.locals.activateIsotope = false; //showisotope();
        var keyExist = false;

        
        //connDb.searchAssets('PRIMARIA')
        //.then(assets => console.log('Found assets :', assets));

        res.render('blockchain/asset_newinvestment', { title: 'Activos Disponibles'});
    }); 


    //  ------------------------
    //        /api/assetlist
    //  ------------------------
    router.get('/api/asset_newinvestment', function (req, res)
    {
        var asset_alldata = [];
        console.log("*************************************************");     
        console.log("/api/assetlist         -------------------------*");
        var tmp_id = req.session.passport.user;
        var tmp_email = "sin valor";
        var tmp_name = "sin valor";
        console.log("****** Antes de findById......");   
        console.log("****** tmp_id    :", tmp_id);   
        var output = ""; // { "iTotalRecords" : 0, "iTotalDisplayRecords" : 10 };
        connDb.searchAssets('PRIMARIA')
        .then(assets => //console.log('Found assets :', assets));
        {
            //console.log('Found assets :', assets);
            //console.log('assets.length :', assets.length);
            var j = 0;
            for(i = 0; i < assets.length; i++) 
            {
                console.log("i: "+i+"<>"+assets[i].data.asset_name);
                if (assets[i].data.asset_type != "Producci�n Primaria" && assets[i].data.user_publicKey != undefined)
                {
                    asset_alldata[j] = 
                    {
                        id: assets[i].id,                        
                        asset_type: assets[i].data.asset_type,
                        asset_name: assets[i].data.asset_name,
                        year_foundation: assets[i].data.year_foundation, 
                        asset_cuit : assets[i].data.asset_cuit,
                        asset_tipo_doc: assets[i].data.asset_tipo_doc,
                        asset_num_doc: assets[i].data.asset_num_doc,
                        asset_bank_register: assets[i].data.asset_bank_register,
                        cadastro: assets[i].data.cadastro,
                        country: assets[i].data.country,
                        state: assets[i].data.state,
                        city: assets[i].data.city,
                        location: assets[i].data.location,
                        latitude: assets[i].data.latitude,
                        longitude: assets[i].data.longitude,
                        surface_total: assets[i].data.surface_total,
                        surface_agricultura: assets[i].data.surface_agricultura,
                        owner_name: assets[i].data.owner_name,
                        owner_cuit: assets[i].data.owner_cuit,
                        owner_doc_type: assets[i].data.owner_doc_type,
                        owner_num_type: assets[i].data.owner_num_type,
                        owner_bank_register: assets[i].data.owner_bank_register,
                        products: assets[i].data.products, 
                        period: assets[i].data.period,
                        agricultural_system: assets[i].data.agricultural_system,
                        surface_planted: assets[i].data.surface_planted,
                        tons_harvested: assets[i].data.tons_harvested,
                        income_gross: assets[i].data.income_gross,
                        income_net: assets[i].data.income_net,
                        amount_requested: assets[i].data.amount_requested,
                        numbers_payment: assets[i].data.numbers_payment,
                        first_payment: assets[i].data.first_payment,
                        interest_rate: assets[i].data.interest_rate,
                        frecuency: assets[i].data.frecuency
                    };
                    //console.log("j: "+j);                    
                    //console.log("asset_alldata:"+asset_alldata[j].asset_name);                    
                    j++;
                    //output["data"].push(asset_alldata);
                };               
     
            }

            
            console.log("Encontré registros!!!...cantidad de registros: "+assets.length);
            var totrec = j; //assets.length;
            console.log('totrec :',totrec);
            var output = { "iTotalRecords" : totrec, "iTotalDisplayRecords" : 10 };
            //output["data"] = assets.data;
            output["data"] = asset_alldata;
            console.log('Json(output) :'+output["data"]);
            res.json(output);
        });

		        
        //res.redirect('/');      
    }); 

    //  ------------------------
    //        /api/cuotas
    //  ------------------------
    router.get('/api/cuotas', function (req, res)
    {
        var asset_alldata = [];
        console.log("*************************************************");     
        console.log("/api/assetlist         -------------------------*");
        var tmp_id = req.session.passport.user;
        var tmp_email = "sin valor";
        var tmp_name = "sin valor";
        console.log("****** Antes de findById......");   
        console.log("****** tmp_id    :", tmp_id);   
        var output = ""; // { "iTotalRecords" : 0, "iTotalDisplayRecords" : 10 };
        connDb.searchAssets('FY6tCC2YNQSCkoFuXHnVpoB4Mhs6UCk9tcKW7HWsSmck')
        .then(assets => //console.log('Found assets :', assets));
        {
            //console.log('Found assets :', assets);
            //console.log('assets.length :', assets.length);
            var j = 0;
            for(i = 0; i < assets.length; i++) 
            {
                console.log("i: "+i+"<>"+assets[i].data.operation);
                if (assets[i].data.operation != "51-Cuota Pendiente sin Vencer" && assets[i].data.operation != undefined)
                {
                    asset_alldata[j] = 
                    {
                    
                        id: assets[i].id,  
                        operation : assets[i].data.operation,
                        owner_publicKey: assets[i].data.owner_publicKey,
                        investment_publicKey: assets[i].data.investment_publicKey,
                        asset_id: assets[i].data.asset_id, 
                        proposal : assets[i].data.proposal,
                        amount_requested: assets[i].data.amount_requested,
                        numbers_payment: assets[i].data.numbers_payment,
                        first_payment: assets[i].data.first_payment,
                        interest_rate: assets[i].data.interest_rate,
                        frecuency: assets[i].data.frecuency,
                        duedate: assets[i].data.duedate,
                        cuota: assets[i].data.cuota
                    };
                    //console.log("j: "+j);                    
                    //console.log("asset_alldata:"+asset_alldata[j].asset_name);                    
                    j++;
                    //output["data"].push(asset_alldata);
                };               
     
            }

            
            console.log("Encontré registros!!!...cantidad de registros: "+assets.length);
            var totrec = j; //assets.length;
            console.log('totrec :',totrec);
            var output = { "iTotalRecords" : totrec, "iTotalDisplayRecords" : 10 };
            //output["data"] = assets.data;
            output["data"] = asset_alldata;
            console.log('Json(output) :'+output["data"]);
            res.json(output);
        });

		        
        //res.redirect('/');      
    }); 


	// -------------------------------------------
	//      Post /asset_detail_view
	// -------------------------------------------	
		router.post('/asset_newinvestment_view', function(req, res, next) 
		{

            var temp_id = req.body.post_id;

            //		tmp_id = temp_id.split(":")[0];
            console.log("---------------------------------: ");

            // aquiestoy
            console.log("post /asset_detail_view/post_id : "+temp_id);
            console.log("post /asset_detail_view -req.user.username : "+req.user.username);
            console.log("post /asset_detail_view - req.session: "+req.session);
            console.log("post /asset_detail_view - req.session.passport.user: "+req.session.passport);

            connDb.searchAssets(temp_id)
            .then(asset => //console.log('Found assets :', assets));
            {
                console.log('Found assets :', asset);
                //var results_mongodb = [];
                //results_mongodb.push(assets);
                //console.log("---------------------------------: ");

                //console.log("docs : "+docs);


                //console.log("results_mongodb : "+results_mongodb);

                res.render('blockchain/asset_newinvestment_view', { title: 'Detalle de la Inversión', 
                                                                    recdata: asset
                                                                    //, 
                                                                    //xsup: results_mongodb.supplier,
                                                                    //user_id: req.user.username
                                                                    });
                console.log("despues de res.render ---------------------------------: ");                
                
            });
            console.log("fuera del connDB ---------------------------------: ");            



	       });


    // Buscar findasset
    router.get('/findasset', function (req, res) 
    {
        console.log("*************************************************");     
        console.log("/findasset             -------------------------*");
        
        connDb.searchAssets('PRIMARIA')
        .then(assets => console.log('Found assets with serial number Hacienda Renacimiento:', assets));
        res.redirect('/');        
    }); 


	// -------------------------------------------
	//      /createKey_investment
	// -------------------------------------------
    router.get('/createKey_investment', function (req, res) 
    {
            res.locals.activateIsotope = false; //showisotope();
            var keyExist = false;
            var tmp_id = req.session.passport.user;
            var tmp_email = "sin valor";
            var tmp_name = "sin valor";
            console.log("****** Antes de findById......");   
            console.log("****** tmp_id    :", tmp_id);         
            User.findById(tmp_id, function (err, doc) 
            {  
                console.log("****** encontré user......");  
                // Handle any possible database errors
                if (err) 
                {
                    res.status(500).send(err);
                } else 
                {
                    console.log("encontré registro"); 
                    console.log("doc.investment_publicKey:", doc.investment_publicKey);                    
                    tmp_email = doc.email;
                    tmp_name = doc.name;                    
                    console.log("Exist doc:",doc);
                    if (doc.investment_publicKey != undefined && doc.investment_publicKey.length > 0)   
                    {
                        keyExist = true;
                    }
                };
                if(keyExist)
                {
                    console.log("**********  /verkey  *******************"); 
                    var keypair = 
                        {
                            publicKey : doc.investment_publicKey,
                            privateKey : doc.investment_privateKey

                        };

                    //console.log("doc.keypair.publicKey:", doc.keypair.publicKey);
                    console.log("keypair.publicKey:", keypair.publicKey);
                    console.log("keypair.privateKey:", keypair.privateKey);
                    var tmp_title = "Inversor - Ver Key";
                }
                else
                {
                    console.log("**********  /createKey  *******************"); 
                    var keypair = new bcDb_driver.Ed25519Keypair(); 
                         // const alice = new driver.Ed25519Keypair()
                    console.log("keypair:", keypair);
                    //var xpublicKey = keypair.publicKey;
                    //var xprivateKey = keypair.privateKey;                    
                    console.log("keypair.publicKey:", keypair.publicKey);
                    console.log("keypair.privateKey:", keypair.privateKey);

                    var tmp_title = "Inversor - Create Key";

            
                    doc.investment_publicKey = keypair.publicKey;
                    doc.investment_privateKey = keypair.privateKey;

                    // Save the updated document back to the database
                    doc.save(function (err, todo) 
                        {
                            if (err) 
                            {
                                console.log(" error al grabar:"+err);   
                            }
                            console.log('doc saved:',doc)
                            //res.send(todo);
                        });                
                    console.log("**********  end /createKey  *******************");         

                }

                res.render('blockchain/wallet', {   title: tmp_title,  
                                                    keypair : keypair, 
                                                    //keypair1 : keypair, 
                                                    publicKey : keypair.publicKey,
                                                    privateKey: keypair.privateKey,
                                                    name : tmp_name,
                                                    email : tmp_email,
                                                    keyExist : keyExist                                                
                                                });     
                
            });
        
     
    });


	// -------------------------------------------
	//      Post /asset_detail_sendproposal
	// -------------------------------------------	
		router.post('/asset_detail_sendproposal', function(req, res, next) 
		{
            console.log("/asset_detail_sendproposal -------------");
            console.log(req.body);
            
            // -------------------------------------
            //   Buscar publicKey del inversor
            
                var tmp_id = req.session.passport.user;
                var investment_publicKey = "SinValor";
				User.findById(tmp_id, function (err, doc) 
                {  
				    // Handle any possible database errors
				    if (err) 
                    {
				        console.log("Error:"+err);
                        investment_publicKey = err;
				    } 
                    else 
                    {                              
				        investment_publicKey = doc.investment_publicKey;

	


            
            // -------------------------------------
            //   Crear registro en notificaciones     

                var arecord = [];
                arecord.push( 
                    new Proposal( 
                        {
                            operation:              "01-New Proposal",
                            date_operation:         getDateTime_asString(),
                            status:                 "01-esperando respuesta",
                            status_date:            getDateTime_asString(),
                            asset_key :             req.body.asset_id,
                            owner_publicKey:        req.body.owner_publicKey,
                            investment_publicKey:   investment_publicKey,
                            amount_requested:       req.body.amount_requested,
                            numbers_payment:        req.body.numbers_payment,
                            first_payment:          req.body.first_payment,
                            interest_rate:          req.body.interest_rate,    
                            frecuency:              req.body.frecuency                     

                        }));

                arecord[0].save(function(err, result) 
                {
                    console.log( "Grabando:", result, err );
                    if(err) {
                        console.log("Error .." + err);
                    }
                    else
                    {
                        console.log("Actualización existosa " + result + "document!");		
                    }

                });                    

            // -------------------------------------
            //   Enviar email de notificación

                var transporter = nodemailer.createTransport({
                  service: 'gmail',
                  auth: {
                    user: 'sirmionep2planding@gmail.com',
                    pass: 'Sirmione01.'
                  }
                });

                var mailOptions = {
                    from: 'sirmionep2planding@gmail.com',
                    to: emaildestino,
                    subject: 'Nueva Propuesta de Financiamiento',
                    text: 
                        "Tenemos Nuevas Noticias!"+"\n"+
                        "Se han interesado en tu Requerimiento "+
                        "y han hecho una nueva propuesta. "+
                        "A continuación el detalle:"+"\n"+
                        "Activo        :"+req.body.asset_name+"\n"+
                        "Monto Requerid:"+req.body.amount_requested+"\n"+                    
                        "Nro. de Cuotas:"+req.body.numbers_payment+"\n"+
                        "Primer Pago   :"+req.body.first_payment+"\n"+  
                        "Tasa Interes  :"+req.body.interest_rate+"\n"+                    
                        "Frecuencia    :"+req.body.frecuency+"\n"+"\n"+
                        "Si quieres aceptar la propuesta debes ingresar a "+
                        "Sirmione y continuar con el proceso."+"\n"+"\n"+                    
                        "SIRMIONE P2P Landing....Tu socio para ayudarte a crecer!"
                };

                transporter.sendMail(mailOptions, function(error, info){
                  if (error) {
                    console.log(error);
                  } else {
                    console.log('Email sent: ' + info.response);
                  }
                }); 
                
    
            
            
              console.log("---------------------------------------------");    
              console.log("antes de twilio...");
            /*
                
              var clientTwilio = new Twilio(accountSid, authToken);
                clientTwilio.messages
                  .create({
                     body: 'Mensaje enviado desde sirmione',
                     from: 'whatsapp:+5491121701541',
                     to: 'whatsapp:+5491121701541'
                   })
                  .then(message => console.log("Twilio:"+message.sid))
                  .done(               console.log("dentro de twilio...")     );            
               console.log("despues de twilio...");    
            */
            
            res.render('blockchain/asset_newinvestment', { title: 'Activos Disponibles'});
				    }  
                    });	
                    
        });          
            





    router.get('/ver_blockchain', function (req, res) {
      console.log("---------------------------------------------");    
      console.log("get /Blockchain...");
    });



	// -------------------------------------
	//             post /save_key
	// -------------------------------------	
		router.post('/save_key', function(req, res, next) 
		{


            console.log('-----------------------------------------------');
            console.log('save_key    			   ---------------------');
            console.log('-----------------------------------------------');
            console.log('-----------------------------------------------');
            console.log("req.body.publicKey: ", req.body.publickey);
            console.log("req.body.privateKey: ", req.body.privatekey);
            //console.log("req.params.privateKey: ", req.params.privatekey);
            //console.log("req.session.passport.user:",req.session.passport.user);
            //console.log("app req.session:",req.session);
            
            var tmp_id = req.session.passport.user;

            

				User.findById(tmp_id, function (err, doc) {  
				    // Handle any possible database errors
				    if (err) {
				        res.status(500).send(err);
				    } else {
				        // Update each attribute with any possible attribute that may have been submitted in the body of the request
				        // If that attribute isn't in the request body, default back to whatever it was before.
                        console.log("doc.email: ",doc.email);
                        
				        doc.publickey = req.body.publickey;
				        doc.privatekey = req.body.privatekey;


				        // Save the updated document back to the database
                      
				        doc.save(function (err, todo) {
				            if (err) {
				                res.status(500).send(err)
				            }
				            console.log('doc saved:',doc)
				            //res.send(todo);
				        });         
				    }
                  
				});			
            



            res.redirect("/");            
	});

	// ----------------------------------------------
	//   get /customerexistinBank
	// ----------------------------------------------
	router.get('/customerexistinBank', function(req, res, next) 
	{

		console.log("-------------------------------------- ");
        console.log("/customerexistinBank");

        
        var doc_type = req.query.doc_type;
        var doc_num  = req.query.doc_num;
        
        
        console.log(req.query);
        
         //url: "http://apicast-hackaton-galicia.b9ad.pro-us-east-1.openshiftapps.com/api/v1/customers?apikey=b5776541fc93e7f10a07f7c5f0ec7c8e";

		//		tmp_id = temp_id.split(":")[0];

				//console.log("t_invoice:",t_invoice);
				//var json_t_invoice = JSON.stringify(t_invoice);
				//var json_t_invoice = t_invoice;
				//console.log("json_t_invoice:",json_t_invoice);
	            var destinatioUrl = "http://apicast-hackaton-galicia.b9ad.pro-us-east-1.openshiftapps.com/api/v1/customers?apikey=b5776541fc93e7f10a07f7c5f0ec7c8e";
				var options = 
				{
				  uri: destinatioUrl,
				  method: 'GET'
				  //json: json_t_invoice
				  //body: json_t_invoice
				};

				console.log("----------------------------------");
				console.log("Request --------------------------");			

				request(options, function (error, response, body) 
				{
                    if (!error && response.statusCode == 200) 
                    {
                     console.log("body.id:",body.id) // Print the shortened url.
                    }
                    console.log("Error:", error);
                    //console.log("Response:", response);´´
                    //console.log("body:", body);

                    var t_body = JSON.parse(body);
                    var record_selected = -1;
                    console.log("t_body:", t_body);
                    for (var i = t_body.length-1; i > 0; i--) 
                    {
                        console.log(t_body[i].Doc_Type+"<>"+doc_type+"<>"+i);
                        //console.log(t_body[i].Doc_Type);                        
                        if (t_body[i].Doc_Type == doc_type && t_body[i].Doc_Number == doc_num)
                        {
                            record_selected = i;
                            console.log("RecSelected"+">"+t_body[i]+"<>"+t_body[i].Doc_Type+"<>"+i);
                            i = -10;
                        }
                        
                    };
                    if (record_selected > -1)
                    {
                        res.send(t_body[record_selected]);
                    }
                    else
                    {
                        res.send("MENSAJE: No esta registrado en el Banco.  Recuerde usted dará mayor confianza a los inversores si posee cuentas en el BANCO GALICIA");
                    }
                /*
				  console.log("t_body.status: ", t_body[0].status);
				  //console.log("status:", status);
				  console.log("body.messages:", t_body[0].messages[0].message);
   				  console.log("body.messages.length :", t_body[0].messages.length);

  				  console.log("body.messages:", t_body[0].messages[1].id);
  				  console.log("body.messages:", t_body[0].messages[1].number);
				  console.log("body.messages ultimo:", t_body[0].messages[1].message);
                  */
				  //res.send(t_body);
				  console.log("despues de body")
				});
				 console.log("Fuera de request")

	}); //router.get





// //////////////////////////////////////////////////////////////
//      E N D   F U N C I O N E S   D E   B L O C K C H A I N
// //////////////////////////////////////////////////////////////







/* **********************************

/*         GET home page. */


router.get('/ldap_login', function(req, res, next) 
{

	//return 
		//res.render('shop/index', { title: 'CASUPO'});

	// using jQuery & 'headers' property

	res.render('process/testing_login', { title: 'TESTING LOGIN'});

});


router.get('/sendmail', function(req, res, next) 
{

	console.log("Entro a sendmail");

	var sendmail = require('../sendmail')({silent: true});

	sendmail({
	  from: 'test@yourdomain.com',
	  to: 'jbcarta@hotmail.com',
	  subject: 'Rechazo de Fatura',
	  html: 'La factura tiene incongruencias'
	}, function (err, reply) {
	  console.log(err && err.stack)
	  console.dir(reply)
	});
});


router.get('/', function(req, res, next) {



    console.log("------------------------------- GET(/)");
	var messages = req.flash('error');
	var xemail = "< NoID >";

    console.log("-----------req.session.passport", req.session.passport);    

	if (req.session == undefined || req.session.passport == undefined || req.session.passport.user == undefined)
/*	if (req.session.passport == undefined)
	{ 
	    res.redirect("/user/signin");
    }
	else
	{
	if (req.session.passport.user == "undefined") */
	{ 
	    res.redirect("/user/signin");
    }
    else		
	{

    	console.log("-----------req.session", req.session.passport.user);    
    	console.log("-----------req.session.passport.user yes?", req.session.passport.user == "undefined");        

	    console.log("-------------------------------req.session.passport.user:>",req.session.passport.user,"<");
		User.findById(req.session.passport.user, {email:1}, function (error, docs, next) 
		{	

			//console.log('user_id', req.session.passport.user);
			//User.findById(req.session.passport.user, {email:1}, function(err, docs) 
			//{
			console.log("---------------------------error:",error);
			console.log("---------------------------docs:",docs);
			console.log("---------------------------next:",next);

			if (error) 
			{
				xemail = "error";
				res.render(	'shop/index', 
							{	title: 'INVOICE2PAY', x_email : xemail,  
								messages: messages, hasErrors: messages.length > 0});

			}else
			{
				if (docs)
				{


					if ("email" in docs)
					{ 
						xemail = docs.email;
					}
				console.log('get(/) xemail', xemail);
				res.render(	'shop/index', 
							{	title: 'INVOICE2PAY', x_email : xemail,  
								messages: messages, hasErrors: messages.length > 0});
				}
			}

		});

	}		
});


	// ----------------------------------------------
	//   get /supplierinvoiceSelected_writefilejson
	// ----------------------------------------------
	router.get('/supplierinvoiceSelected_writefilejson', function(req, res, next) 
	{

		//	   	Supplierinvoice.find({ supplier: { $exists: true }, accountingdate: { $exists: true } } , function(err, alldata)


		var temp_id = req.query.id;

		//		tmp_id = temp_id.split(":")[0];
		console.log("/supplierinvoiceSelected_writefilejson");
		console.log("-------------------------------------- ");
		console.log('/supplierinvoiceSelected_writefilejson req.query:'+req.query);
		console.log('/supplierinvoiceSelected_writefilejson req.query.id:'+req.query.id);			
		console.log("/supplierinvoiceSelected_writefilejson/post_id : "+temp_id);

	   	//Supplierinvoice.find({ supplier: { $exists: true } } , function(err, docs)
	   	Supplierinvoice.findById(temp_id, function(err, docs) 
		{
			console.log("docs:"+docs);
			console.log("err:"+err);			
			if (err)
			{
				console.log('/supplierinvoiceSelected_writefilejson -find error:',err);
				res.send(err);
			}

			var t_invoice = [];

			console.log("docs.length:", docs.length);

			// for (var i = 0; i < docs.length; i++) 
			// {
				var t_detail = [];
				var t_taxes = [];		
				console.log("docs[i].detail.length :"+docs.detail.length);

				var tnetamountinvoice = docs.netamountinvoice.split("$")[0];
				tnetamountinvoice = tnetamountinvoice.split(".")[0];
				tnetamountinvoice =tnetamountinvoice.split(",")[0].concat(tnetamountinvoice.split(",")[1]);
				console.log("docs.netamountinvoice: ", docs.netamountinvoice);				
				console.log("tnetamountinvoice: ", tnetamountinvoice);


				for (var j = 0; j < docs.detail.length; j++) 
				{
					console.log("docs.detail[j].costcenter.split(':')[0] :"+docs.detail[j].costcenter.split(":")[0]);					
					t_detail[j] =
					{
						costcenter : docs.detail[j].costcenter.split(":")[0],
						accountcode: docs.detail[j].accountcode.split(":")[0],
						order: docs.detail[j].order.split(":")[0],
						concept: docs.detail[j].concept,
						servicemonth: docs.detail[j].servicemonth,
						description: docs.detail[j].description,
						netamount: tnetamountinvoice
					}

				}

				for (var k = 0; k < docs.detailtax.length; k++) 
				{
					var tmptax =  docs.detailtax[k].taxcode.split("%")[0];
					var tcodetax = tmptax.split(":")[0];
					var ttax = tmptax.split(" ")[1];

					t_taxes[k] =
					{
						taxcode : tcodetax,
						taxamount: ttax,
						netamountbase: docs.detailtax[k].taxamount
					}

				}
				

				var ttotal = docs.totalinvoice.split("$")[0];
				ttotal = ttotal.split(".")[0];
				ttotal = ttotal.split(",")[0].concat(ttotal.split(",")[1]);

				t_invoice[0] = 
						{
							id_invoice2pay : docs._id,
							sap_id : "",
							supplier : docs.supplier.split(":")[0],
							company :  docs.company.split(":")[0],
							doctype: docs.documenttype.split(":")[0],
							accountingdate: docs.accountingdate,
							documentdate: docs.documentdate,
							documenttype: docs.documenttype.split(":")[0],
							documentnumber: docs.documentnumber,
							currency: docs.currency,
							netamountinvoice: tnetamountinvoice,
							totaltax: docs.totaltax.split("$")[0],
							totalinvoice: ttotal, //docs.totalinvoice.split("$")[0],
							detail : [],
							taxes : []
						}

				//t_invoice[i].detail .push(t_detail)
				t_invoice[0].detail = t_detail;
				t_invoice[0].taxes = t_taxes;

			//};  //for (var i = 0; i < docs.length; i++) 

			//  -------------------
			//   Save to disk json
			//  -------------------	
			/*		
				var file = '/temp/testjson1.json'
				var obj = {name: 'JP'}			 
				jsonfile.writeFile(file, t_invoice, {spaces: 2}, function (err) 
				{
				  console.error(err)
				});
			*/

			//  -------------------
			//   Send invoice to SAP
			//  -------------------			
				/*
	            var destinatioUrl = "http://clxsapjgw01:8080/ClxWebService/invoice2pay";
	            $.ajax(
	            {
	                type: 'POST',
	                //contentType:'application/json',
	                //headers: {'Content-Type' : 'application/json', 'Access-Control-Allow-Origin': '*'}, 
	                url: destinatioUrl,
	                data: JSON.stringify(t_invoice),
	                //dataType: 'json',
	                //jsonpCallback: 'myCallBackMethod',
	                crossDomain: true
	            });
				*/
				console.log("t_invoice:",t_invoice);
				var json_t_invoice = JSON.stringify(t_invoice);
				//var json_t_invoice = t_invoice;
				console.log("json_t_invoice:",json_t_invoice);
	            var destinatioUrl = "http://clxsapjgw01:8080/ClxWebService/invoice2pay";
				var options = 
				{
				  uri: destinatioUrl,
				  method: 'POST',
				  //json: json_t_invoice
				  body: json_t_invoice
				};

				console.log("----------------------------------");
				console.log("Request --------------------------");			

				request(options, function (error, response, body) 
				{
				  if (!error && response.statusCode == 200) 
				  {
				     console.log("body.id:",body.id) // Print the shortened url.
				  }
				  console.log("Error:", error);
				  //console.log("Response:", response);´´
				  console.log("body:", body)
				  var t_body = JSON.parse(body);
				  console.log("t_body:", t_body)				  
				  console.log("t_body.status: ", t_body[0].status);
				  //console.log("status:", status);
				  console.log("body.messages:", t_body[0].messages[0].message);
   				  console.log("body.messages.length :", t_body[0].messages.length);

  				  console.log("body.messages:", t_body[0].messages[1].id);
  				  console.log("body.messages:", t_body[0].messages[1].number);
				  console.log("body.messages ultimo:", t_body[0].messages[1].message);
				  res.send(t_body);
				  console.log("despues de body")
				});
				 console.log("Fuera de request")

				//console.log(output);
		}); // Supplierinvoice.findById

	}); //router.get




	// ----------------------------------------------
	//      get /supplierinvoice_writefilejson
	// ----------------------------------------------
	router.get('/supplierinvoice_writefilejson', function(req, res, next) 
	{

//	   	Supplierinvoice.find({ supplier: { $exists: true }, accountingdate: { $exists: true } } , function(err, alldata)
	   	Supplierinvoice.find({ supplier: { $exists: true } } , function(err, alldata)
		{
			if (err)
			{
				console.log('api-error:',err);
				res.send(err);

			}


			var t_invoice = [];
		
			for (var i = 0; i < alldata.length; i++) 
			{
				var t_detail = [];
				var t_taxes = [];		

				for (var j = 0; j < alldata[i].detail.length; j++) 
				{
					t_detail[j] =
					{
						costcenter : alldata[i].detail[j].costcenter.split(":")[0],
						accountcode: alldata[i].detail[j].accountcode.split(":")[0],
						order: alldata[i].detail[j].order.split(":")[0],
						concept: alldata[i].detail[j].concept,
						servicemonth: alldata[i].detail[j].servicemonth,
						description: alldata[i].detail[j].description
					}

				}

				for (var k = 0; k < alldata[i].detailtax.length; k++) {
					t_taxes[k] =
					{
						taxcode : alldata[i].detailtax[k].taxcode,
						taxamount: alldata[i].detailtax[k].taxamount,
					}

				}
				
				t_invoice[i] = 
						{
							id_invoice2pay : alldata[i]._id,
							sap_id : "",
							supplier : alldata[i].supplier.split(":")[0],
							company :  alldata[i].company.split(":")[0],
							accountingdate: alldata[i].accountingdate,
							documentdate: alldata[i].documentdate,
							documenttype: alldata[i].documenttype.split(":")[0],
							documentnumber: alldata[i].documentnumber,
							currency: alldata[i].currency,
							netamountinvoice: alldata[i].netamountinvoice.split("$")[0],
							totaltax: alldata[i].totaltax.split("$")[0],
							totalinvoice: alldata[i].totalinvoice.split("$")[0],
							detail : [],
							taxes : []
						}

				//t_invoice[i].detail .push(t_detail)
				t_invoice[i].detail = t_detail;
				t_invoice[i].taxes = t_taxes;

			};

	//		res.json(output);

			var file = '/temp/testjson1.json'
			var obj = {name: 'JP'}
			 
			//jsonfile.writeFile(file, alldata, function (err) {
			jsonfile.writeFile(file, t_invoice, {spaces: 2}, function (err) {
			  console.error(err)
			})

			// Return all clients
			//console.log(output);
			res.json(t_invoice);
		});

	});


	// *****************************************************
	//
	//
	//      get /supplierinvoice_sendjson2server
	//
	//	
	// *****************************************************
	//router.get('/supplierinvoice_sendjson2server/:id', function(req, res, next) 	
	router.post('/supplierinvoice_sendjson2server', function(req, res, next) 
	{
		console.log("-------------------------------------------");		
		console.log("/supplierinvoice_sendjson2server/:id");
		console.log("entre a /supplierinvoice_sendjson2server");

		var temp_id = req.query.id;
		console.log(" temp_id:"+temp_id);
		//console.log(" y_id:"+req.params.id);

		// Supplierinvoice.find({ supplier: { $exists: true }, accountingdate: { $exists: true } } , function(err, alldata)
	   	// Supplierinvoice.find({ supplier: { $exists: true } } , function(err, alldata)
		Supplierinvoice.findById(temp_id, function (err, doc)		  	   		
		{
			if (err)
			{
				console.log('api-error:',err);
				res.send(err);

			}


			// -------------------------------------------
			// Prepare amount and delete miles separator
			//  

			var t_amountinvoice = doc.netamountinvoice;
			//alert(t_amountinvoice);
			if (t_amountinvoice.split(",")[1])
			{
				var t_amountinvoice1 = t_amountinvoice.split(",")[0]+t_amountinvoice.split(",")[1];
			}
			else
			{
				var t_amountinvoice1 = t_amountinvoice.split(",")[0];
				t_amountinvoice1 = t_amountinvoice1.split(".")[0]; // quitar decimales para testear
			}

			var t_totaltax = doc.totaltax;
			if (t_totaltax.split(",")[1])
			{
				var t_totaltax1 = t_totaltax.split(",")[0]+t_totaltax.split(",")[1];
			}
			else
			{
				var t_totaltax1 = t_totaltax.split(",")[0]; 
				t_totaltax1 = t_totaltax1.split(".")[0]; // quitar decimales para testear
			}

    
			var t_totalinvoice = doc.totalinvoice;
			if (t_totalinvoice.split(",")[1])
			{
				var t_totalinvoice1 = t_totalinvoice.split(",")[0]+t_totalinvoice.split(",")[1];
			}
			else
			{
				var t_totalinvoice1 = t_totalinvoice.split(",")[0];
				t_totalinvoice1 = t_totalinvoice1.split(",")[0];  // quitar decimales para testear
			}
          
			t_amountinvoice1 = t_amountinvoice1.split("$")[0].trim();
			t_totaltax1 = t_totaltax1.split("$")[0].trim();
			t_totalinvoice1 = t_totalinvoice1.split("$")[0].trim();

			console.log("****************************************************");
			console.log("            ");			
			console.log("*******      M o n t o s     ***********************");
			console.log("            ");						
			console.log("t_amountinvoice1:",t_amountinvoice1);
			console.log("t_totaltax1:",t_totaltax1);
			console.log("t_totalinvoice1:",t_totalinvoice1);
			console.log("****************************************************");

			// --------------------------
			// 		Prepare XML
			//  

			var arecord = [];
			var t_taxes = [];

			var adetail = [];
			var t_invoice = [];
			var t_detail = [];           


			console.log(doc);
			console.log("doc.detailtax.length :",doc.detailtax.length);
			console.log("doc.detailtax[0].taxcode :",doc.detailtax[0].taxcode);          
			if (doc.detailtax.length > 0 && doc.detailtax[0].taxcode != "")
			{

				var tax_with_data = false;
				doc.detailtax.forEach(function(tax_line) 
				{
				  console.log(tax_line);
				  if (tax_line.taxcode != "")
				  {
				  	console.log("tax_line.taxcode:",tax_line.taxcode);
				    t_taxes = 
				          { 
				            taxcode: tax_line.taxcode.split(":")[0],
				            taxamount: tax_line.taxamount,
				            tamountinvoice: t_amountinvoice1
				          };			  	
				  }
				  else
				  {
				  	console.log("tax_codeline vacio")
				  }
				});


				// alert("existe tax");
				//var x_taxcode = $("#taxcode").val().split(":")[0];
				//var x_taxamount = $("#taxamount").val();
				//var x_netamountbase = t_amountinvoice1;

				t_invoice[0] = 
				{
                    "id_invoice2pay": temp_id, //"5931cd0ec4a8ba0c1c4CCd44",
                    "supplier": doc.supplier.split(":")[0],
                    "company":  doc.company.split(":")[0],
                    "doctype": " ", //$("#tpdoc").val().split(":")[0], (NORMALMENTE FA, NC)
                    "accountingdate": doc.accountingdate,
                    "documentdate": doc.documentdate,
                    "documenttype": doc.documenttype.split(":")[0], //"KA",
                    "documentnumber": doc.documentnumber,
                    "currency": doc.currency,
                    "netamountinvoice": t_amountinvoice1, // "100.15", 
                    "totaltax": t_totaltax1 , //"21.03", //$("#totaltax").val(),
                    "totalinvoice": t_totalinvoice1, //"121.18", //$("#totalinvoice").val(),
					"detail": 
					[
						{
							"costcenter":  doc.detail[0].costcenter.split(":")[0], //"CONT9101",
							"accountcode": doc.detail[0].accountcode.split(":")[0], //"7739500100",
							"order": doc.detail[0].order.split(":")[0], // "4000660"
							"concept": doc.detail[0].concept,
							"servicemonth": doc.detail[0].servicemonth,
							"description": doc.detail[0].description,
							"netamount": t_amountinvoice1, //"100.15" //$("#netamountinvoice").val()
						}
					],
                    "taxes": 
					[
						{
						  //"taxcode": x_taxcode,
						  //"taxamount": x_taxamount, //$("#taxamount").val(),
						  //"netamountbase": x_netamountbase, //"100.15"
						  
						  "taxcode": t_taxes.taxcode,
						  "taxamount": t_taxes.taxamount, //$("#taxamount").val(),
						  "netamountbase": t_taxes.tamountinvoice, //"100.15"
						}
					] 
                }

            }
      		else
          	{
				t_invoice[0] = 
				{

                    "id_invoice2pay": temp_id, //"5931cd0ec4a8ba0c1c4CCd44",
                    "supplier": doc.supplier.split(":")[0],
                    "company":  doc.company.split(":")[0],
                    "doctype": " ", //$("#tpdoc").val().split(":")[0], (NORMALMENTE FA, NC)
                    "accountingdate": doc.accountingdate,
                    "documentdate": doc.documentdate,
                    "documenttype": doc.documenttype.split(":")[0], //"KA",
                    "documentnumber": doc.documentnumber,
                    "currency": doc.currency,
                    "netamountinvoice": t_amountinvoice1, // "100.15", 
                    "totaltax": t_totaltax1 , //"21.03", //$("#totaltax").val(),
                    "totalinvoice": t_totalinvoice1, //"121.18", //$("#totalinvoice").val(),
					"detail": 
					[
						{
							"costcenter":  doc.detail[0].costcenter.split(":")[0], //"CONT9101",
							"accountcode": doc.detail[0].accountcode.split(":")[0], //"7739500100",
							"order": doc.detail[0].order.split(":")[0], // "4000660"
							"concept": doc.detail[0].concept,
							"servicemonth": doc.detail[0].servicemonth,
							"description": doc.detail[0].description,
							"netamount": t_amountinvoice1, //"100.15" //$("#netamountinvoice").val()
						}
					],
                    "taxes": []
                }
			}
   			console.log("--------------------------------------------------");
   			console.log("--------------------------------------------------");   			
			console.log("JSON.stringify(t_invoice):",JSON.stringify(t_invoice));

			console.log("settings.sapWebServer: ",settings.sapWebServer);
			var options = 
				{
				  method: 'post',
				  headers: { "content-type": "application/json" },
	 			  url: settings.sapWebServer,
				  body: JSON.stringify(t_invoice)			  
				  //json: true, // Use,If you are sending JSON data
				  //url: url,
				}

							request(options, function (error, response, body)
							{
							//response.on('end', () => {

								console.log("response:", response);	
								console.log("response.body:", response.body);
								var response1 = JSON.parse(response.body);

								console.log("response1:", response1);

								console.log("response1[0].status:", response1[0].status);	
								console.log("response1[0].id_invoice:", response1[0].id_invoice);	
								console.log("response1[0].id_status:", response1[0].status);	

								console.log("error:", error);	


								//res.json(response);
								//res.send(response);




				  					console.log("Body complete:");
									console.dir("response:", response);

				                    if (response["error"] == true) 
				                    {
				                      var infotext = response["message"]+
				                                      "\n   Fecha Doc : "+response["documentdate"]+
				                                      "\n   Tipo Doc  : "+response["documenttype"]+
				                                      "\n   Num.Doc   : "+response["documentnumber"]+
				                                      "\n   Monto Neto: "+response["netamount"];
				                        console.log("ADVERTENCIA! : "+infotext);
				                        //$("#numdoc").val($("#lastVal").val());
				                        //$("#numdoc").focus();
				                    }


				Supplierinvoice.findById(response1[0].id_invoice, function (err, doc) 
				{  
					console.log("Suplierinvoice.findById   -----------------------------------");
					console.log("err...."+err);
					console.log("doc...."+doc);
				    // Handle any possible database errors
				    if (err) 
				    {
				    	console.log("No existe el Registro");
				        res.status(500).send(err);
				    } 
				    else 
				    {
				    	console.log("Sin error...");
				    	//console.log("doc existe?", (doc));
				    	if (doc) //(doc.length > 0) /// existe el doc y lo actualiza
				    	{
							console.log("length > 0");

						    if(error) 
						    {
						    	doc.sap_status = "Error Comunicación"
						    }
						    else
						    {
							    if (response1[0].status == "E")
							    {
							    	doc.sap_status = "Rechazada"
							    }

							    else
							    {
							    	doc.sap_status = "ENVIADA A SAP";
							    }
							
							}

	
	                        if (response1[0].sap_reference)
	                        {
	                           doc.sap_id = response1[0].sap_reference;
	                        }
	                        else
	                        {
	                        	doc.sap_id = "#"
	                        }
	                        console.log("fecha ----------------------------------------");
							var d = new Date();
							var month = d.getMonth()+1;
							var day = d.getDate();
							doc.sap_date  = d.getFullYear() + '-' +
							    ((''+month).length<2 ? '0' : '') + month + '-' +
							    ((''+day).length<2 ? '0' : '') + day
							    + " @ " 
								+ d.getHours() + ":" 
								+ d.getMinutes() + ":" + d.getSeconds();
					    	var currentdate = new Date();							                            
                        	console.log("Date now: ", doc.sap_date );



                        var xdesc = "";
                        for (var i = 0; i < response1[0].messages.length; i++) {

                            xdesc = xdesc + "Mensaje "+i+": "+response1[0].messages[i].message+"\n";
                        }		1

						doc.sap_log = xdesc;

							//++++++++++++++++++++++++++++
							//   Grabar modificaciones
							doc.save(function(err, result) 
							{
								console.log( "Grabando:", result, err );
								if(err) {
								    console.log("Error .." + err);
								}
								else
								{
									//voicesaved = true;
								    console.log("Actualización existosa " + result + "document!");		
							 	}
							}); 
							//  ----------------fin grabar resto del proceso
							//  ----------------------------------------------------
				    	} // if (doc.length > 0)											
				    } //else if (err) 
				}); // Supplierinvoice.find(condition, function (err, doc) 


				                res.send(response1);			    


							});
//				});
		});			

			// Return all clients
			//console.log(output);

	});


    

	// --------------------------------------------------
	//      get /supplierinvoice_sendjson2server_backup
	// --------------------------------------------------
	router.get('/supplierinvoice_sendjson2server_backup', function(req, res, next) 
	{
		console.log("entre a /supplierinvoice_sendjson2server")
//	   	Supplierinvoice.find({ supplier: { $exists: true }, accountingdate: { $exists: true } } , function(err, alldata)
	   	Supplierinvoice.find({ supplier: { $exists: true } } , function(err, alldata)
		{
			if (err)
			{
				console.log('api-error:',err);
				res.send(err);

			}


			var t_invoice = [];
		
			for (var i = 0; i < alldata.length; i++) 
			{
				var t_detail = [];
				var t_taxes = [];		

				for (var j = 0; j < alldata[i].detail.length; j++) 
				{
					t_detail[j] =
					{
						costcenter : alldata[i].detail[j].costcenter.split(":")[0],
						accountcode: alldata[i].detail[j].accountcode.split(":")[0],
						order: alldata[i].detail[j].order.split(":")[0],
						concept: alldata[i].detail[j].concept,
						servicemonth: alldata[i].detail[j].servicemonth,
						description: alldata[i].detail[j].description
					}

				}

				for (var k = 0; k < alldata[i].detailtax.length; k++) {
					t_taxes[k] =
					{
						taxcode : alldata[i].detailtax[k].taxcode,
						taxamount: alldata[i].detailtax[k].taxamount,
					}

				}
				
				t_invoice[i] = 
						{
							id_invoice2pay : alldata[i]._id,
							sap_id : "",
							supplier : alldata[i].supplier.split(":")[0],
							company :  alldata[i].company.split(":")[0],
							accountingdate: alldata[i].accountingdate,
							documentdate: alldata[i].documentdate,
							documenttype: alldata[i].documenttype.split(":")[0],
							documentnumber: alldata[i].documentnumber,
							currency: alldata[i].currency,
							netamountinvoice: alldata[i].netamountinvoice.split("$")[0],
							totaltax: alldata[i].totaltax.split("$")[0],
							totalinvoice: alldata[i].totalinvoice.split("$")[0],
							detail : [],
							taxes : []
						}

				//t_invoice[i].detail .push(t_detail)
				t_invoice[i].detail = t_detail;
				t_invoice[i].taxes = t_taxes;

			};

	//		res.json(output);




		 	$.ajax({
        			url: "http://clxsapjgw01:8080/ClxWebService/invoice2pay",
        			contentType: "application/json; charset=utf-8",
        			//dataType: "json",
        			type: "POST",
        			data: t_invoice,
        			success: function (response) 
        			{
            			console.log("response");			//do whatever your thingy..
    				}
			});


			// Return all clients
			//console.log(output);
		});

	});



router.get('/add-to-cart/:id', function(req, res, next) {
	console.log('Entro a  ---------> /add-to-cart/:id');

	var productId = req.params.id;
	var cart = new Cart(req.session.cart ? req.session.cart : {items: {}});

	console.log('productId  ---------> ', productId);

	Product.findById(productId, function(err, product) {


		if (err) {
			console.log('Entro a  ---------> /add-to-cart.productId.err');
			console.log('Error    ---------> ', err);
			return res.redirect('/');
		}
		cart.add(product, product.id);
		req.session.cart = cart;
			console.log(req.session.cart);
			console.log("----------------------");
			for (key in req.session.cart.items) {
				console.log(req.session.cart.items[key].item.id);				
				console.log(req.session.cart.items[key].item.title);
   			}
		
		res.render('shop/shopcart', { title: 'Shopping Cart', shopcart: req.session.cart});

	});

});


router.get('/remove-one-from-cart/:id', function(req, res, next) {
	console.log('Entro a  ---------> /remove_one-from-cart/:id');

	var productId = req.params.id;
	var cart = new Cart(req.session.cart ? req.session.cart : {items: {}});

	console.log('productId  ---------> ', productId);

	Product.findById(productId, function(err, product) {


		if (err) {
			console.log('Entro a  ---------> /add-to-cart.productId.err');
			console.log('Error    ---------> ', err);
			return res.redirect('/');
		}
		cart.less1(product, product.id);
		req.session.cart = cart;
			console.log(req.session.cart);
			console.log("----------------------");
			for (key in req.session.cart.items) {
				console.log(req.session.cart.items[key].item.id);				
				console.log(req.session.cart.items[key].item.title);
   			}
		
		res.render('shop/shopcart', { title: 'Shopping Cart', shopcart: req.session.cart});

	});

});


router.get('/smartfind/:id', function(req, res, next) {
	console.log("paso 1 entre en get.smartfind");
	console.log(req.params);

	var findText = "/"+req.params.id+"/";

	var findText = "/"+req.params.id+"/";

	var cart = new Cart(req.session.cart ? req.session.cart : {items: {}});

	req.session.cart = cart;
	console.log("paso 2 entre en get.smartfind");

	Product.find({$or:[{description: {$regex:findText}}, {title: {$regex:findText,i}}]}, function(err, product) {
		console.log("paso 3 entre en get.smartfind.Product.find");		

		var productChunks = [];
		var chunkSize = 3;
		console.log("paso 4 entre en get.smartfind.Product.find");		
		console.log(product);		

		console.log("paso 5 entre en get.smartfind.Product.find");		

		for (var i = 0; i < product.length; i += chunkSize) {
			productChunks.push(product.slice(i, i + chunkSize));
		}	
		res.render('shop/index', { title: 'Shopping Cart', products: productChunks, shopcart: req.session.cart});
	});
});



// ==========================================
//
//     			Datos Maestros
//
// ==========================================

	//  ------------------------------------------------
	//                  get.usercecos
	//  ------------------------------------------------
		router.get('/userscecos', function(req, res, next) 
		{

			res.render('datamaster/userscecos', { title: 'Asignar Centros de Costos a Usuarios'});
		});	

	//  ------------------------------------------------
	//            post.userscecos_detail 
	//  ------------------------------------------------
		router.post('/userscecos_detail', function(req, res, next) 
		{
			var tmp_id = req.body.post_id;

			console.log('post /userscecos_detail/tmp_id  ---------> ', tmp_id);

			User.findById(tmp_id, function(err, docs) 
			{
				console.log("post /userscecos_detail/paso 1 en find");		
				console.log('Docs:', docs);
				console.log('docs.approver_code:', docs.email);

				var results_mongodb = [];
				results_mongodb.push(docs);
				console.log('results_mongodb:', results_mongodb);
				console.log('results_mongodb[0].email:', results_mongodb[0].email);

				res.render(	'datamaster/userscecos_edit', 
							{ title: 'Modificar Usuarios/Cecos', 
							recdata: docs});

				console.log("post /userscecos_detail/paso 2 en despues del render");		
			});
		});	

	//  -----------------------------------
	//
	//    POST userscecos_edit_post
	//
	//  -----------------------------------
		router.post('/userscecos_edit_post', function(req, res, next) 
		{

			var action_returned = req.body.returnaction;
			console.log('action_returned....... :'+action_returned);		
			if (action_returned == "Borrar")
			{
				//   -----------------------------------------------------
				//
				//            Borrar SupplierInvoice
				//
				//   -----------------------------------------------------
				console.log('Entro por borrar..........');
				console.log("---------------------------------: ");
		 		
				var temp_id = req.body.id;
				console.log("get /supplierInvoiceDelete/req.body.id : "+req.body.id);		

				console.log("get /supplierInvoiceDelete/temp_id : "+temp_id);



				// collection.deleteOne({_id: new mongodb.ObjectID('4d512b45cc9374271b00000f')});
				// Supplierinvoice.remove({_id: temp_id},{justOne: true,});

				console.log("Delete  --------------------------------: ");

		        User.remove({_id: temp_id}, {justOne: true, safe: true}, 
		        						function(err, result) 
		        {
		            if (err) 
		            {
						console.log("Error  --------------------------------: ");
		                console.log(err);
		                // throw err;
		            }
					console.log("Result   --------------------------------: ");
		            console.log(result);
		        });

				console.log("after Delete  --------------------------------: ");


				res.redirect('/userscecos');	 


	//			return res.redirect('/supplierinvoice');


			}
			else
			{
				console.log('Entro por Modificar..........')
				var tmp_id = req.body.id;
				console.log("---------------------------------: ");

				console.log("tmp_id: "+tmp_id);
				console.log("req.body.approver: "+req.body.approver);

				console.log('Antes -> findByIdAndUpdate  _id:',tmp_id);			

				User.findById(tmp_id, function (err, doc) {  
				    // Handle any possible database errors
				    if (err) {
				        res.status(500).send(err);
				    } else {
				        // Update each attribute with any possible attribute that may have been submitted in the body of the request
				        // If that attribute isn't in the request body, default back to whatever it was before.
				        doc.email = req.body.email || doc.email;
				        doc.name = req.body.name || doc.name;
				        doc.approver = req.body.approver || doc.approver;


				        // Save the updated document back to the database
				        doc.save(function (err, todo) {
				            if (err) {
				                res.status(500).send(err)
				            }
				            console.log('doc saved:',doc)
				            //res.send(todo);
				        });
				    }
				});			
				res.redirect('/userscecos');
			}    

		});


// -------

// ---- cambio con modelo de seguridad

/*
router.get('/userdmxxx', passport('level.admin', 
{
	successRedirect: '/userdm_accessverified',

	failureRedirect: "/userscecos",
	failureFlash: true
}));

*/

	//  ------------------------------------------------
	//                  get.userdm 
	//  ------------------------------------------------
		router.get('/userdm', isAdmin, function(req, res, next) 
		{
			//	Supplierinvoice.find( function(err, supplierinvoice) {
			//		console.log(supplierinvoice);		
			//		res.render('headers', { title: 'Facturas'});

			//        res.locals.typemenu = "TRUE";

			//		res.optionmenu = true;



		console.log('user_id', req.session.passport.user);
		User.findById(req.session.passport.user, {email:1, administrator:1}, function(err, docs) 
		{
			console.log("-------------------------------:",docs);		
			console.log("Administrator:",docs.administrator);
			console.log("docs.hasOwnProperty(administrator):",docs.hasOwnProperty('administrator'));
			if (err) 
			{
				return done(err);
			}
			if ("administrator" in docs)
			{ 
				console.log("Tiene el objeto administrador");				

				if (docs.administrator == "S") 
				{
					console.log("administrador valor de S");					
					res.render('datamaster/userdm', { title: 'Usuarios Cuentas/Cecos'});
				}
			}
			//return done(null, false, {message: 'No Tiene Acceso'});
			else
			{
			  res.redirect('/');
			}
		});

			//	});
		});	

	// -------------------------------------
	//      Get /userdm_insert
	// -------------------------------------	
		router.get('/userdm_insert', function(req, res, next) 
		{

			//var tmp_id = req.params.id;

			console.log("------------------------------: ");

			console.log("/userdm_insert/get 1: ");		

			res.render('datamaster/userdm_create', { title: 'Crear Usuario'});

			//  	return res.redirect('/process/supplierinvoice_edit');

		});		

	// -------------------------------------
	//      post /userdm_insert
	// -------------------------------------	
		router.post('/userdm_insert', function(req, res, next) 
		{


	  		console.log('-----------------------------------------------');
	  		console.log('userdm_insert Post			   ---------------------');
	  		console.log('-----------------------------------------------');

	  		//console.log('post_query.cotcenter.length:',req.body.costcenter.length);

			var arecord = [];

			//  ----------------------------------------------------
			//  ---------------- inicio grabar resto del proceso

			arecord.push( 
					new User(
							{
								email: req.body.email,
								name: req.body.name,
								approver: req.body.approver,
								administrator : req.body.administrator,
								invoiceloader : req.body.invoiceloader,
								accounting : req.body.accounting
							}));

			// ++++++++++++++++++++++
			// 		Agregar Cuentas
			var tdetail = [];
			if (Object.prototype.toString.call(req.body.accountcode) === '[object Array]')
			{
				console.log('Account - como array:');
				console.log('Account - req.body.req.body.accountcode.length:', req.body.accountcode.length);

				for (var i=0; i < req.body.accountcode.length; i++)
				{
	  				console.log('post_query.req.body.accountcode[i]:',req.body.accountcode[i]);
		 			tdetail = 
		  					{	
		  						account: req.body.accountcode[i]
		  					};
		  			arecord[0].accounts.push(tdetail);	    
				}  			
			}
			else
			{
				console.log('Account - plano:');			
	  			console.log('post_query.account:',req.body.accountcode);

	  			tdetail = 
	  					{	
	  						account: req.body.accountcode
	  					};
	  			arecord[0].accounts.push(tdetail);
			};				

			// +++++++++++++++++++++++++++
			// 		Agregar CostCenter
			var tdetail = [];
			if (Object.prototype.toString.call(req.body.costcenter) === '[object Array]')
			{
				console.log('CostCenter - como array:');
				console.log('CostCenter - req.body.costcenter.length:', req.body.costcenter.length);

				for (var i=0; i < req.body.costcenter.length; i++)
				{
	  				console.log('post_query.req.body.costcenter[i]:',req.body.costcenter[i]);
		 			tdetail = 
		  					{	
		  						ceco: req.body.costcenter[i]
		  					};
		  			arecord[0].cecos.push(tdetail);			    
				}  			
			}
			else
			{
				console.log('CostCenter - plano:');			
	  			console.log('post_query.costcenter:',req.body.costcenter);

	  			tdetail = 
	  					{	
	  						ceco: req.body.costcenter
	  					};
	  			arecord[0].cecos.push(tdetail);
			};	

			// +++++++++++++++++++++++++++
			// 		Agregar FI orders
			var tdetail = [];
			if (Object.prototype.toString.call(req.body.fiorder) === '[object Array]')
			{
				console.log('fiorder - como array:');
				console.log('fiorder - req.body.fiorder.length:', req.body.fiorder.length);

				for (var i=0; i < req.body.fiorder.length; i++)
				{
	  				console.log('post_query.req.body.costcenter[i]:',req.body.fiorder[i]);
		 			tdetail = 
		  					{	
		  						fiorder: req.body.fiorder[i]
		  					};
		  			arecord[0].fi_orders.push(tdetail);			    
				}  			
			}
			else
			{
				if (req.body.fiorder)
				{
				console.log('fiorder - plano:');	
	  			console.log('post_query.fiorder:',req.body.fiorder);									
	  			console.log('post_query.fiorder.length:',req.body.fiorder.length);

	  			tdetail = 
	  					{	
	  						fiorder: req.body.fiorder
	  					};
	  			arecord[0].fi_orders.push(tdetail);
	  			}
			};	


			// +++++++++++++++++++++++++++
			// 		Grabar				
			arecord[0].save(function(err, result) 
			{
				console.log( "Grabando:", result, err );
				if(err) {
				    console.log("Error .." + err);
				}
				else
				{
				    console.log("Actualización existosa " + result + "document!");		
			 	}

			});    


			//  ----------------fin grabar resto del proceso
			//  ----------------------------------------------------


    	return res.render('datamaster/userdm', { title: 'Usuarios Cuentas/Cecos'});
	});





	//  ------------------------------------------------
	//            post.userdm_edit
	//  ------------------------------------------------
		router.post('/userdm_edit', function(req, res, next) 
		{
			var tmp_id = req.body.post_id;

			console.log('post /userdm_edit/tmp_id  ---------> ', tmp_id);

			User.findById(tmp_id, function(err, docs) 
			{
				console.log("post /userdm_edit/paso 1 en find");		
				console.log('Docs:', docs);
				console.log('docs.email:', docs.email);

				var results_mongodb = [];
				results_mongodb.push(docs);
				console.log('results_mongodb:', results_mongodb);
				console.log('results_mongodb[0].email:', results_mongodb[0].email);
				results_mongodb[0].password = "*****";

				res.render(	'datamaster/userdm_edit', 
							{ title: 'Modificar Usuarios', 
							recdata: results_mongodb});

				//console.log("post /userdm_edit/paso 2 en despues del render");		
			});
		});



// -----------------------------------
//
//    POST userdm_editsave
//			* Grabar Modificaciones
//          * Eliminar Documento
//
// -----------------------------------

router.post('/userdm_editsave', function(req, res, next) 

{
	console.log('En entro en /userdm_editsave ..........');

	var action_returned = req.body.returnaction;
	console.log('action_returned....... :'+action_returned);

	if (action_returned == "Borrar")
	{
		//   -----------------------------------------------------
		//
		//            Borrar SupplierInvoice
		//
		//   -----------------------------------------------------
		console.log('/userdm_editsave Entro por borrar. usuario .........');
		console.log("----------------------------------------------------: ");
 		
		var temp_id = req.body.id;
		console.log("get /supplierInvoiceDelete/req.body.id : "+req.body.id);		

		console.log("get /supplierInvoiceDelete/temp_id : "+temp_id);



		// collection.deleteOne({_id: new mongodb.ObjectID('4d512b45cc9374271b00000f')});
		// Supplierinvoice.remove({_id: temp_id},{justOne: true,});

		console.log("Delete  --------------------------------: ");

		//User.findOneAndDelete({_id: temp_id}, function (err, todo) 
		console.log("antes de FindByIdAndRemove --------------------------------: ");		
		//User.findByIdAndRemove({temp_id}, function (err, todo) 
		User.findOneAndRemove({_id: temp_id}, function (err, todo)
		{  
		    var response = {
		        message: "user successfully deleted",
		        User: temp_id
		    };
			console.log("dentro de FindByIdAndRemove todo : "+todo);	
			console.log("dentro de FindByIdAndRemove error: "+err);		

		    //res.send(response);
		});

		console.log("after Delete  --------------------------------: ");

		 // /supplierInvoiceInsertreq.method = 'GET'			
		// res.redirect('/');
		console.log("after redirect --------------------------------: ");		 
		 //res.send({redirect: '/userdm'});
		//res.render('process/supplierinvoice_new', { title: 'Facturas'});


	}
	else
	{

  		console.log('-----------------------------------------------');
  		console.log('userdm_editsave - Modificar          ----------');
  		console.log('-----------------------------------------------');
		console.log('req.body.administrator:'+req.body.administrator);
		//		var tmp_id = req.params.id;
		var tmp_id = req.body.id;
		var tmp_linenumber = req.body.linenumber;

		console.log("tmp_id: "+tmp_id);
		var condition = {"_id": tmp_id}
		console.log("req.body.approver: ", req.body.approver);


		// Blanquea todos los subdocumentos para evitar actualizar 1 a 1
		User.update(condition, 
					{ $set: { accounts: [], cecos : [], fi_orders : [], approvalareas : [] }}, 
					function(err, affected)
		{

			User.find(condition, function (err, doc) 
			{  
				console.log("err...."+err);
				console.log("doc...."+doc);
			    // Handle any possible database errors
			    if (err) 
			    {
			    	console.log("No existe el Registro");
			        res.status(500).send(err);
			    } else 
			    {
			    	if (doc.length > 0) /// existe el doc y lo actualiza
			    	{

						doc[0].email = req.body.email;
						doc[0].name = req.body.name;
						doc[0].approver = req.body.approver;
						doc[0].administrator = req.body.administrator;
						doc[0].invoiceloader = req.body.invoiceloader;
						doc[0].accounting = req.body.accounting;

						console.log("req.body.newpassword: "+req.body.newpassword);
						if (req.body.newpassword.length > 0)
						{
							var newUser = new User();
						    console.log("Antes   ->doc[0].password: "+doc[0].password);							
					 		doc[0].password = newUser.encryptPassword(req.body.newpassword);
						    console.log("Despues ->doc[0].password: "+doc[0].password);

						}

						// ++++++++++++++++++++++
						// 		Agregar Cuentas
						var tdetail = [];
						if (Object.prototype.toString.call(req.body.accountcode) === '[object Array]')
						{
							console.log('Account - como array:');
							console.log('Account - req.body.req.body.accountcode.length:', req.body.accountcode.length);

							for (var i=0; i < req.body.accountcode.length; i++)
							{
				  				console.log('post_query.req.body.accountcode[i]:',req.body.accountcode[i]);
					 			tdetail = 
					  					{	
					  						account: req.body.accountcode[i]
					  					};
					  			doc[0].accounts.push(tdetail);	    
							}  			
						}
						else
						{
							if (req.body.accountcode)
							{
								console.log('Account - plano:',req.body);			
					  			console.log('post_query.account:',req.body.accountcode);

					  			tdetail = 
					  					{	
					  						account: req.body.accountcode
					  					};
					  			doc[0].accounts.push(tdetail);
				  			}
						};				

						// +++++++++++++++++++++++++++++++
						// 		Agregar Area Aprobadora
						var tdetail = [];
						if (Object.prototype.toString.call(req.body.approvalarea) === '[object Array]')
						{
							console.log('Approvalarea - como array:');
							console.log('Approvalarea - req.body.req.body.Approvalarea.length:', req.body.approvalarea.length);

							for (var i=0; i < req.body.approvalarea.length; i++)
							{
				  				console.log('post_query.req.body.approvalarea[i]:',req.body.approvalarea[i]);
					 			tdetail = 
					  					{	
					  						approvalarea: req.body.approvalarea[i]
					  					};
					  			doc[0].approvalareas.push(tdetail);	    
							}  			
						}
						else
						{
							if (req.body.approvalarea)
							{
								console.log('Approvalarea - plano:',req.body);			
					  			console.log('post_query.Approvalarea:',req.body.approvalarea);

					  			tdetail = 
					  					{	
					  						approvalarea: req.body.approvalarea
					  					};
					  			doc[0].approvalareas.push(tdetail);
				  			}
						};				


						// +++++++++++++++++++++++++++
						// 		Agregar CostCenter
						var tdetail = [];
						if (Object.prototype.toString.call(req.body.costcenter) === '[object Array]')
						{
							console.log('CostCenter - como array:');
							console.log('CostCenter - req.body.costcenter.length:', req.body.costcenter.length);

							for (var i=0; i < req.body.costcenter.length; i++)
							{
				  				console.log('post_query.req.body.costcenter[i]:',req.body.costcenter[i]);
					 			tdetail = 
					  					{	
					  						ceco: req.body.costcenter[i]
					  					};
					  			doc[0].cecos.push(tdetail);			    
							}  			
						}
						else
						{
							if (req.body.costcenter)
							{
							console.log('CostCenter - plano:');	
				  			console.log('post_query.costcenter:',req.body.costcenter);									
				  			console.log('post_query.costcenter.length:',req.body.costcenter.length);

				  			tdetail = 
				  					{	
				  						ceco: req.body.costcenter
				  					};
				  			doc[0].cecos.push(tdetail);
				  			}
						};	

						// +++++++++++++++++++++++++++
						// 		Agregar FI orders
						var tdetail = [];
						if (Object.prototype.toString.call(req.body.fiorder) === '[object Array]')
						{
							console.log('fiorder - como array:');
							console.log('fiorder - req.body.fiorder.length:', req.body.fiorder.length);

							for (var i=0; i < req.body.fiorder.length; i++)
							{
				  				console.log('post_query.req.body.costcenter[i]:',req.body.fiorder[i]);
					 			tdetail = 
					  					{	
					  						fiorder: req.body.fiorder[i]
					  					};
					  			doc[0].fi_orders.push(tdetail);			    
							}  			
						}
						else
						{
							if (req.body.fiorder)
							{
							console.log('fiorder - plano:');	
				  			console.log('post_query.fiorder:',req.body.fiorder);									
				  			console.log('post_query.fiorder.length:',req.body.fiorder.length);

				  			tdetail = 
				  					{	
				  						fiorder: req.body.fiorder
				  					};
				  			doc[0].fi_orders.push(tdetail);
				  			}
						};	

						//++++++++++++++++++++++++++++
						//   Grabar modificaciones
						doc[0].save(function(err, result) 
						{
							console.log( "Grabando:", result, err );
							if(err) {
							    console.log("Error .." + err);
							}
							else
							{
							    console.log("Actualización existosa " + result + "document!");		
						 	}
						}); 
						//  ----------------fin grabar resto del proceso
						//  ----------------------------------------------------
			    	} // if (doc.length > 0)											
			    } //else if (err) 
			}); // User.find(condition, function (err, doc) 
		}); //User.update(condition, 
			//		{ $set: { detail: [], detailtax : [] }}, 
			//		function(err, affected)

	} 
    return res.render('datamaster/userdm', { title: 'Usuarios Cuentas/Cecos'}); 
});


	//  ***********************************************
	//      				CONCEPTS 
	//  ***********************************************
		//  ------------------------------------------------
		//                  get.Concepts
		//              llamado desde el menu
		//  ------------------------------------------------
			router.get('/concept', isAdmin, function(req, res, next) 
			{
				//	Supplierinvoice.find( function(err, supplierinvoice) {
				//		console.log(supplierinvoice);		
				//		res.render('headers', { title: 'Facturas'});

				//        res.locals.typemenu = "TRUE";

				//		res.optionmenu = true;

					res.render('datamaster/concepts', { title: 'Conceptos'});
				//	});
			});	



		// -------------------------------------
		//      	get /api/concepts
		//        llamado desde el datatable
		// -------------------------------------	
			router.get('/api/concepts', function(req, res, next) 
			{
				console.log('Entro en /api/concepts.........');
			   	Concepts.find({ concept: { $exists: true } } , function(err, alldata)
				{
					console.log('Entro en /api/concept .. dentro de find');

					if (err)
					{
						console.log('api-error:',err);
						res.send(err);

					}

					console.log('alldata.size:',alldata.length);
					var totrec = alldata.length;
				    var output = { "iTotalRecords" : totrec, "iTotalDisplayRecords" : 10 };
				    output["data"] = alldata;

					res.json(output);
				});

			});

		// -------------------------------------
		//      Get /concept_insert
		//    llamado desde concepts.hbs
		// -------------------------------------	
			router.get('/concept_insert', function(req, res, next) 
			{

				res.render('datamaster/concept_create', { title: 'Crear Concepto'});

			});

		// -------------------------------------
		//      post /concept_insert
		//    llamado desde concept_create.hbs		
		// -------------------------------------	
			router.post('/concept_insert', function(req, res, next) 
			{
				// var post_data = req.body;
		  		// console.log('post_data:',post_data);

				var arecord = [];

				arecord.push( 
					new Concepts(
						{
							concept: req.body.concept
						}));

				arecord[0].save(function(err, result) 
				{
					console.log( "Grabando:", result, err );
					if(err) {
					    console.log("Error .." + err);
					}
					else
					{
					    console.log("Actualización existosa " + result + "document!");		
				 	}

				});        
				return res.redirect('/concept');

			});

		//  ------------------------------------------------
		//            post.concept_detail 
		//  ------------------------------------------------
			router.post('/concept_detail', function(req, res, next) 
			{
				var tmp_id = req.body.post_id;

				console.log('post /approver_detail/tmp_id  ---------> ', tmp_id);

				Concepts.findById(tmp_id, function(err, docs) 
				{
					console.log("post /concept_detail/paso 1 en Concept.find");		
					console.log('Docs:', docs);

					var results_mongodb = [];
					results_mongodb.push(docs);
					console.log('results_mongodb:', results_mongodb);
					console.log('results_mongodb[0].approver_code:', results_mongodb[0].concept);

					res.render(	'datamaster/concept_edit', 
								{ title: 'Modificar Conceptos', 
								recdata: docs});
				});
			});

		//  -----------------------------------
		//
		//    POST concept_edit_post
		//			* Grabar Modificaciones
		//          * Eliminar Documento
		//
		//  -----------------------------------
			router.post('/concept_edit_post', function(req, res, next) 

			{

				var action_returned = req.body.returnaction;
				console.log('action_returned....... :'+action_returned);		
				if (action_returned == "Borrar")
				{
					//   -----------------------------------------------------
					//
					//            Borrar Concepts
					//
					//   -----------------------------------------------------
					console.log('Entro por borrar..........');
					console.log("---------------------------------: ");
			 		
					var temp_id = req.body.id;
					console.log("get /ConceptDelete/req.body.id : "+req.body.id);		

					console.log("get /ConceptDelete/temp_id : "+temp_id);



					// collection.deleteOne({_id: new mongodb.ObjectID('4d512b45cc9374271b00000f')});
					// Supplierinvoice.remove({_id: temp_id},{justOne: true,});

					console.log("Delete  --------------------------------: ");

			        //Approver.remove({_id: temp_id}, {justOne: true, safe: true}, 
					Concepts.findOneAndRemove({_id: temp_id}, function(err, result) 
			        {
			            if (err) 
			            {
							console.log("Error  --------------------------------: ");
			                console.log(err);
			                // throw err;
			            }
						console.log("Result   --------------------------------: ");
			            console.log(result);
			        });

					console.log("after Delete  --------------------------------: ");

					res.redirect('/concept');

				}
				else
				{
					console.log('Entro por Modificar..........')
					var tmp_id = req.body.id;
					console.log("---------------------------------: ");

					console.log("tmp_id: "+tmp_id);

					console.log('Antes -> findByIdAndUpdate  _id:',tmp_id);			

					Concepts.findById(tmp_id, function (err, doc) {  
					    // Handle any possible database errors
					    if (err) {
					        res.status(500).send(err);
					    } else {
					        // Update each attribute with any possible attribute that may have been submitted in the body of the request
					        // If that attribute isn't in the request body, default back to whatever it was before.
					        doc.concept = req.body.concept || doc.concept;

					        // Save the updated document back to the database
					        doc.save(function (err, todo) {
					            if (err) {
					                res.status(500).send(err)
					            }
					            console.log('doc saved:',doc)
					            //res.send(todo);
					        });
					    }

					});			
					res.redirect('/concept');	 
				}    

			});


	//  ***********************************************
	//      		Centro de Costos
	//  ***********************************************


	//  ------------------------------------------------
	//                  get.cecos
	//  ------------------------------------------------
		router.get('/cecos', isAdmin, function(req, res, next) 
		{
			//	Supplierinvoice.find( function(err, supplierinvoice) {
			//		console.log(supplierinvoice);		
			//		res.render('headers', { title: 'Facturas'});

			//        res.locals.typemenu = "TRUE";

			//		res.optionmenu = true;

				res.render('datamaster/cecos', { title: 'Centro de Costos'});
			//	});
		});				


	//  ------------------------------------------------
	//            post.cecos_edit
	//  ------------------------------------------------
		router.post('/cecos_edit', function(req, res, next) 
		{
			var tmp_id = req.body.post_id;

			console.log('post /suppliers_edit/tmp_id  ---------> ', tmp_id);

			Cecos.findById(tmp_id, function(err, docs) 
			{
				console.log("post /Cecos_edit/paso 1 en Cecos.find");		
				console.log('Docs:', docs);
				console.log('docs.cecos:', docs.ceco);

				var results_mongodb = [];
				results_mongodb.push(docs);
				console.log('results_mongodb:', results_mongodb);
				//console.log('results_mongodb[0].approver_code:', results_mongodb[0].approvalarea);

				res.render(	'datamaster/cecos_edit', 
							{ title: 'Modificar Centro de Costos', 
							recdata: docs});

				console.log("post /cecos_edit/paso 2 en despues del render");		
			});
		});	


	//  -----------------------------------
	//
	//    POST cecos_edit_post
	//			* Grabar Modificaciones
	//          * Eliminar Documento
	//
	//  -----------------------------------
		router.post('/cecos_edit_post', function(req, res, next) 

		{

			var action_returned = req.body.returnaction;
			console.log('action_returned....... :'+action_returned);		
			if (action_returned == "Borrar")
			{
				//   -----------------------------------------------------
				//
				//            Borrar 
				//
				//   -----------------------------------------------------
				console.log('Entro por borrar..................');
				console.log("---------------------------------: ");
		 		
				var temp_id = req.body.id;
				console.log("req.body.id : "+req.body.id);		

				console.log("temp_id : "+temp_id);



				// collection.deleteOne({_id: new mongodb.ObjectID('4d512b45cc9374271b00000f')});
				// Supplierinvoice.remove({_id: temp_id},{justOne: true,});

				console.log("Delete  --------------------------------: ");

		        //Approver.remove({_id: temp_id}, {justOne: true, safe: true}, 
				Cecos.findOneAndRemove({_id: temp_id}, function(err, result) 
		        {
		            if (err) 
		            {
						console.log("Error  --------------------------------: ");
		                console.log(err);
		                // throw err;
		            }
					console.log("Result   --------------------------------: ");
		            console.log(result);
		        });

				console.log("after Delete  --------------------------------: ");

				res.redirect('/Cecos');	
			}
			else
			{
		  		console.log('-----------------------------------------------');
		  		console.log('Suppliers     -   Modificar          ----------');
		  		console.log('-----------------------------------------------');
				console.log('req.body.id: '+req.body.id);
				//		var tmp_id = req.params.id;
				var tmp_id = req.body.id;
				//var tmp_linenumber = req.body.linenumber;

				console.log("tmp_id: "+tmp_id);
				var condition = {"_id": tmp_id}
				console.log("req.body.ceco    : ", req.body.ceco);
				console.log("req.body.accountcode: ", req.body.accountcode);


				// Blanquea todos los subdocumentos para evitar actualizar 1 a 1
				Cecos.update(condition, 
							{ $set: { accounts: []}}, 
							function(err, affected)
				{

					Cecos.find(condition, function (err, doc) 
					{  
						console.log("err...."+err);
						console.log("doc...."+doc);
					    // Handle any possible database errors
					    if (err) 
					    {
					    	console.log("No existe el Registro");
					        res.status(500).send(err);
					    } else 
					    {
					    	if (doc.length > 0) /// existe el doc y lo actualiza
					    	{

								//doc[0].ceco = req.body.ceco;
								//doc[0].ceco = req.body.ceco;

								// ++++++++++++++++++++++++++++
								// 		Agregar Cecos
								var tdetail = [];
								if (Object.prototype.toString.call(req.body.accountcode) === '[object Array]')
								{
									console.log('Cecos - como array:');
									console.log('Cecos - req.body.req.body.xxxx.length:', req.body.accountcode.length);

									for (var i=0; i < req.body.accountcode.length; i++)
									{
						  				console.log('tdetail->post_query.req.body.xxx[i]:',i, req.body.accountcode[i]);
							 			tdetail = 
							  					{	
							  						account: req.body.accountcode[i]
							  					};
							  			doc[0].accounts.push(tdetail);
									}  			
								}
								else
								{
									if (req.body.accountcode)
									{
										console.log('accountcode - plano:',req.body);			
							  			console.log('post_query.ceco:',req.body.accountcode);

							  			tdetail = 
							  					{	
							  						account: req.body.accountcode
							  					};
							  			doc[0].accounts.push(tdetail);
						  			}
								};				


								//++++++++++++++++++++++++++++
								//   Grabar modificaciones
								doc[0].save(function(err, result) 
								{
									console.log( "Grabando:", result, err );
									if(err) {
									    console.log("Error .." + err);
									}
									else
									{
									    console.log("Actualización existosa " + result + "document!");		
								 	}
								}); 
								//  ----------------fin grabar resto del proceso
								//  ----------------------------------------------------
					    	} // if (doc.length > 0)											
					    } //else if (err) 
					}); // User.find(condition, function (err, doc) 
				}); //User.update(condition, 
					//		{ $set: { detail: [], detailtax : [] }}, 
					//		function(err, affected)
				res.redirect('/cecos');	 
			}    

		});


	//  ***********************************************
	//      		Suppliers
	//  ***********************************************


	//  ------------------------------------------------
	//                  get.Suppliers
	//  ------------------------------------------------
		router.get('/suppliers', isAdmin, function(req, res, next) 
		{
			//	Supplierinvoice.find( function(err, supplierinvoice) {
			//		console.log(supplierinvoice);		
			//		res.render('headers', { title: 'Facturas'});

			//        res.locals.typemenu = "TRUE";

			//		res.optionmenu = true;

				res.render('datamaster/suppliers', { title: 'Proveedores'});
			//	});
		});				


	//  ------------------------------------------------
	//            post.suppliers_edit
	//  ------------------------------------------------
		router.post('/suppliers_edit', function(req, res, next) 
		{
			var tmp_id = req.body.post_id;

			console.log('post /suppliers_edit/tmp_id  ---------> ', tmp_id);

			Suppliers.findById(tmp_id, function(err, docs) 
			{
				console.log("post /suppliers_edit/paso 1 en Approver.find");		
				console.log('Docs:', docs);
				console.log('docs.suppliers_edit:', docs.approvalarea);

				var results_mongodb = [];
				results_mongodb.push(docs);
				console.log('results_mongodb:', results_mongodb);
				//console.log('results_mongodb[0].approver_code:', results_mongodb[0].approvalarea);

				res.render(	'datamaster/suppliers_edit', 
							{ title: 'Modificar Proveedores', 
							recdata: docs});

				console.log("post /suppliers_edit/paso 2 en despues del render");		
			});
		});	


	//  -----------------------------------
	//
	//    POST suppliers_edit_post
	//			* Grabar Modificaciones
	//          * Eliminar Documento
	//
	//  -----------------------------------
		router.post('/suppliers_edit_post', function(req, res, next) 

		{

			var action_returned = req.body.returnaction;
			console.log('action_returned....... :'+action_returned);		
			if (action_returned == "Borrar")
			{
				//   -----------------------------------------------------
				//
				//            Borrar Supplier
				//
				//   -----------------------------------------------------
				console.log('Entro por borrar..................');
				console.log("---------------------------------: ");
		 		
				var temp_id = req.body.id;
				console.log("req.body.id : "+req.body.id);		

				console.log("temp_id : "+temp_id);



				// collection.deleteOne({_id: new mongodb.ObjectID('4d512b45cc9374271b00000f')});
				// Supplierinvoice.remove({_id: temp_id},{justOne: true,});

				console.log("Delete  --------------------------------: ");

		        //Approver.remove({_id: temp_id}, {justOne: true, safe: true}, 
				Suppliers.findOneAndRemove({_id: temp_id}, function(err, result) 
		        {
		            if (err) 
		            {
						console.log("Error  --------------------------------: ");
		                console.log(err);
		                // throw err;
		            }
					console.log("Result   --------------------------------: ");
		            console.log(result);
		        });

				console.log("after Delete  --------------------------------: ");

				res.redirect('/suppliers');	
			}
			else
			{
		  		console.log('-----------------------------------------------');
		  		console.log('Suppliers     -   Modificar          ----------');
		  		console.log('-----------------------------------------------');
				console.log('req.body.id: '+req.body.id);
				//		var tmp_id = req.params.id;
				var tmp_id = req.body.id;
				//var tmp_linenumber = req.body.linenumber;

				console.log("tmp_id: "+tmp_id);
				var condition = {"_id": tmp_id}
				console.log("req.body.supplier: ", req.body.codsupplier);
				console.log("req.body.ceco    : ", req.body.ceco);

				// Blanquea todos los subdocumentos para evitar actualizar 1 a 1
				Suppliers.update(condition, 
							{ $set: { cecos: []}}, 
							function(err, affected)
				{

					Suppliers.find(condition, function (err, doc) 
					{  
						console.log("err...."+err);
						console.log("doc...."+doc);
					    // Handle any possible database errors
					    if (err) 
					    {
					    	console.log("No existe el Registro");
					        res.status(500).send(err);
					    } else 
					    {
					    	if (doc.length > 0) /// existe el doc y lo actualiza
					    	{

								//doc[0].ceco = req.body.ceco;
								//doc[0].ceco = req.body.ceco;

								// ++++++++++++++++++++++++++++
								// 		Agregar Cecos
								var tdetail = [];
								if (Object.prototype.toString.call(req.body.ceco) === '[object Array]')
								{
									console.log('Cecos - como array:');
									console.log('Cecos - req.body.req.body.ceco.length:', req.body.ceco.length);

									for (var i=0; i < req.body.ceco.length; i++)
									{
						  				console.log('tdetail->post_query.req.body.ceco[i]:',i, req.body.ceco[i]);
							 			tdetail = 
							  					{	
							  						ceco: req.body.ceco[i]
							  					};
							  			doc[0].cecos.push(tdetail);
									}  			
								}
								else
								{
									if (req.body.ceco)
									{
										console.log('Ceco - plano:',req.body);			
							  			console.log('post_query.ceco:',req.body.ceco);

							  			tdetail = 
							  					{	
							  						ceco: req.body.ceco
							  					};
							  			doc[0].cecos.push(tdetail);
						  			}
								};				


								//++++++++++++++++++++++++++++
								//   Grabar modificaciones
								doc[0].save(function(err, result) 
								{
									console.log( "Grabando:", result, err );
									if(err) {
									    console.log("Error .." + err);
									}
									else
									{
									    console.log("Actualización existosa " + result + "document!");		
								 	}
								}); 
								//  ----------------fin grabar resto del proceso
								//  ----------------------------------------------------
					    	} // if (doc.length > 0)											
					    } //else if (err) 
					}); // User.find(condition, function (err, doc) 
				}); //User.update(condition, 
					//		{ $set: { detail: [], detailtax : [] }}, 
					//		function(err, affected)
				res.redirect('/suppliers');	 
			}    

		});


	//  ***********************************************
	//      		APPROVAL AREAS 
	//  ***********************************************


	//  ------------------------------------------------
	//                  get.Approvalareas 
	//  ------------------------------------------------
		router.get('/approvalareas', isAdmin, function(req, res, next) 
		{
			//	Supplierinvoice.find( function(err, supplierinvoice) {
			//		console.log(supplierinvoice);		
			//		res.render('headers', { title: 'Facturas'});

			//        res.locals.typemenu = "TRUE";

			//		res.optionmenu = true;

				res.render('datamaster/approvalareas', { title: 'Areas Aprobadoras'});
			//	});
		});	

	// -------------------------------------
	//      Get /approval_areas_insert
	// -------------------------------------	
		router.get('/approvalareas_insert', function(req, res, next) 
		{

			var tmp_id = req.params.id;

			console.log("------------------------------: ");

			console.log("/approver_areas_add/get 1: ");		

			res.render('datamaster/approvalareas_create', { title: 'Crear Area Aprobadora'});

			//  	return res.redirect('/process/supplierinvoice_edit');

		});




	// -------------------------------------
	//      post /approver_insert
	// -------------------------------------	
		router.post('/approvalareas_insert', function(req, res, next) 
		{
			var post_data = req.body;
	  		console.log('post_data:',post_data);

			//console.log("Post --> /supplierInvoiceInsert ---> req.body.supplier :", req.body.supplier);
			// console.log("Post --> /supplierInvoiceInsert ---> req.body.tdetail.size :", req.body.detail[0]);
	  		// console.log('post_query.supplier:');
	  		//console.log('post_query.cotcenter.length:',req.body.costcenter.length);

			var arecord = [];

			arecord.push( 
				new Approvalareas(
					{
						approvalarea: req.body.approvalarea,
						description: req.body.description
					}));

			arecord[0].save(function(err, result) 
			{
				console.log( "Grabando:", result, err );
				if(err) {
				    console.log("Error .." + err);
				}
				else
				{
				    console.log("Actualización existosa " + result + "document!");		
			 	}

			});        
			return res.redirect('/approvalareas');

		});

	//  ------------------------------------------------
	//            post.approvalareas_edit
	//  ------------------------------------------------
		router.post('/approvalareas_edit', function(req, res, next) 
		{
			var tmp_id = req.body.post_id;

			console.log('post /approvalareas_edit/tmp_id  ---------> ', tmp_id);

			Approvalareas.findById(tmp_id, function(err, docs) 
			{
				console.log("post /approvalareas_edit/paso 1 en Approver.find");		
				console.log('Docs:', docs);
				console.log('docs.approvalareas_edit:', docs.approvalarea);

				var results_mongodb = [];
				results_mongodb.push(docs);
				console.log('results_mongodb:', results_mongodb);
				console.log('results_mongodb[0].approver_code:', results_mongodb[0].approvalarea);

				res.render(	'datamaster/approvalareas_edit', 
							{ title: 'Modificar Area Aprobadoras', 
							recdata: docs});

				console.log("post /approvalareas_edit/paso 2 en despues del render");		
			});
		});	

	//  -----------------------------------
	//
	//    POST approvalareas_edit_post
	//			* Grabar Modificaciones
	//          * Eliminar Documento
	//
	//  -----------------------------------
		router.post('/approvalareas_edit_post', function(req, res, next) 

		{

			var action_returned = req.body.returnaction;
			console.log('action_returned....... :'+action_returned);		
			if (action_returned == "Borrar")
			{
				//   -----------------------------------------------------
				//
				//            Borrar SupplierInvoice
				//
				//   -----------------------------------------------------
				console.log('Entro por borrar..................');
				console.log("---------------------------------: ");
		 		
				var temp_id = req.body.id;
				console.log("req.body.id : "+req.body.id);		

				console.log("temp_id : "+temp_id);



				// collection.deleteOne({_id: new mongodb.ObjectID('4d512b45cc9374271b00000f')});
				// Supplierinvoice.remove({_id: temp_id},{justOne: true,});

				console.log("Delete  --------------------------------: ");

		        //Approver.remove({_id: temp_id}, {justOne: true, safe: true}, 
				Approvalareas.findOneAndRemove({_id: temp_id}, function(err, result) 
		        {
		            if (err) 
		            {
						console.log("Error  --------------------------------: ");
		                console.log(err);
		                // throw err;
		            }
					console.log("Result   --------------------------------: ");
		            console.log(result);
		        });

				console.log("after Delete  --------------------------------: ");

				res.redirect('/approvalareas');	
			}
			else
			{
		  		console.log('-----------------------------------------------');
		  		console.log('Approval Areas - Modificar           ----------');
		  		console.log('-----------------------------------------------');
				console.log('req.body.id: '+req.body.id);
				//		var tmp_id = req.params.id;
				var tmp_id = req.body.id;
				//var tmp_linenumber = req.body.linenumber;

				console.log("tmp_id: "+tmp_id);
				var condition = {"_id": tmp_id}
				console.log("req.body.approvalarea: ", req.body.approvalarea);
				console.log("req.body.supplier    : ", req.body.supplier);

				// Blanquea todos los subdocumentos para evitar actualizar 1 a 1
				Approvalareas.update(condition, 
							{ $set: { suppliers: []}}, 
							function(err, affected)
				{

					Approvalareas.find(condition, function (err, doc) 
					{  
						console.log("err...."+err);
						console.log("doc...."+doc);
					    // Handle any possible database errors
					    if (err) 
					    {
					    	console.log("No existe el Registro");
					        res.status(500).send(err);
					    } else 
					    {
					    	if (doc.length > 0) /// existe el doc y lo actualiza
					    	{

								doc[0].approvalarea = req.body.approvalarea;
								doc[0].description = req.body.description;

								// ++++++++++++++++++++++++++++
								// 		Agregar Proveedores
								var tdetail = [];
								if (Object.prototype.toString.call(req.body.supplier) === '[object Array]')
								{
									console.log('Supplier - como array:');
									console.log('Supplier - req.body.req.body.supplier.length:', req.body.supplier.length);

									for (var i=0; i < req.body.supplier.length; i++)
									{
						  				console.log('tdetail->post_query.req.body.supplier[i]:',i, req.body.supplier[i]);
							 			tdetail = 
							  					{	
							  						supplier: req.body.supplier[i]
							  					};
							  			doc[0].suppliers.push(tdetail);
									}  			
								}
								else
								{
									if (req.body.supplier)
									{
										console.log('Supplier - plano:',req.body);			
							  			console.log('post_query.supplier:',req.body.supplier);

							  			tdetail = 
							  					{	
							  						supplier: req.body.supplier
							  					};
							  			doc[0].suppliers.push(tdetail);
						  			}
								};				


								//++++++++++++++++++++++++++++
								//   Grabar modificaciones
								doc[0].save(function(err, result) 
								{
									console.log( "Grabando:", result, err );
									if(err) {
									    console.log("Error .." + err);
									}
									else
									{
									    console.log("Actualización existosa " + result + "document!");		
								 	}
								}); 
								//  ----------------fin grabar resto del proceso
								//  ----------------------------------------------------
					    	} // if (doc.length > 0)											
					    } //else if (err) 
					}); // User.find(condition, function (err, doc) 
				}); //User.update(condition, 
					//		{ $set: { detail: [], detailtax : [] }}, 
					//		function(err, affected)
				res.redirect('/approvalareas');	 
			}    

		});




	//  ***********************************************
	//      				APPROVERS 
	//  ***********************************************


	//  ------------------------------------------------
	//                  get.Approver 
	//  ------------------------------------------------

		router.get('/approver', isAdmin, function(req, res, next) 
		{
			//	Supplierinvoice.find( function(err, supplierinvoice) {
			//		console.log(supplierinvoice);		
			//		res.render('headers', { title: 'Facturas'});

			//        res.locals.typemenu = "TRUE";

			//		res.optionmenu = true;

				res.render('datamaster/approvers', { title: 'Aprobadores'});
			//	});
		});	

	// -------------------------------------
	//      Get /approver_insert
	// -------------------------------------	
		router.get('/approver_insert', function(req, res, next) 
		{

			var tmp_id = req.params.id;

			console.log("------------------------------: ");

			console.log("/approver_add/get 1: ");		

			res.render('datamaster/approver_create', { title: 'Crear Aprobador'});

			//  	return res.redirect('/process/supplierinvoice_edit');

		});

	// -------------------------------------
	//      post /approver_insert
	// -------------------------------------	
		router.post('/approver_insert', function(req, res, next) 
		{
			var post_data = req.body;
	  		console.log('post_data:',post_data);

			//console.log("Post --> /supplierInvoiceInsert ---> req.body.supplier :", req.body.supplier);
			// console.log("Post --> /supplierInvoiceInsert ---> req.body.tdetail.size :", req.body.detail[0]);
	  		// console.log('post_query.supplier:');
	  		//console.log('post_query.cotcenter.length:',req.body.costcenter.length);

			var arecord = [];

			arecord.push( 
				new Approver(
					{
						approver_code: req.body.approver_code,
						description: req.body.description
					}));

			arecord[0].save(function(err, result) 
			{
				console.log( "Grabando:", result, err );
				if(err) {
				    console.log("Error .." + err);
				}
				else
				{
				    console.log("Actualización existosa " + result + "document!");		
			 	}

			});        
			return res.redirect('/approver');

		});



	//  ------------------------------------------------
	//            post.approver_detail 
	//  ------------------------------------------------
		router.post('/approver_detail', function(req, res, next) 
		{
			var tmp_id = req.body.post_id;

			console.log('post /approver_detail/tmp_id  ---------> ', tmp_id);

			Approver.findById(tmp_id, function(err, docs) 
			{
				console.log("post /approver_detail/paso 1 en Approver.find");		
				console.log('Docs:', docs);
				console.log('docs.approver_code:', docs.approver_code);

				var results_mongodb = [];
				results_mongodb.push(docs);
				console.log('results_mongodb:', results_mongodb);
				console.log('results_mongodb[0].approver_code:', results_mongodb[0].approver_code);

				res.render(	'datamaster/approver_edit', 
							{ title: 'Modificar Aprobadores', 
							recdata: docs});

				console.log("post /approver_detail/paso 2 en despues del render");		
			});
		});

	//  -----------------------------------
	//
	//    POST approver_edit_post
	//			* Grabar Modificaciones
	//          * Eliminar Documento
	//
	//  -----------------------------------
		router.post('/approver_edit_post', function(req, res, next) 

		{

			var action_returned = req.body.returnaction;
			console.log('action_returned....... :'+action_returned);		
			if (action_returned == "Borrar")
			{
				//   -----------------------------------------------------
				//
				//            Borrar SupplierInvoice
				//
				//   -----------------------------------------------------
				console.log('Entro por borrar..........');
				console.log("---------------------------------: ");
		 		
				var temp_id = req.body.id;
				console.log("get /supplierInvoiceDelete/req.body.id : "+req.body.id);		

				console.log("get /supplierInvoiceDelete/temp_id : "+temp_id);



				// collection.deleteOne({_id: new mongodb.ObjectID('4d512b45cc9374271b00000f')});
				// Supplierinvoice.remove({_id: temp_id},{justOne: true,});

				console.log("Delete  --------------------------------: ");

		        //Approver.remove({_id: temp_id}, {justOne: true, safe: true}, 
				Approver.findOneAndRemove({_id: temp_id}, function(err, result) 
		        {
		            if (err) 
		            {
						console.log("Error  --------------------------------: ");
		                console.log(err);
		                // throw err;
		            }
					console.log("Result   --------------------------------: ");
		            console.log(result);
		        });

				console.log("after Delete  --------------------------------: ");

				res.redirect('/approver');	 

			}
			else
			{
				console.log('Entro por Modificar..........')
				var tmp_id = req.body.id;
				console.log("---------------------------------: ");

				console.log("tmp_id: "+tmp_id);

				console.log('Antes -> findByIdAndUpdate  _id:',tmp_id);			

				Approver.findById(tmp_id, function (err, doc) {  
				    // Handle any possible database errors
				    if (err) {
				        res.status(500).send(err);
				    } else {
				        // Update each attribute with any possible attribute that may have been submitted in the body of the request
				        // If that attribute isn't in the request body, default back to whatever it was before.
				        doc.title = req.body.approver_code || doc.approver_code;
				        doc.description = req.body.description || doc.description;

				        // Save the updated document back to the database
				        doc.save(function (err, todo) {
				            if (err) {
				                res.status(500).send(err)
				            }
				            console.log('doc saved:',doc)
				            //res.send(todo);
				        });
				    }
				});			
				res.redirect('/approver');	 
			}    

		});


	//  ------------------------------------------------
	//            post.approvallevels_detail 
	//  ------------------------------------------------
		router.post('/approvallevels_detail', function(req, res, next) 
		{
			var tmp_id = req.body.post_id;

			console.log('post /approvallevels_detail/tmp_id  ---------> ', tmp_id);

			Approvallevels.findById(tmp_id, function(err, docs) 
			{
				console.log("post /approvallevels_detail/paso 1 en Approvallevels.find");		
				console.log('Docs:', docs);
				console.log('docs.aplevel:', docs.aplevel);

				var results_mongodb = [];
				results_mongodb.push(docs);
				console.log('results_mongodb:', results_mongodb);
				console.log('results_mongodb[0].approver_code:', results_mongodb[0].aplevel);

				res.render(	'datamaster/approvallevels_edit', 
							{ title: 'Modificar Niveles de Aprobación', 
							recdata: docs});

				console.log("post /approvallevel_detail/paso 2 en despues del render");		
			});
		});


	//  -----------------------------------
	//
	//    POST approvallevels_edit_post
	//
	//  -----------------------------------
		router.post('/approvallevels_edit_post', function(req, res, next) 
		{

			var action_returned = req.body.returnaction;
			console.log('action_returned....... :'+action_returned);		
			if (action_returned == "Borrar")
			{
				//   -----------------------------------------------------
				//
				//            Borrar SupplierInvoice
				//
				//   -----------------------------------------------------
				console.log('Entro por borrar..........');
				console.log("---------------------------------: ");
		 		
				var temp_id = req.body.id;
				console.log("get /supplierInvoiceDelete/req.body.id : "+req.body.id);		

				console.log("get /supplierInvoiceDelete/temp_id : "+temp_id);



				// collection.deleteOne({_id: new mongodb.ObjectID('4d512b45cc9374271b00000f')});
				// Supplierinvoice.remove({_id: temp_id},{justOne: true,});

				console.log("Delete  --------------------------------: ");

		        Approvallevels.findOneAndRemove({_id: temp_id},
		        						function(err, result) 
		        {
		            if (err) 
		            {
						console.log("Error  --------------------------------: ");
		                console.log(err);
		                // throw err;
		            }
					console.log("Result   --------------------------------: ");
		            console.log(result);
		        });

				console.log("after Delete  --------------------------------: ");

				res.redirect('/approvallevels');	 

			}
			else
			{
				console.log('Entro por Modificar..........')
				var tmp_id = req.body.id;
				console.log("---------------------------------: ");

				console.log("tmp_id: "+tmp_id);

				console.log('Antes -> findByIdAndUpdate  _id:',tmp_id);			

				Approvallevels.findById(tmp_id, function (err, doc) {  
				    // Handle any possible database errors
				    if (err) {
				        res.status(500).send(err);
				    } else {
				        // Update each attribute with any possible attribute that may have been submitted in the body of the request
				        // If that attribute isn't in the request body, default back to whatever it was before.
				        doc.aplevel = req.body.aplevel || doc.aplevel;
				        doc.currency = req.body.currency || doc.currency;
				        doc.valmin = req.body.valmin || doc.valmin;
				        doc.valmax = req.body.valmax || doc.valmax;

				        // Save the updated document back to the database
				        doc.save(function (err, todo) {
				            if (err) {
				                res.status(500).send(err)
				            }
				            console.log('doc saved:',doc)
				            //res.send(todo);
				        });
				    }
				});			
				res.redirect('/approvallevels');
			}    

		});



	// -------------------------------------
	//      Get /approval_levels_insert
	// -------------------------------------	
		router.get('/approvallevels_insert', function(req, res, next) 
		{

			var tmp_id = req.params.id;

			console.log("------------------------------: ");

			console.log("/approver_add/get 1: ");		

			res.render('datamaster/approvallevels_create', { title: 'Crear Nivel de Aprobación'});

			//  	return res.redirect('/process/supplierinvoice_edit');

		});


	// -------------------------------------
	//      post /approver_insert
	// -------------------------------------	
		router.post('/approvallevels_insert', function(req, res, next) 
		{
			var post_data = req.body;
	  		console.log('post_data:',post_data);

			//console.log("Post --> /supplierInvoiceInsert ---> req.body.supplier :", req.body.supplier);
			// console.log("Post --> /supplierInvoiceInsert ---> req.body.tdetail.size :", req.body.detail[0]);
	  		// console.log('post_query.supplier:');
	  		//console.log('post_query.cotcenter.length:',req.body.costcenter.length);

			var arecord = [];

			arecord.push( 
				new Approvallevels(
					{
						aplevel: req.body.aplevel,
						currency: req.body.currency,
						valmin: req.body.valmin,
						valmax: req.body.valmax
					}));

			arecord[0].save(function(err, result) 
			{
				console.log( "Grabando:", result, err );
				if(err) {
				    console.log("Error .." + err);
				}
				else
				{
				    console.log("Actualización existosa " + result + "document!");		
			 	}

			});        
			return res.redirect('/approvallevels');

		});


// ++++++++++++++++++++++++++++++++++++++++++

//   Approval Scheme

// ++++++++++++++++++++++++++++++++++++++++++



	//  ------------------------------------------------
	//                  get.approvalscheme_by_approvarea
	//  ------------------------------------------------
		router.get('/approvalscheme_by_approvarea', isAdmin, function(req, res, next) 
		{
			//	Supplierinvoice.find( function(err, supplierinvoice) {
			//		console.log(supplierinvoice);		
			//		res.render('headers', { title: 'Facturas'});

			//        res.locals.typemenu = "TRUE";

			//		res.optionmenu = true;

				res.render('datamaster/approvalscheme_by_approvarea', { title: 'xx Approval scheme'});
			//	});
		});				



	// -------------------------------------
	//      Get /approvalscheme_by_approvarea_insert
	// -------------------------------------	
		router.get('/approvalscheme_by_approvarea_insert', function(req, res, next) 
		{

			var tmp_id = req.params.id;

			console.log("------------------------------: ");

			console.log("/approvalschemes_add/get 1: ");		

			res.render('datamaster/approvalscheme_by_approvarea_create', { title: 'Crear Esquemas de Aprobación'});

			//  	return res.redirect('/process/supplierinvoice_edit');

		});



	//  -------------------------------------------------------
	//            post.approvalscheme_by_approvalarea_detail
	//  -------------------------------------------------------
		router.post('/approvalscheme_by_approvalarea_detail', function(req, res, next) 
		{
			var tmp_id = req.body.post_id;

			console.log('post /approvalscheme_detail/tmp_id  ---------> ', tmp_id);

			Approvalscheme.findById(tmp_id, function(err, docs) 
			{
				console.log("post /approvalscheme_detail/paso 1 en find");		
				console.log('Docs:', docs);
				console.log('docs.aplevel:', docs.aplevel);

				var results_mongodb = [];
				results_mongodb.push(docs);
				console.log('results_mongodb:', results_mongodb);
				console.log('results_mongodb[0].approver_code:', results_mongodb[0].aplevel);

				res.render(	'datamaster/approvalscheme_by_approvarea_edit', 
							{ title: 'Modificar Esquemas de Aprobación', 
							recdata: docs});

				console.log("post /approvalscheme_by_approvalarea_detail/paso 2 en despues del render");		
			});
		});


	//  -----------------------------------
	//
	//    POST approvalschemes_edit_post
	//
	//  -----------------------------------
		router.post('/approvalscheme_by_approvalarea_edit_post', function(req, res, next) 					 
		{

			var action_returned = req.body.returnaction;
			console.log('action_returned....... :'+action_returned);		
			if (action_returned == "Borrar")
			{
				//   -----------------------------------------------------
				//
				//            Borrar SupplierInvoice
				//
				//   -----------------------------------------------------
				console.log('Entro por borrar..........');
				console.log("---------------------------------: ");
		 		
				var temp_id = req.body.id;
				console.log("get /supplierInvoiceDelete/req.body.id : "+req.body.id);		

				console.log("get /supplierInvoiceDelete/temp_id : "+temp_id);



				// collection.deleteOne({_id: new mongodb.ObjectID('4d512b45cc9374271b00000f')});
				// Supplierinvoice.remove({_id: temp_id},{justOne: true,});

				console.log("Delete  --------------------------------: ");

		        Approvalscheme.findOneAndRemove({_id: temp_id},
		        						function(err, result) 
		        {
		            if (err) 
		            {
						console.log("Error  --------------------------------: ");
		                console.log(err);
		                // throw err;
		            }
					console.log("Result   --------------------------------: ");
		            console.log(result);
		        });

				console.log("after Delete  --------------------------------: ");


			}
			else
			{
				console.log('Entro por Modificar..........')
				var tmp_id = req.body.id;
				console.log("---------------------------------: ");

				console.log("tmp_id: "+tmp_id);

				console.log('Antes -> findByIdAndUpdate  _id:',tmp_id);			

				Approvalscheme.findById(tmp_id, function (err, doc) {  
				    // Handle any possible database errors
				    if (err) {
				        res.status(500).send(err);
				    } else {
				        // Update each attribute with any possible attribute that may have been submitted in the body of the request
				        // If that attribute isn't in the request body, default back to whatever it was before.
				        doc.approvalarea = req.body.approvalarea || doc.approvalarea;				        
				        doc.aplevel = req.body.aplevel || doc.aplevel;
				        doc.costcenter = req.body.costcenter || doc.costcenter;
				        doc.approver1 = req.body.approver1 || doc.approver1;
				        doc.approver2 = req.body.approver2 || doc.approver2;
				        doc.approver3 = req.body.approver3 || doc.approver3;
				        doc.approver4 = req.body.approver4 || doc.approver4;
				        doc.approver5 = req.body.approver5 || doc.approver5;

				        // Save the updated document back to the database
				        doc.save(function (err, todo) {
				            if (err) {
				                res.status(500).send(err)
				            }
				            console.log('doc saved:',doc)
				            //res.send(todo);
				        });
				    }
				});			
			}    
			res.redirect('/approvalscheme_by_approvarea');

		});


	// -------------------------------------
	//      post /approver_insert
	// -------------------------------------	
		router.post('/approvalscheme_by_approvarea_insert', function(req, res, next) 
		{
			var post_data = req.body;
	  		console.log('post_data:',post_data);

			//console.log("Post --> /supplierInvoiceInsert ---> req.body.supplier :", req.body.supplier);
			// console.log("Post --> /supplierInvoiceInsert ---> req.body.tdetail.size :", req.body.detail[0]);
	  		// console.log('post_query.supplier:');
	  		//console.log('post_query.cotcenter.length:',req.body.costcenter.length);

			var arecord = [];

			arecord.push( 
				new Approvalscheme(
					{
				        aplevel : req.body.aplevel,
				        approvalarea : req.body.approvalarea,
				        costcenter : req.body.costcenter,
				        approver1 : req.body.approver1,
				        approver2 : req.body.approver2,
				        approver3 : req.body.approver3,
				        approver4 : req.body.approver4,
				        approver5 : req.body.approver5						
					}));

			arecord[0].save(function(err, result) 
			{
				console.log( "Grabando:", result, err );
				if(err) {
				    console.log("Error .." + err);
				}
				else
				{
				    console.log("Actualización existosa " + result + "document!");		
			 	}

			});        
			return res.redirect('/approvalscheme_by_approvarea');

		});




	//  ------------------------------------------------
	//            post.approvalscheme_detail 
	//  ------------------------------------------------
		router.post('/approvalscheme_detail', function(req, res, next) 
		{
			var tmp_id = req.body.post_id;

			console.log('post /approvalscheme_detail/tmp_id  ---------> ', tmp_id);

			Approvalscheme.findById(tmp_id, function(err, docs) 
			{
				console.log("post /approvalscheme_detail/paso 1 en find");		
				console.log('Docs:', docs);
				console.log('docs.aplevel:', docs.aplevel);

				var results_mongodb = [];
				results_mongodb.push(docs);
				console.log('results_mongodb:', results_mongodb);
				console.log('results_mongodb[0].approver_code:', results_mongodb[0].aplevel);

				res.render(	'datamaster/approvalscheme_edit', 
							{ title: 'Modificar Esquemas de Aprobación', 
							recdata: docs});

				console.log("post /approvalscheme_detail/paso 2 en despues del render");		
			});
		});



	//  ------------------------------------------------
	//            post.approvalscheme_detail 
	//  ------------------------------------------------
		router.post('/approvalscheme_detail', function(req, res, next) 
		{
			var tmp_id = req.body.post_id;

			console.log('post /approvalscheme_detail/tmp_id  ---------> ', tmp_id);

			Approvalscheme.findById(tmp_id, function(err, docs) 
			{
				console.log("post /approvalscheme_detail/paso 1 en find");		
				console.log('Docs:', docs);
				console.log('docs.aplevel:', docs.aplevel);

				var results_mongodb = [];
				results_mongodb.push(docs);
				console.log('results_mongodb:', results_mongodb);
				console.log('results_mongodb[0].approver_code:', results_mongodb[0].aplevel);

				res.render(	'datamaster/approvalscheme_edit', 
							{ title: 'Modificar Esquemas de Aprobación', 
							recdata: docs});

				console.log("post /approvalscheme_detail/paso 2 en despues del render");		
			});
		});

	//  -----------------------------------
	//
	//    POST approvalschemes_edit_post
	//
	//  -----------------------------------
		router.post('/approvalscheme_edit_post', function(req, res, next) 					 
		{

			var action_returned = req.body.returnaction;
			console.log('action_returned....... :'+action_returned);		
			if (action_returned == "Borrar")
			{
				//   -----------------------------------------------------
				//
				//            Borrar SupplierInvoice
				//
				//   -----------------------------------------------------
				console.log('Entro por borrar..........');
				console.log("---------------------------------: ");
		 		
				var temp_id = req.body.id;
				console.log("get /supplierInvoiceDelete/req.body.id : "+req.body.id);		

				console.log("get /supplierInvoiceDelete/temp_id : "+temp_id);



				// collection.deleteOne({_id: new mongodb.ObjectID('4d512b45cc9374271b00000f')});
				// Supplierinvoice.remove({_id: temp_id},{justOne: true,});

				console.log("Delete  --------------------------------: ");

		        Approvalscheme.findOneAndRemove({_id: temp_id},
		        						function(err, result) 
		        {
		            if (err) 
		            {
						console.log("Error  --------------------------------: ");
		                console.log(err);
		                // throw err;
		            }
					console.log("Result   --------------------------------: ");
		            console.log(result);
		        });

				console.log("after Delete  --------------------------------: ");


			}
			else
			{
				console.log('Entro por Modificar..........')
				var tmp_id = req.body.id;
				console.log("---------------------------------: ");

				console.log("tmp_id: "+tmp_id);

				console.log('Antes -> findByIdAndUpdate  _id:',tmp_id);			

				Approvalscheme.findById(tmp_id, function (err, doc) {  
				    // Handle any possible database errors
				    if (err) {
				        res.status(500).send(err);
				    } else {
				        // Update each attribute with any possible attribute that may have been submitted in the body of the request
				        // If that attribute isn't in the request body, default back to whatever it was before.
				        doc.aplevel = req.body.aplevel || doc.aplevel;
				        doc.costcenter = req.body.costcenter || doc.costcenter;
				        doc.approver1 = req.body.approver1 || doc.approver1;
				        doc.approver2 = req.body.approver2 || doc.approver2;
				        doc.approver3 = req.body.approver3 || doc.approver3;
				        doc.approver4 = req.body.approver4 || doc.approver4;
				        doc.approver5 = req.body.approver5 || doc.approver5;

				        // Save the updated document back to the database
				        doc.save(function (err, todo) {
				            if (err) {
				                res.status(500).send(err)
				            }
				            console.log('doc saved:',doc)
				            //res.send(todo);
				        });
				    }
				});			
			}    
			res.redirect('/approvalscheme');

		});


	// -------------------------------------
	//      Get /approvalschemes_insert
	// -------------------------------------	
		router.get('/approvalscheme_insert', function(req, res, next) 
		{

			var tmp_id = req.params.id;

			console.log("------------------------------: ");

			console.log("/approvalschemes_add/get 1: ");		

			res.render('datamaster/approvalscheme_create', { title: 'Crear Esquemas de Aprobación'});

			//  	return res.redirect('/process/supplierinvoice_edit');

		});


	// -------------------------------------
	//      post /approver_insert
	// -------------------------------------	
		router.post('/approvalscheme_insert', function(req, res, next) 
		{
			var post_data = req.body;
	  		console.log('post_data:',post_data);

			//console.log("Post --> /supplierInvoiceInsert ---> req.body.supplier :", req.body.supplier);
			// console.log("Post --> /supplierInvoiceInsert ---> req.body.tdetail.size :", req.body.detail[0]);
	  		// console.log('post_query.supplier:');
	  		//console.log('post_query.cotcenter.length:',req.body.costcenter.length);

			var arecord = [];

			arecord.push( 
				new Approvalscheme(
					{
				        aplevel : req.body.aplevel,
				        approvalarea : req.body.approvalarea,
				        costcenter : req.body.costcenter,
				        approver1 : req.body.approver1,
				        approver2 : req.body.approver2,
				        approver3 : req.body.approver3,
				        approver4 : req.body.approver4,
				        approver5 : req.body.approver5						
					}));

			arecord[0].save(function(err, result) 
			{
				console.log( "Grabando:", result, err );
				if(err) {
				    console.log("Error .." + err);
				}
				else
				{
				    console.log("Actualización existosa " + result + "document!");		
			 	}

			});        
			return res.redirect('/approvalscheme');

		});





router.post('/form_aprover_saved:id', function(req, res, next) {

	var tmp_id = req.params.id;

	var query = {"_id": tmp_id};
	var operator = {"set" : {"description" : req.body.f_description}}
    var xx = req.body._id;

	console.log("-------------------------------");
	console.log("f_approver: ", xx);

	console.log("Query: ", query._id);
	console.log("-------------------------------");

	Approver.update(query, function(err, updated) {
		if(err) {
		    console.log("Error .." + err);		

		}
		else
		{
		    console.log("Actualización existosa " + updated + "document!");		
	 	}
	});

  return res.redirect('/approver');
});



router.get('/approvallevels', isAdmin, function(req, res, next) {
	Approvallevels.find(function(err, approvallevels) {
		console.log("paso 2 en Approver.find");		

		var approvallevelsChunks = [];
		console.log("paso 4 entre en get.smartfind.Product.find");		
		console.log(approvallevels);		

		for (var i = 0; i < approvallevels.length; i++) {
			approvallevelsChunks.push(approvallevels.slice(i));
		}	
		console.log("paso 5 en Approver.for");		

		res.render('datamaster/approvallevels', { title: 'Niveles de Aprobación', recdata: approvallevels});

		console.log("paso 6 en despues del render");		
});

});



router.get('/approvalscheme', function(req, res, next) {
	Approvalscheme.find( function(err, approvalscheme) {
		console.log("paso 2 en Approver.find");		

		console.log("paso 4 entre en get.smartfind.Product.find");		
		console.log(approvalscheme);		

		console.log("paso 5 en Approver.for");		

		res.render('datamaster/approvalscheme', { title: 'Esquema de Aprobación', recdata: approvalscheme});

		console.log("paso 6 en despues del render");		
	});
});

router.get('/supplierinvoice', function(req, res, next) {
	Supplierinvoice.find( function(err, supplierinvoice) {
//		console.log(supplierinvoice);		
		res.render('process/supplierinvoice', { title: 'Facturas', recdata: supplierinvoice});
	});
});


	// -----------------------------------
	//
	//    POST supplierInvoice_Edit
	//
	// -----------------------------------
	router.post('/supplierinvoice_edit/:id', function(req, res, next) 
	{

		var tmp_id = req.params.id;
		// console.log("req.body.save_form :", req.body.save_form);
		if (req.body.save_form == "SI")
		{
			// console.log("/supplierinvoice_edit/post 1: "+tmp_id);		

		    // console.log("comments:", req.body.comments);
			var query = {"_id": tmp_id};
			var operator = {"supplier": req.body.supplier,
							"fecha" : req.body.fecha,
							"accountcode": req.body.accountcode,
							"costcenter": req.body.costcenter,
							"servicesmonth": req.body.servicesmonth,
							"amountinvoice": req.body.amountinvoice,
							"currency": req.body.currency,
							"comments": req.body.comments
							}
		    var xx = req.body.fecha;

			console.log("-------------------------------");
			console.log("field_to_update: ", xx);
			console.log("operator: ", operator);

			console.log("Query: ", query._id);
			console.log("-------------------------------");

			Supplierinvoice.update(query, operator, function(err, updated) {
				if(err) {
				    console.log("Error .." + err);
				}
				else
				{
				    console.log("Actualización existosa " + updated + "document!");		
			 	}
			});
		}
		else
		{
			console.log("No Grabar");
		}

  	return res.redirect('/supplierinvoice');

});



	// -----------------------------------
	//
	//    POST supplierInvoice_save
	//
	// -----------------------------------
	router.post('/supplierinvoice_save/:id', function(req, res, next) 
	{



		var tmp_id = req.params.id;
		console.log("router.post('/supplierinvoice_save -------------------------");
		console.log("req.body.save_form :", req.body.save_form);
		if (req.body.save_form == "SI")
		{
			console.log("/supplierinvoice_edit/post 1: "+tmp_id);		

		    console.log("comments:", req.body.comments);
			var query = {"_id": tmp_id};
			var operator = {"supplier": req.body.supplier,
							"fecha" : req.body.fecha,
							"accountcode": req.body.accountcode,
							"costcenter": req.body.costcenter,
							"servicesmonth": req.body.servicesmonth,
							"amountinvoice": req.body.amountinvoice,
							"currency": req.body.currency,
							"comments": req.body.comments
							}
		    var xx = req.body.fecha;

			console.log("-------------------------------");
			console.log("field_to_update: ", xx);
			console.log("operator: ", operator);

			console.log("Query: ", query._id);
			console.log("-------------------------------");

			Supplierinvoice.update(query, operator, function(err, updated) {
				if(err) {
				    console.log("Error .." + err);
				}
				else
				{
				    console.log("Actualización existosa " + updated + "document!");		
			 	}
			});
		}
		else
		{
			console.log("No Grabar");
		}

  	return res.redirect('/supplierinvoice');

});



router.post('/supplierinvoice_edit/:id', function(req, res, next) {

	var tmp_id = req.params.id;

	console.log("/supplierinvoice_edit/post 1: "+tmp_id);		

//    console.log("comments:", req.body.comments);
	var query = {"_id": tmp_id};
	var operator = {"supplier": req.body.supplier,
					"fecha" : req.body.fecha,
					"accountcode": req.body.accountcode,
					"costcenter": req.body.costcenter,
					"servicesmonth": req.body.servicesmonth,
					"amountinvoice": req.body.amountinvoice,
					"currency": req.body.currency,
					"comments": req.body.comments
					}
    var xx = req.body.fecha;

	//console.log("-------------------------------");
	//  console.log("field_to_update: ", xx);
	// console.log("operator: ", operator);

	// console.log("Query: ", query._id);
	// console.log("-------------------------------");

	Supplierinvoice.update(query, operator, function(err, updated) {
		if(err) {
		    console.log("Error .." + err);
		}
		else
		{
		    console.log("Actualización existosa " + updated + "document!");		
	 	}
	});

  	return res.redirect('/supplierinvoice');

});




router.get('/showcart', function(req, res, next) {
//	if (!req.session.cart) {
//		return res.render('shop/shopcart', {shopcart: null});
//	}
//	var cart = new Cart(req.session.cart);
//	res.render('shop/shopcart', {shopcart: cart.generateArray(), totalPrice: cart.totalPrice});

//	var cart = new Cart(req.session.cart ? req.session.cart : {items: {}});

	var cart = new Cart(req.session.cart ? req.session.cart : null);
//	var cart = new Cart(req.session.cart);
 //	req.session.cart = cart;
//	console.log(req.session.cart);
//	console.log("----------------------");
//	for (key in req.session.cart.items) {
//			console.log(req.session.cart.items[key].item.title);				
//	}
    res.render('shop/shopcart', { title: 'Shopping Cart', shopcart: req.session.cart});

});

router.post('/smartfind', function(req, res, next) {

	console.log("paso 1 entre en post.smartfind");
//	var txtNombre = document.getElementById('inputFindText').value;	
	console.log(req.body.inputFindText);

	var findText =  req.body.inputFindText || '';

	var cart = new Cart(req.session.cart ? req.session.cart : {items: {}});

	req.session.cart = cart;
	console.log("paso 2 entre en post.smartfind");

	Product.find({$or:[{description: {$regex:findText, $options: 'i'}}, {title: {$regex:findText, $options: 'i'}}]}, function(err, product) {
		console.log("paso 3 entre en post.smartfind.Product.find");		

		var productChunks = [];
		var chunkSize = 3;
	
		console.log("paso 4 entre en post.smartfind.Product.find");		
		console.log(product);		

		console.log("paso 5 entre en post.smartfind.Product.find");		

		for (var i = 0; i < product.length; i += chunkSize) {
			productChunks.push(product.slice(i, i + chunkSize));
		}	
		res.render('shop/index', { title: 'Shopping Cart', products: productChunks, shopcart: req.session.cart});
	});
});


router.get('/delete-from-cart/:id', function(req,res){ 

    var id = req.params.id;
    console.log("ID: ", id);

    Product.remove({id:id}, function(err, result) { //undefined??
        if (err) return res.status(500).send({err: 'Error: Could not delete Product'});
        if(!result) return res.status(400).send({err: 'Product bot deleted from firebase database'});
        console.log('deleted!!!');
        res.send(result); 
    });
});




//	Product.remove({ id: productId }, function (err) {
//	  if (err) {
//	  		// removed
//	  		console.log("Registro:", productId);
//	  }
//	});

//	Product.find({ "id": productId }).remove().exec();
//     Product.deleteOne(
//      { "itemcode": productId },
//      function(err, results) {
//         console.log(results);
//         callback();
//      });
//	res.render('/', { title: 'Shopping Cart', shopcart: req.session.cart});
//});



router.get('/cleancart', function(req, res, next) 
{
		var cart = new Cart({items: {}});
		req.session.cart  = cart;	
		res.render('shop/shopcart', { title: 'Shopping Cart', shopcart: req.session.cart});

	});



	// ----------------------------------------------------
	//              loadCecos
	// ----------------------------------------------------
	function loadCecos(cecos_array)
	{

	    Cecos.find(function(err, docs) {

			// console.log("--------------------------------------");		
			// console.log("loadCecos  - despues de find");		

			// console.log("Err:",err);		

			// console.log("Console-docs --------------------------------------");		
			//	console.log(docs);

			results_cecos_mongodb = []
			results_cecos_mongodb.push(docs);

			//	console.log(results_from_mongodb);
		    var docChunks = [];
			var chunkSize = 1;
			//		for (var i = 0; i < docs.length; i += chunkSize) {
			//			docChunks.push(docs.slice(i, i + chunkSize));
			//		}			

			global.cecos_array = results_cecos_mongodb;
			// console.log("/Cecos/paso 2 en .find");		
			// console.log(cecos_array);		

			//		req.body.form_aprover = approver.aprover;

			// console.log("Callback - loadCecos saliendo");		
		});


	};



	// ************************************
	//
	//    GET   supplierInvoiceEdit
	//
	// ************************************

	router.get('/supplierInvoiceEdit/:id', function(req, res)  
	{


		// console.log('/supplierinvoice_edit/req.params.id  ---------> ', req.params.id);
		var temp_id = req.params.id;



		// console.log('/supplierinvoice_edit/tmp_id  ---------> ', temp_id);

    	Supplierinvoice.findById(temp_id, function(err, docs) 
    	{

//			console.log("/supplierinvoice_edit/Supplierinvoice.findById 1");

//			console.log("Err:"+err);		


//			console.log('Invoice docs------------------');
//			console.log(docs);

			results_supplier_mongodb = []
			results_supplier_mongodb.push(docs);

			// console.log('mongo result------------------');
			// console.log(results_supplier_mongodb);

//			global.supplier_array = results_supplier_mongodb;


//			doc1.push(docs);

//			console.log('req.session.invoice antes de enviar ------------------');


			res.render('process/supplierinvoice_edit', { title: 'Facturas',
											recdata: results_supplier_mongodb});

//			console.log("/supplierinvoice_edit/Supplierinvoice.findById 3");
		});
	});


	// ************************************
	//
	//    GET   supplierInvoiceEdit
	//
	// ************************************

	router.get('/tcecos', function(req, res)  
	{

		res.render('datamaster/AllCecos', { title: 'Centro de Costos'});
	});




   


// RestFul API

//ROUTE SEARCH ============================================
router.get('/api/restGetAllSupplier', function(req, res)
{
	// console.log('/api/restGetAllSupplier ---------------');

   	Suppliers.find({},{codsupplier: 1, name:1, country:1}, function(err, alldata)
	{
		if (err)
		{
			res.send(err);
		}
				
		// Return all data
		// console.log('alldata.size:',alldata.length);
		var totrec = alldata.length;
		// console.log('totrec :',totrec);
	    var output = { "iTotalRecords" : totrec, "iTotalDisplayRecords" : 10 };
	    output["data"] = alldata;
		// console.log('output :',output);

		res.json(output);	});
});


router.get('/api/restGetAllSupplier_by_approval_area', function(req, res)
{
	// console.log('/api/restGetAllSupplier ---------------');
	console.log('--------------------------------------------------------');
	console.log('get -> /api/restGetAllSupplier_by_approval_area --------');

	var t_aa = req.query.approvalarea.split(":")[0];
	console.log('req.query.approvalarea  ....... :'+t_aa);	

   	Approvalareas.find({approvalarea : t_aa},{approvalarea: 1, suppliers: 1}, function(err, alldata)
	 
   	//Approvalareas.find({"approvalarea": "IT"},{approvalarea: 1, suppliers: 1}, function(err, alldata)
   	//Suppliers.find({},{codsupplier: 1, name:1, country:1}, function(err, alldata)
	{

		console.log('err:',err);

		if (err)
		{
			res.send(err);
		}
				
		// Return all data

		//costcenter : docs.detail[j].costcenter.split(":")[0],
	
		console.log('alldata:',alldata);
		console.log("alldata.suppliers:",alldata.suppliers);			
		//console.log("output:",output);

		for(var key in alldata[0].suppliers) {
		    console.log('key: ' + key + '\n' + 'value: ' + alldata[0].suppliers[key]);
		    console.log('key: ' + key + '\n' + 'value: ' + alldata[0].suppliers[key].supplier);		    
		}		
			
		console.log('alldata.size:',alldata.length);
		var totrec = alldata.length;
		// console.log('totrec :',totrec);
	    var output = { "iTotalRecords" : totrec, "iTotalDisplayRecords" : 10 };
	    output["data"] = alldata;
		// console.log('output :',output);

		res.json(alldata);	
	});
	console.log('--------------------------------------------------------');   	
});



//router.get('/api/restGetCecos', function(req, res)
//{
//   	Cecos.find({}, function(err, alldata)
//	{
//		if (err)
//		{
//			res.send(err);
//		}
				
		// Return all clients
//		res.json(alldata);
//	});
//});


//router.post('/api/restPostCecos', function(req, res)
//{
//	console.log('/api/restPostCecos');
//   	Cecos.find({}, {_id:1, ceco:1, description:1, company:1}, function(err, alldata)
//	{
//		if (err)
//		{
//			res.send(err);
//		}
				
		// Return all clients
//		res.json(alldata);
//	});
//});


router.get('/api/restPostUsersField', function(req, res)
{
	// console.log('get -> /api/restPostUsersField --------');
   	User.find({}, {_id:1, email:1, name:1}, function(err, alldata)
	{
		if (err)
		{
			res.send(err);
		}
				
		// Return all clients

		// console.log('alldata.size:',alldata.length);
		var totrec = alldata.length;
		// console.log('totrec :',totrec);
	    var output = { "iTotalRecords" : totrec, "iTotalDisplayRecords" : 10 };
	    output["data"] = alldata;

		res.json(output);
	});
});


router.get('/api/restPostApprovalareaField', function(req, res)
{
	// console.log('get -> /api/restPostApprovalareaField --------');


   	Approvalareas.find({}, {_id:0, approvalarea:1, description:1}, function(err, alldata)
	{
		if (err)
		{
			res.send(err);
		}
				
		// Return all clients

		// console.log('alldata.size:',alldata.length);
		var totrec = alldata.length;
		// console.log('totrec :',totrec);
	    var output = { "iTotalRecords" : totrec, "iTotalDisplayRecords" : 10 };
	    output["data"] = alldata;



		res.json(output);
	});
});

router.get('/api/restPostCecosField', function(req, res)
{
	// console.log('get -> /api/restPostCecosField --------');
   	Cecos.find({}, {_id:0, ceco:1, description:1}, function(err, alldata)
	{
		if (err)
		{
			res.send(err);
		}
				
		// Return all clients

		// console.log('alldata.size:',alldata.length);
		var totrec = alldata.length;
		// console.log('totrec :',totrec);
	    var output = { "iTotalRecords" : totrec, "iTotalDisplayRecords" : 10 };
	    output["data"] = alldata;

//var obj = JSON.parse(str);
//		var output = Array;
//		output.push({});
//		output.push({});		
//		output.data.push(alldata);

		


//https://datatables.net/forums/discussion/32031/pagination-with-server-side-processing

//https://datatables.net/examples/server_side/post.html


//https://datatables.net/forums/discussion/32031/pagination-with-server-side-processing#Comment_86438


//https://datatables.net/forums/discussion/13679/working-code-for-server-side-paging-filtering-sorting-for-python-flask-mongodb

//https://datatables.net/forums/discussion/34861/jquery-datatables-min-js-39-uncaught-typeerror-cannot-read-property-length-of-undefined

//https://datatables.net/reference/option/ajax.data



//http://www.civc.edu.vn/libs/DataTables-1.9.4/examples/data_sources/server_side.html


		res.json(output);
	});
});




//  -----------------------------------
// 		       Api UserAccounts
//  -----------------------------------
router.get('/api/restUserAccount', function(req, res)
{
	console.log('/api/restUserAccount--------------');
	console.log('user_id', req.session.passport.user);
	User.findById(req.session.passport.user, {email:1, accounts:1}, function(err, docs) 
	{
		if (err)
		{
			res.send(err);
		}
		console.log('docuser_accounts', docs.accounts);				
		// console.log('alldata.size:',alldata.length);
		var totrec = docs.accounts.length;
		// console.log('totrec :',totrec);
	    var output = { "iTotalRecords" : totrec, "iTotalDisplayRecords" : 10 };
	    output["data"] = docs.accounts;
		res.json(output);

	});
});

//  -----------------------------------
// 		       Api restUserAA
//  -----------------------------------
router.get('/api/restUserAA', function(req, res)
{
	console.log('/api/restUserAA--------------');
	console.log('user_id', req.session.passport.user);
	User.findById(req.session.passport.user, {email:1, approvalareas:1}, function(err, docs) 
	{
		if (err)
		{
			res.send(err);
		}
		console.log('docuser_aa', docs.approvalareas);				
		// console.log('alldata.size:',alldata.length);
		var totrec = docs.approvalareas.length;
		console.log('totrec :',totrec);
	    var output = { "iTotalRecords" : totrec, "iTotalDisplayRecords" : 10 };
	    output["data"] = docs.approvalareas;
		res.json(output);

	});
});


//  -----------------------------------
// 		       Api restUserCecos
//  -----------------------------------
router.get('/api/restUserCecos', function(req, res)
{
	console.log('/api/restUserCecos--------------');
	console.log('user_id', req.session.passport.user);
	User.findById(req.session.passport.user, {email:1, cecos:1}, function(err, docs) 
	{
		if (err)
		{
			res.send(err);
		}
		console.log('docuser_cecos', docs.cecos);				
		// console.log('alldata.size:',alldata.length);
		var totrec = docs.cecos.length;
		// console.log('totrec :',totrec);
	    var output = { "iTotalRecords" : totrec, "iTotalDisplayRecords" : 10 };
	    output["data"] = docs.cecos;
		res.json(output);

	});
});


//  -----------------------------------
// 		       Api UserFiorders
//  -----------------------------------
router.get('/api/restUserFiorders', function(req, res)
{
	console.log('/api/restUserFiorders--------------');
	console.log('user_id', req.session.passport.user);
	User.findById(req.session.passport.user, {email:1, fi_orders:1}, function(err, docs) 
	{
		if (err)
		{
			res.send(err);
		}
		console.log('docuser_fi_orders', docs.fi_orders);				
		// console.log('alldata.size:',alldata.length);
		var totrec = docs.fi_orders.length;
		// console.log('totrec :',totrec);
	    var output = { "iTotalRecords" : totrec, "iTotalDisplayRecords" : 10 };
	    output["data"] = docs.fi_orders;
		res.json(output);

	});
});



//  -----------------------------------
// 		       Api Accounts
//  -----------------------------------
router.get('/api/restPostAccountField', function(req, res)
{
	// console.log('/api/restPostAccountField--------------');
   	Accounts.find({}, {_id:0, account:1, description:1}, function(err, alldata)
	{
		if (err)
		{
			res.send(err);
		}
				
		// console.log('alldata.size:',alldata.length);
		var totrec = alldata.length;
		// console.log('totrec :',totrec);
	    var output = { "iTotalRecords" : totrec, "iTotalDisplayRecords" : 10 };
	    output["data"] = alldata;
		res.json(output);

	});
});


//  -----------------------------------
// 		       Api ApprovalAreas
//  -----------------------------------
router.get('/api/restPostApprovalAreasField', function(req, res)
{
	// console.log('/api/restPostApprovalAreasField--------------');
   	Approvalareas.find({}, {_id:0, approvalarea:1, description:1}, function(err, alldata)
	{
		if (err)
		{
			res.send(err);
		}
				
		// console.log('alldata.size:',alldata.length);
		var totrec = alldata.length;
		// console.log('totrec :',totrec);
	    var output = { "iTotalRecords" : totrec, "iTotalDisplayRecords" : 10 };
	    output["data"] = alldata;
		res.json(output);

	});
});


//  -----------------------------------
// 		       Api Fi Orders
//  -----------------------------------
router.get('/api/restPostFiordersField', function(req, res)
{
	console.log('/api/restPostFiordersField--------------');
   	Fiorders.find({}, {_id:0, order:1, description:1}, function(err, alldata)
	{
		if (err)
		{
			res.send(err);
		}
				
		// console.log('alldata.size:',alldata.length);
		var totrec = alldata.length;
		// console.log('totrec :',totrec);
	    var output = { "iTotalRecords" : totrec, "iTotalDisplayRecords" : 10 };
	    output["data"] = alldata;
		res.json(output);

	});
});

//  -----------------------------------
// 		       Api Service Month
//  -----------------------------------
router.get('/api/restPostServiceMonth', function(req, res)
{
	// console.log('/api/restPostServiceMonth--------------');
   	ServiceMonth.find({}, {_id:0, servicemonth:1}, function(err, alldata)
	{
		if (err)
		{
			res.send(err);
		}
				
		// console.log('alldata.size:',alldata.length);
		var totrec = alldata.length;
		// console.log('totrec :',totrec);
	    var output = { "iTotalRecords" : totrec, "iTotalDisplayRecords" : 10 };
	    output["data"] = alldata;
		res.json(output);

	});

});


router.get('/api/restGetOneSupplierInvoice/:id', function(req, res)
{
	var temp_id = req.params.id;
   	Supplierinvoice.findById(temp_id, function(err, docs) 
	{
		if (err)
		{
			res.send(docs);
		}
				
		// Return all clients
		res.json(docs);
	});
});


router.get('/api/restGetSupplierbyCodSupplier/:id', function(req, res)
{

//	var temp_id =  '{codsupplier : ' + req.params.id + '}';
	var temp_id =  req.params.id.trim() ;

	// console.log("temp_id :",temp_id)


//   	Suppliers.find(temp_id, function(err, docs) 
   	Suppliers.find({codsupplier :temp_id}, function(err, docs) 
	{
		if (err)
		{
			res.send(docs);
		}
				
		// Return all clients
//		console.log(docs);
		res.json(docs);
	});
});


router.get('/api/restGetSupplierbyName/:id', function(req, res)
{

//	var temp_id =  '{codsupplier : ' + req.params.id + '}';
	var findText = "/"+req.params.id.trim()+"/";

	// console.log("findText :",findText);

   	Suppliers.find( {$or:[{codsupplier: {$regex:findText}}, 
   		                  {name:        {$regex:findText}}
   		                 ]}, function(err, docs) 
	{
		if (err)
		{
			res.send(docs);
		}
				
		// Return all clients
//		console.log(docs);
		res.json(docs);
	});
});

// Conceptos

router.get('/api/restGetConcepts', function(req, res)
{

   	Concepts.find( { concept: { $exists: true } }, function(err, alldata) 
	{
		if (err)
		{
			console.log("Errors------------------");
			console.log(alldata);

			res.send(alldata);
		}
		else

		// Return all clients
		console.log("concepts------------------");
		// console.log(alldata[0].codsupplier);
		// console.log(alldata[0].concepts[0]);
		var totrec = alldata ? alldata.length:0;
		//console.log('totrec :',totrec);
	    var output = { "iTotalRecords" : totrec, "iTotalDisplayRecords" : 10 };
	    output["data"] = alldata ? alldata: 0;
		// console.log('totrec :',totrec);
		// console.log('output :',output);

		res.json(output);
	});


});


router.get('/api/restGetSupplierConcepts', function(req, res)
//router.get('/api/restGetSupplierConcepts', function(req, res)
{


//	console.log('cs: ',req.query.codsupplier);

	var findText = req.query.codsupplier;
    if (req.query.codsupplier)
    {
	   findText = req.query.codsupplier.split(":")[0];
    }
	else
	{
//	    var output = { "iTotalRecords" : 0, "iTotalDisplayRecords" : 10 };
//		res.json(output)
	   findText = '24';
	}



//    var findText = "";
	// console.log("/api/restGetSupplierConcepts/------------------");
	// console.log("------------------");
	// console.log("findText :",findText);
//	console.log("#supplier :",$("#supplier").val());

	// console.log("------------------");


   	Suppliers.find( {codsupplier: findText},{codsupplier:1,concepts:1}, function(err, alldata) 
//   	Suppliers.find( {codsupplier: findText}, function(err, docs) 

	{
		if (err)
		{
			console.log("Errors------------------");
			console.log(alldata);

			res.send(alldata);
		}
		else

		// Return all clients
		console.log("concepts------------------");
		// console.log(alldata[0].codsupplier);
		// console.log(alldata[0].concepts[0]);
		var totrec = alldata[0] ? alldata[0].concepts.length:0;
		// console.log('totrec :',totrec);
	    var output = { "iTotalRecords" : totrec, "iTotalDisplayRecords" : 10 };
	    output["data"] = alldata[0] ? alldata[0].concepts: 0;
		// console.log('totrec :',totrec);
		// console.log('output :',output);

		res.json(output);
	});


});



router.get('/api/OLDrestGetAprovallevels', function(req, res)
{
   	Approvallevels.find({}, function(err, alldata)
	{
		if (err)
		{
			res.send(err);
		}
				
		// Return all clients
		res.json(alldata);
	});
});




router.get('/api/restInsertUserSupplier/:id', function(req, res)
{

	var temp_id = req.params.id;
	 var marray = temp_id.split("&")

	// console.log("----------------------------");	

	// console.log("email:",marray[0]);
	// console.log("codsupplier:",marray[1]);
	// console.log("namesupplier:",marray[2]);
	// console.log("----------------------------");	




//db.users.update({ email: "1@1.com" }, {$set:{ supplier: [{ codsupplier: "NUEVO01", name: "NOMBRENUEVO01"} ]}})

//db.users.update({ email: "1@1.com" }, {$addToSet:{ supplier: { codsupplier: "NUEVO05", name: "NOMBRENUEVO05"} }})

 	User.update({ email: marray[0] }, 
 				{$push:{ supplier: { codsupplier: marray[1], namesupplier: marray[2]} }}, function(err, docs) 
	{
		if (err)
		{
			res.send(docs);
			console.log('Error en grabación:', err);
		}
				
		// Return all clients
		res.json(docs);
		console.log('Grabó bien');

	});



});

// ---------------------------------------------------------------------------------------- //
// ---------------------------------------------------------------------------------------- //
//
//                                     SupplierInvoice
//
// ---------------------------------------------------------------------------------------- //
// ---------------------------------------------------------------------------------------- //




	// -------------------------------------
	//      Post /supplierinvoice_view
	// -------------------------------------	
		router.post('/supplierinvoice_view', function(req, res, next) 
		{

		var temp_id = req.body.post_id;

		//		tmp_id = temp_id.split(":")[0];
		console.log("---------------------------------: ");

		// aquiestoy
		console.log("post /supplierinvoice_view/post_id : "+temp_id);
		//console.log("post /supplierinvoice_view -req.user.username : "+req.user.username);
		console.log("post /supplierinvoice_view - req.session: "+req.session);
		console.log("post /supplierinvoice_view - req.session.passport.user: "+req.session.passport);


	   	Supplierinvoice.findById(temp_id, function(err, docs) 
		{
			if (err)
			{
			       console.log("Error docs : "+docs);
			}
					
			var results_mongodb = [];

			results_mongodb.push(docs);


			console.log("---------------------------------: ");

			console.log("docs : "+docs);
			console.log("---------------------------------: ");

			console.log("results_mongodb : "+results_mongodb);

			res.render('process/supplierinvoice_detail_edit', { title: 'Modificar Factura', 
																recdata: results_mongodb, 
																xsup: results_mongodb.supplier});

			//  	return res.redirect('/process/supplierinvoice_edit');

		});


	});




// -----------------------------------
//
//    POST supplierinvoicePostEdit
//			* Grabar Modificaciones
//          * Eliminar Documento
//
// -----------------------------------
router.post('/supplierInvoicePostEdit', function(req, res, next) 

{
	var action_returned = req.body.returnaction;
	console.log('action_returned....... :'+action_returned);		
	if (action_returned == "Borrar")
	{
		//   -----------------------------------------------------
		//
		//            Borrar SupplierInvoice
		//
		//   -----------------------------------------------------
		console.log('Entro por borrar..........');
		console.log("---------------------------------: ");
 		
		var temp_id = req.body.id;
		console.log("get /supplierInvoiceDelete/req.body.id : "+req.body.id);		

		console.log("get /supplierInvoiceDelete/temp_id : "+temp_id);



		// collection.deleteOne({_id: new mongodb.ObjectID('4d512b45cc9374271b00000f')});
		// Supplierinvoice.remove({_id: temp_id},{justOne: true,});

		console.log("Delete  --------------------------------: ");

		Supplierinvoice.findOneAndRemove({_id: temp_id}, function (err, result)

        //Supplierinvoice.remove({_id: temp_id}, {justOne: true, safe: true}, 
        //						function(err, result) 
        {
            if (err) 
            {
				console.log("Error  --------------------------------: ");
                console.log(err);
                // throw err;
            }
            if (result) 
            {
				console.log("Result   --------------------------------: ");
	            console.log(result);
        	}
        });

		console.log("after Delete  --------------------------------: ");


	}
	else
	{

  		console.log('-----------------------------------------------');
  		console.log('supplierInvoicePostEdit - Modificar  ----------');
  		console.log('-----------------------------------------------');


  		//req.body.aplevel = "XXTEXTFIJO";
  		req.body.linenumber = 1;

		console.log('req.body.approvalarea  ....... :'+req.body.approvalarea);
		console.log('req.body.costcenterice ....... :'+req.body.costcenter);	
		console.log('req.body.currency .... ....... :'+req.body.currency);
		console.log('req.body.amountinvoice ....... :'+req.body.amountinvoice);
		console.log('req.body.aplevel.............. :'+req.body.aplevel);
		console.log('req.body.approver1............ :'+req.body.approver1);
		console.log('req.body.approver2............ :'+req.body.approver2);
		console.log('req.body.approver3............ :'+req.body.approver3);		
		console.log('req.body.approver4............ :'+req.body.approver4);
		console.log('req.body.approver5............ :'+req.body.approver5);
  		console.log('req.body.inputimage........... : '+ req.body.inputimage);
 		console.log('req.body.imagenbit............ : '+ req.body.imagenbit);

 		var t_release1 = ((req.body.approver1.length > 0) ? "N" : "#");
 		var t_release2 = ((req.body.approver2.length > 0) ? "N" : "#");
 		var t_release3 = ((req.body.approver3.length > 0) ? "N" : "#");
 		var t_release4 = ((req.body.approver4.length > 0) ? "N" : "#");
 		var t_release5 = ((req.body.approver5.length > 0) ? "N" : "#");



		var t_aplevel = "";
		var t_approver1 = "";
		var t_approver2 = "";
		var t_approver3 = "";
		var t_approver4 = "";
		var t_approver5 = "";


		//  ----------------------------------------------------
		//  ---------------- inicio grabar resto del proceso


			//		var tmp_id = req.params.id;
			var tmp_id = req.body.id;
			var tmp_linenumber = req.body.linenumber;

			console.log("tmp_id: "+tmp_id);
			var condition = {"_id": tmp_id}


			// Blanquea todos los subdocumentos para evitar actualizar 1 a 1
			Supplierinvoice.update(condition, 
									{ $set: { detail: [], detailtax : [] }}, 
									function(err, affected)
			{

				Supplierinvoice.find(condition, function (err, doc) 
				{  
					console.log("err...."+err);
					console.log("doc...."+doc);
				    // Handle any possible database errors
				    if (err) 
				    {
				    	console.log("No existe el Registro");
				        res.status(500).send(err);
				    } else 
				    {
				    	if (doc.length > 0) /// existe el doc y lo actualiza
				    	{

							doc[0].supplier = req.body.supplier;
							doc[0].approvalarea = req.body.approvalarea
							doc[0].company = req.body.company;
							doc[0].accountingdate = req.body.accountingdate;
							doc[0].documentdate = req.body.documentdate;
							doc[0].documenttype = req.body.tpdoc;
							doc[0].documentnumber = req.body.numdoc;
							doc[0].currency = req.body.currency;
							doc[0].netamountinvoice = req.body.amountinvoice;
							doc[0].totaltax = req.body.totaltax;
							doc[0].totalinvoice = req.body.totalinvoice;
							doc[0].aplevel = req.body.aplevel;
							doc[0].approver1 = req.body.approver1;
							doc[0].release1 = t_release1;
							doc[0].approver2 = req.body.approver2;	
							doc[0].release2 = t_release2;
							doc[0].approver3 = req.body.approver3;
							doc[0].release3 = t_release3;
							doc[0].approver4 = req.body.approver4;
							doc[0].release4 = t_release4;
							doc[0].approver5 = req.body.approver5;
							doc[0].release5 = t_release5;
							doc[0].exchangerate = req.body.exchangerate;
							doc[0].approver_total = "N";
/*							
							if (req.body.inputimage.length > 0)
							{
								//doc[0].imgfact.data = fs.readFileSync(req.body.inputimage);
								doc[0].imgfact.data = req.body.imagenbit
								doc[0].img.contentType = 'image/png';
							}
*/							
							var adetail = [];
							// ++++++++++++++++++++++
							// 		Agregar detalle
							if (Object.prototype.toString.call(req.body.costcenter) === '[object Array]')
							{
					  			console.log('post_query.cotcenter[0]:',req.body.costcenter[0]);
					  			console.log('post_query.cotcenter[1]:',req.body.costcenter[1]);
							}
							else
							{
					  			console.log('post_query.cotcenter:',req.body.costcenter);
					  			console.log('post_query.accountcode:',req.body.accountcode);

					  			adetail = {	
					  						linenumber: req.body.linenumber,
					  						costcenter: req.body.costcenter,
					  						accountcode: req.body.accountcode,
					  						order: req.body.order,
					  						concept: req.body.concept,
					  						servicemonth: req.body.servicemonth,
					  						description: req.body.description
					  						};
					  			doc[0].detail.push(adetail);
							};

							// ++++++++++++++++++++++
							// 		Agregar taxes
							var tdetail = [];
							if (Object.prototype.toString.call(req.body.taxcode) === '[object Array]')
							{
								console.log('Taxes - como array:');
								console.log('Taxes - req.body.taxcode.length:', req.body.taxcode.length);

								for (var i=0; i < req.body.taxcode.length; i++)
								{
					  				console.log('post_query.taxcode[i]:',req.body.taxcode[i]);
						 			tdetail = 
						  					{	
						  						taxcode: req.body.taxcode[i],
						  						taxamount: req.body.taxamount[i]
						  					};
						  			doc[0].detailtax.push(tdetail);			    
								}  			
							}
							else
							{
								console.log('Taxes - plano:');			
					  			console.log('post_query.taxcode:',req.body.taxcode);
					  			console.log('post_query.taxamount:',req.body.taxamount);

					  			tdetail = 
					  					{	
					  						taxcode: req.body.taxcode,
					  						taxamount: req.body.taxamount
					  					};
					  			doc[0].detailtax.push(tdetail);
							};				

							//++++++++++++++++++++++++++++
							//   Grabar modificaciones
							doc[0].save(function(err, result) 
							{
								console.log( "Grabando:", result, err );
								if(err) {
								    console.log("Error .." + err);
								}
								else
								{
									invoicesaved = true;
								    console.log("Actualización existosa " + result + "document!");		
							 	}
							}); 
							//  ----------------fin grabar resto del proceso
							//  ----------------------------------------------------
				    	} // if (doc.length > 0)											
				    } //else if (err) 
				}); // Supplierinvoice.find(condition, function (err, doc) 
			}); // Supplierinvoice.update(condition, 
				//					{ $set: { detail: [], detailtax : [] }}, 
				//					function(err, affected)

		}

		console.log("antes de return  --------------------------------: ");
		return res.render('process/supplierinvoice', { title: 'Facturas'});
		console.log("despues de return --------------------------------: ");
		

	});



// ----------------------------------------------
//
//    POST supplierinvoiceUpdateAnswerFromSAP
//			
//          
//
// ----------------------------------------------
router.post('/supplierinvoiceupdateanswerfromsap', function(req, res, next) 

{


  		console.log('-----------------------------------------------');
  		console.log('/api/supplierinvoiceUpdateAnswerFromSAP ----------');
  		console.log('-----------------------------------------------');
		console.log('req.query.id  ....... :'+req.query.id);
		console.log('req.query.estatus.... :'+req.query.status);
		console.log('req.query.sap_reference.... :'+req.query.sap_reference);
		console.log('req.query.t_text........... :'+req.query.t_text);



		//  ----------------------------------------------------
		//  ---------------- inicio grabar resto del proceso


		//		var tmp_id = req.params.id;
		var tmp_id = req.query.id;

		console.log("tmp_id: "+tmp_id);
		var condition = {"_id": tmp_id}


		Supplierinvoice.find(condition, function (err, doc) 
		{  
			console.log("err...."+err);
			console.log("doc...."+doc);
		    // Handle any possible database errors
		    if (err) 
		    {
		    	console.log("No existe el Registro");
		        res.status(500).send(err);
		    } else 
		    {
		    	if (doc.length > 0) /// existe el doc y lo actualiza
		    	{

				    var date = new Date();
				    console.log("Fecha:"+date);

				    var hour = date.getHours();
				    hour = (hour < 10 ? "0" : "") + hour;

				    var min  = date.getMinutes();
				    min = (min < 10 ? "0" : "") + min;

				    var sec  = date.getSeconds();
				    sec = (sec < 10 ? "0" : "") + sec;

				    var year = date.getFullYear();

				    var month = date.getMonth() + 1;
				    month = (month < 10 ? "0" : "") + month;

				    var day  = date.getDate();
				    day = (day < 10 ? "0" : "") + day;

				   var t_datestring =  year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;

					doc[0].sap_status = req.query.statusr;
					doc[0].sap_reference = req.query.sap_reference;
					doc[0].sap_log = req.query.t_text;
					doc[0].sap_date = t_datestring;
					//++++++++++++++++++++++++++++
					//   Grabar modificaciones
					doc[0].save(function(err, result) 
					{
						console.log( "Grabando:", result, err );
						if(err) {
						    console.log("Error .." + err);
						}
						else
						{
							invoicesaved = true;
						    console.log("Actualización existosa " + result + "document!");		
					 	}
					}); 
					//  ----------------fin grabar resto del proceso
					//  ----------------------------------------------------
		    	} // if (doc.length > 0)											
		    } //else if (err) 
		}); // Supplierinvoice.find(condition, function (err, doc) 


			return true

	});








router.post('/supplierInvoicePostEdit_admin', function(req, res, next) 

{
	var action_returned = req.body.returnaction;
	console.log('/supplierInvoicePostEdit_admin -- action_returned....... :'+action_returned);		

	{

  		console.log('-----------------------------------------------');
  		console.log('supplierInvoicePostEdit - Modificar  ----------');
  		console.log('-----------------------------------------------');


		console.log('req.body.costcenterice ....... :'+req.body.costcenter);	
		console.log('req.body.currency .... ....... :'+req.body.currency);
		console.log('req.body.amountinvoice ....... :'+req.body.amountinvoice);
		console.log('req.body.aplevel.............. :'+req.body.aplevel);
		console.log('req.body.approver1............ :'+req.body.approver1);
		console.log('req.body.approver2............ :'+req.body.approver2);
		console.log('req.body.approver3............ :'+req.body.approver3);		
		console.log('req.body.approver4............ :'+req.body.approver4);
		console.log('req.body.approver5............ :'+req.body.approver5);
  		console.log('req.body.inputimage........... : '+ req.body.inputimage);
 		console.log('req.body.imagenbit............ : '+ req.body.imagenbit);

 		var t_release1 = ((req.body.approver1.length > 0) ? "N" : "#");
 		var t_release2 = ((req.body.approver2.length > 0) ? "N" : "#");
 		var t_release3 = ((req.body.approver3.length > 0) ? "N" : "#");
 		var t_release4 = ((req.body.approver4.length > 0) ? "N" : "#");
 		var t_release5 = ((req.body.approver5.length > 0) ? "N" : "#");



		var t_aplevel = "";
		var t_approver1 = "";
		var t_approver2 = "";
		var t_approver3 = "";
		var t_approver4 = "";
		var t_approver5 = "";


		//  ----------------------------------------------------
		//  ---------------- inicio grabar resto del proceso


			//		var tmp_id = req.params.id;
			var tmp_id = req.body.id;
			var tmp_linenumber = req.body.linenumber;

			console.log("tmp_id: "+tmp_id);
			var condition = {"_id": tmp_id}


			// Blanquea todos los subdocumentos para evitar actualizar 1 a 1
			Supplierinvoice.update(condition, 
									{ $set: { detail: [], detailtax : [] }}, 
									function(err, affected)
			{

				Supplierinvoice.find(condition, function (err, doc) 
				{  
					console.log("err...."+err);
					console.log("doc...."+doc);
				    // Handle any possible database errors
				    if (err) 
				    {
				    	console.log("No existe el Registro");
				        res.status(500).send(err);
				    } else 
				    {
				    	if (doc.length > 0) /// existe el doc y lo actualiza
				    	{

							doc[0].supplier = req.body.supplier;
							doc[0].company = req.body.company;
							doc[0].accountingdate = req.body.accountingdate;
							doc[0].documentdate = req.body.documentdate;
							doc[0].documenttype = req.body.tpdoc;
							doc[0].documentnumber = req.body.numdoc;
							doc[0].currency = req.body.currency;
							doc[0].netamountinvoice = req.body.amountinvoice;
							doc[0].totaltax = req.body.totaltax;
							doc[0].totalinvoice = req.body.totalinvoice;
							doc[0].aplevel = req.body.aplevel;
							doc[0].approver1 = req.body.approver1;
							doc[0].approver1 = t_release1;
							doc[0].approver2 = req.body.approver2;	
							doc[0].approver2 = t_release2;
							doc[0].approver3 = req.body.approver3;
							doc[0].approver3 = t_release3;
							doc[0].approver4 = req.body.approver4;
							doc[0].approver4 = t_release4;
							doc[0].approver5 = req.body.approver5;
							doc[0].approver5 = t_release5;
							doc[0].exchangerate = req.body.exchangerate;
							doc[0].approver_total = "N";
							doc[0].createdby = req.body.createdby;
/*							
							if (req.body.inputimage.length > 0)
							{
								//doc[0].imgfact.data = fs.readFileSync(req.body.inputimage);
								doc[0].imgfact.data = req.body.imagenbit
								doc[0].img.contentType = 'image/png';
							}
*/							
							var adetail = [];
							// ++++++++++++++++++++++
							// 		Agregar detalle
							if (Object.prototype.toString.call(req.body.costcenter) === '[object Array]')
							{
					  			console.log('post_query.cotcenter[0]:',req.body.costcenter[0]);
					  			console.log('post_query.cotcenter[1]:',req.body.costcenter[1]);
							}
							else
							{
					  			console.log('post_query.cotcenter:',req.body.costcenter);
					  			console.log('post_query.accountcode:',req.body.accountcode);

					  			adetail = {	
					  						linenumber: req.body.linenumber,
					  						costcenter: req.body.costcenter,
					  						accountcode: req.body.accountcode,
					  						order: req.body.order,
					  						concept: req.body.concept,
					  						servicemonth: req.body.servicemonth,
					  						description: req.body.description
					  						};
					  			doc[0].detail.push(adetail);
							};

							// ++++++++++++++++++++++
							// 		Agregar taxes
							var tdetail = [];
							if (Object.prototype.toString.call(req.body.taxcode) === '[object Array]')
							{
								console.log('Taxes - como array:');
								console.log('Taxes - req.body.taxcode.length:', req.body.taxcode.length);

								for (var i=0; i < req.body.taxcode.length; i++)
								{
					  				console.log('post_query.taxcode[i]:',req.body.taxcode[i]);
						 			tdetail = 
						  					{	
						  						taxcode: req.body.taxcode[i],
						  						taxamount: req.body.taxamount[i]
						  					};
						  			doc[0].detailtax.push(tdetail);			    
								}  			
							}
							else
							{
								console.log('Taxes - plano:');			
					  			console.log('post_query.taxcode:',req.body.taxcode);
					  			console.log('post_query.taxamount:',req.body.taxamount);

					  			tdetail = 
					  					{	
					  						taxcode: req.body.taxcode,
					  						taxamount: req.body.taxamount
					  					};
					  			doc[0].detailtax.push(tdetail);
							};				

							//++++++++++++++++++++++++++++
							//   Grabar modificaciones
							doc[0].save(function(err, result) 
							{
								console.log( "Grabando:", result, err );
								if(err) {
								    console.log("Error .." + err);
								}
								else
								{
									invoicesaved = true;
								    console.log("Actualización existosa " + result + "document!");		
							 	}
							}); 
							//  ----------------fin grabar resto del proceso
							//  ----------------------------------------------------
				    	} // if (doc.length > 0)											
				    } //else if (err) 
				}); // Supplierinvoice.find(condition, function (err, doc) 
			}); // Supplierinvoice.update(condition, 
				//					{ $set: { detail: [], detailtax : [] }}, 
				//					function(err, affected)

		}

		console.log("antes de return  --------------------------------: ");
		return res.render('process/supplierinvoice_admin', { title: 'Facturas'});
		console.log("despues de return --------------------------------: ");
		

	});





	// -------------------------------------
	//      Get supplierInvoice_Pending
	// -------------------------------------	
	router.get('/supplierInvoice_Pending', isInvoiceLoader, function(req, res, next) 
	{
	//	Supplierinvoice.find( function(err, supplierinvoice) {
	//		console.log(supplierinvoice);		
	//		res.render('headers', { title: 'Facturas'});

	//        res.locals.typemenu = "TRUE";

	//		res.optionmenu = true;

			res.render('process/supplierinvoice', { title: 'Facturas'});

	//	});
	});



	// -------------------------------------
	//      Get supplierInvoice_all
	// -------------------------------------	
	router.get('/supplierInvoice_all', isInvoiceLoader, function(req, res, next) 
	{
	//	Supplierinvoice.find( function(err, supplierinvoice) {
	//		console.log(supplierinvoice);		
	//		res.render('headers', { title: 'Facturas'});

	//        res.locals.typemenu = "TRUE";

	//		res.optionmenu = true;

			res.render('process/supplierinvoice_all', { title: 'Facturas'});

	//	});
	});


		// -------------------------------------
	//      Get supplierinvoice_sent2sap
	// -------------------------------------	
	router.get('/supplierinvoice_sent2sap', isAcounting, function(req, res, next) 
	{
	//	Supplierinvoice.find( function(err, supplierinvoice) {
	//		console.log(supplierinvoice);		
	//		res.render('headers', { title: 'Facturas'});

	//        res.locals.typemenu = "TRUE";

	//		res.optionmenu = true;

			res.render('process/supplierinvoice_sent2sap', { title: 'Enviar Facturas a SAP'});

	//	});
	});


		// -------------------------------------
	//      Get supplierinvoice_sent2sap
	// -------------------------------------	
	router.post('/supplierinvoice_sent2sap', isAcounting, function(req, res, next) 
	{
		res.redirect('/supplierinvoice_sent2sap');
	});

	// -------------------------------------
	//      Get supplierInvoice_edit_admin
	// -------------------------------------	
	router.get('/supplierInvoice_edit_admin', function(req, res, next) 
	{
	//	Supplierinvoice.find( function(err, supplierinvoice) {
	//		console.log(supplierinvoice);		
	//		res.render('headers', { title: 'Facturas'});

	//        res.locals.typemenu = "TRUE";

	//		res.optionmenu = true;

			res.render('process/supplierinvoice_admin', { title: 'Facturas Superusuario'});

	//	});
	});


	// -------------------------------------
	//      Get supplierInvoice2release
	// -------------------------------------	
	router.get('/supplierInvoice2release', isInvoiceLoader, function(req, res, next) 
	{
		console.log('dentro de get process/supplierinvoice2release')
		res.render('process/invoice2release', { title: 'Facturas'});
	});



	// -------------------------------------------
	//      Post /supplierInvoice2release_view
	// -------------------------------------------	
		router.post('/supplierInvoice2release_view', function(req, res, next) 
		{

		var temp_id = req.body.post_id;

		//		tmp_id = temp_id.split(":")[0];
		console.log("---------------------------------: ");

		// aquiestoy
		console.log("post /supplierInvoice2release_view/post_id : "+temp_id);
		console.log("post /supplierInvoice2release_view -req.user.username : "+req.user.username);
		console.log("post /supplierInvoice2release_view - req.session: "+req.session);
		console.log("post /supplierInvoice2release_view - req.session.passport.user: "+req.session.passport);


	   	Supplierinvoice.findById(temp_id, function(err, docs) 
		{
			if (err)
			{
			       console.log("Error docs : "+docs);
			}
					
			var results_mongodb = [];

			results_mongodb.push(docs);


			console.log("---------------------------------: ");

			console.log("docs : "+docs);
			console.log("---------------------------------: ");

			console.log("results_mongodb : "+results_mongodb);

			res.render('process/invoice2release_detail', { title: 'Liberar Factura', 
																recdata: results_mongodb
																//, 
																//xsup: results_mongodb.supplier,
																//user_id: req.user.username
																});

			//  	return res.redirect('/process/supplierinvoice_edit');

		});


	});



// -------------------------------------------------------------------------
//
//     Post /supplierInvoice2release_approval
//			* Grabar Modificaciones description
//
// -------------------------------------------------------------------------
router.post('/supplierInvoice2release_approval', function(req, res, next) 

{

	console.log('-----------------------------------------------');
	console.log('supplierInvoice2release_approval     ----------');
	console.log('-----------------------------------------------');	

	var action_returned = req.body.returnaction;
	console.log('action_returned....... :'+action_returned);		
	if (action_returned == "Liberar")
	{


  		console.log('-----------------------------------------------');
  		console.log('ApprobarInvoice2release_approval     ----------');
  		console.log('-----------------------------------------------');


		console.log('req.body.costcenterice ....... :'+req.body.costcenter);	
		console.log('req.body.currency .... ....... :'+req.body.currency);
		console.log('req.body.amountinvoice ....... :'+req.body.amountinvoice);
		console.log('req.body.aplevel.............. :'+req.body.aplevel);
		console.log('req.body.approver1............ :'+req.body.approver1);
		console.log('req.body.approver2............ :'+req.body.approver2);
		console.log('req.body.approver3............ :'+req.body.approver3);		
		console.log('req.body.approver4............ :'+req.body.approver4);
		console.log('req.body.approver5............ :'+req.body.approver5);
		//dateFormat(new Date(), 'm-d-Y h:i:s');
		var t_releasedate = new Date();
		console.log('releasedate............ :'+t_releasedate);



		//  ----------------------------------------------------
		//  ---------------- inicio grabar resto del proceso

		console.log('/api/restUserAccount--------------');
		console.log('user_id', req.session.passport.user);
		User.findById(req.session.passport.user, {email:1}, function(err, docs) 
		{
			if (err)
			{
				res.send(err);
			}



			//		var tmp_id = req.params.id;
			var tmp_id = req.body.id;
			var tmp_linenumber = req.body.linenumber;

			console.log("tmp_id: "+tmp_id);
			var condition = {"_id": tmp_id}

			Supplierinvoice.find(condition, function (err, doc) 
			{  
				console.log("err....",err);
				//console.log("doc...."+doc);
			    // Handle any possible database errors
			    if (err) 
			    {
			    	console.log("No existe el Registro");
			        res.status(500).send(err);
			    } else 
			    {
			    	if (doc.length > 0) /// existe el doc y lo actualiza
			    	{

			    		if (doc[0].release1 == "N")
			    		{
			    			doc[0].approver1date = t_releasedate;
							doc[0].approver1user = docs.email;
							doc[0].release1 = "Y";
			    		}
			    		else
			    		{
				    		if (doc[0].release2 == "N")
				    		{
				    			doc[0].approver2date = t_releasedate;
								doc[0].approver2user = docs.email;
								doc[0].release2 = "Y";
				    		}
				    		else
				    		{
					    		if (doc[0].release3 == "N")
					    		{
					    			doc[0].approver3date = t_releasedate;
									doc[0].approver3user = docs.email;
									doc[0].release3 = "Y";
					    		}
					    		else
					    		{
						    		if (doc[0].release4 == "N")
						    		{
						    			doc[0].approver4date = t_releasedate;
										doc[0].approver4user = docs.email;
										doc[0].release4 = "Y";
						    		}
						    		else
						    		{
							    		if (doc[0].release5 == "N")
							    		{
							    			doc[0].approver5date = t_releasedate;
											doc[0].approver5user = docs.email;
											doc[0].release5 = "Y";
							    		}
						    		}
					    		}
				    		}
			    		}
			    		if ((doc[0].release1 == "Y" || doc[0].release1 =="#") && 
			    			(doc[0].release2 == "Y" || doc[0].release2 =="#") && 
			    			(doc[0].release3 == "Y" || doc[0].release3 =="#") && 
			    			(doc[0].release4 == "Y" || doc[0].release4 =="#") && 
			    			(doc[0].release5 == "Y" || doc[0].release5 =="#"))
			    		{
			    			doc[0].approver_total = "Y";
			    		}


						//++++++++++++++++++++++++++++
						//   Grabar modificaciones
						doc[0].save(function(err, result) 
						{
							console.log( "Grabando:", result, err );
							if(err) {
							    console.log("Error .." + err);
							}
							else								
							{
								invoicesaved = true;
							    console.log("Actualización existosa " + result + "document!");		
						 	}
						}); 
						//  ----------------fin grabar resto del proceso
						//  ----------------------------------------------------
			    	} // if (doc.length > 0)											
			    } //else if (err) 
			}); // Supplierinvoice.find(condition, function (err, doc) 
		}); // User.find(condition, function (err, doc) 
	}
	/*
	else
	{
		console.log('/api/restUserAccount--------------');
		console.log('user_id', req.session.passport.user);
		User.findById(req.session.passport.user, {email:1}, function(err, docs) 
		{
			if (err)
			{
				res.send(err);
			}

			//		var tmp_id = req.params.id;
			var tmp_id = req.body.id;
			var tmp_linenumber = req.body.linenumber;

			console.log("tmp_id: "+tmp_id);
			var condition = {"_id": tmp_id}

			Supplierinvoice.find(condition, function (err, doc) 
			{  
				console.log("err...."+err);
				console.log("doc...."+doc);
			    // Handle any possible database errors
			    if (err) 
			    {
			    	console.log("No existe el Registro");
			        res.status(500).send(err);
			    } else 
			    {
			    	if (doc.length > 0) /// existe el doc y lo actualiza
			    	{		    		
		    			doc[0].approver1date = '';
						doc[0].approver1user = '';
						doc[0].release1 = "N";
		    			doc[0].approver2date = '';
						doc[0].approver2user = '';
						doc[0].release2 = "N";
		    			doc[0].approver3date = '';
						doc[0].approver3user = '';
						doc[0].release3 = "N";
		    			doc[0].approver4date = '';
						doc[0].approver4user = '';
						doc[0].release4 = "N";
		    			doc[0].approver5date = '';
						doc[0].approver5user = '';
						doc[0].release5 = "N";

						//++++++++++++++++++++++++++++
						//   Grabar modificaciones
						doc[0].save(function(err, result) 
						{
							console.log( "Grabando:", result, err );
							if(err) {
							    console.log("Error .." + err);
							}
							else
							{
								invoicesaved = true;
							    console.log("Actualización existosa " + result + "document!");		
						 	}
						}); 
						//  ----------------fin grabar resto del proceso
						//  ----------------------------------------------------
			    	} // if (doc.length > 0)											
			    } //else if (err) 
			}); // Supplierinvoice.find(condition, function (err, doc) 
		});			
		
	} // if action
		*/
	
	return res.render('process/invoice2release', { title: 'Facturas'});
		
});




	// -------------------------------------
	//      Get /supplierinvoice_add
	// -------------------------------------	
	router.get('/supplierinvoice_add', function(req, res, next) 
	{

		var tmp_id = req.params.id;

		console.log("------------------------------: ");

		console.log("/supplierinvoice_add/get 1: ");		

		//		var operator = {"supplier": req.body.supplier,
		//						"fecha" : req.body.fecha,
		//						"accountcode": req.body.accountcode,
		//						"costcenter": req.body.costcenter,
		//						"servicesmonth": req.body.servicesmonth,
		//						"amountinvoice": req.body.amountinvoice,
		//						"currency": req.body.currency,
		//						"comments": req.body.comments
		//						}
		//	    var xx = req.body.fecha;
		//		res.render('process/supplierinvoice_edit', { title: 'Crear Factura', recdata: supplierinvoice});

		res.render('process/supplierinvoice_detail_create', { title: 'Crear Factura'});

		//  	return res.redirect('/process/supplierinvoice_edit');

	});


	// -------------------------------------
	//      Post /supplierinvoice_view
	// -------------------------------------	
		router.post('/supplierinvoice_view', function(req, res, next) 
		{

		var temp_id = req.body.post_id;

		//		tmp_id = temp_id.split(":")[0];
		console.log("---------------------------------: ");

		// aquiestoy
		console.log("post /supplierinvoice_view/post_id : "+temp_id);
		console.log("post /supplierinvoice_view -req.user.username : "+req.user.username);
		console.log("post /supplierinvoice_view - req.session: "+req.session);
		console.log("post /supplierinvoice_view - req.session.passport.user: "+req.session.passport);


	   	Supplierinvoice.findById(temp_id, function(err, docs) 
		{
			if (err)
			{
			       console.log("Error docs : "+docs);
			}
					
			var results_mongodb = [];

			results_mongodb.push(docs);


			console.log("---------------------------------: ");

			console.log("docs : "+docs);
			console.log("---------------------------------: ");

			console.log("results_mongodb : "+results_mongodb);

			res.render('process/supplierinvoice_detail_edit', { title: 'Modificar Factura', 
																recdata: results_mongodb
																//, 
																//xsup: results_mongodb.supplier,
																//user_id: req.user.username
																});

			//  	return res.redirect('/process/supplierinvoice_edit');

		});


	});

	// -------------------------------------
	//      Post /supplierinvoice_viewsap
	// -------------------------------------	
		router.post('/supplierinvoice_viewsap', function(req, res, next) 
		{

		var temp_id = req.body.post_id;

		//		tmp_id = temp_id.split(":")[0];
		console.log("---------------------------------: ");

		// aquiestoy
		console.log("post /supplierinvoice_view/post_id : "+temp_id);
		console.log("post /supplierinvoice_view -req.user.username : "+req.user.username);
		console.log("post /supplierinvoice_view - req.session: "+req.session);
		console.log("post /supplierinvoice_view - req.session.passport.user: "+req.session.passport);


	   	Supplierinvoice.findById(temp_id, function(err, docs) 
		{
			if (err)
			{
			       console.log("Error docs : "+docs);
			}
					
			var results_mongodb = [];

			results_mongodb.push(docs);

			console.log("---------------------------------: ");

			console.log("docs : "+docs);
			console.log("---------------------------------: ");

			console.log("results_mongodb : "+results_mongodb);

			console.log("settings.sapWebServer : "+settings.sapWebServer);			

			res.render('process/supplierinvoice_detail_viewsap', 
									{ title: 'Enviar a SAP - Factura', 
									  recdata: results_mongodb, 
									  settings: settings
									  //sapWebSrv: settings.sapWebServer
									  //, 
									  //xsup: results_mongodb.supplier,
									  //user_id: req.user.username
									});

			//  	return res.redirect('/process/supplierinvoice_edit');

		});

	});		


	// -------------------------------------
	//      Post /supplierinvoice_view
	// -------------------------------------	
		router.post('/supplierinvoice_view_adm', function(req, res, next) 
		{

		var temp_id = req.body.post_id;

		//		tmp_id = temp_id.split(":")[0];
		console.log("---------------------------------: ");

		// aquiestoy
		console.log("post /supplierinvoice_view/post_id : "+temp_id);
		console.log("post /supplierinvoice_view -req.user.username : "+req.user.username);
		console.log("post /supplierinvoice_view - req.session: "+req.session);
		console.log("post /supplierinvoice_view - req.session.passport.user: "+req.session.passport);


	   	Supplierinvoice.findById(temp_id, function(err, docs) 
		{
			if (err)
			{
			       console.log("Error docs : "+docs);
			}
					
			var results_mongodb = [];

			results_mongodb.push(docs);


			console.log("---------------------------------: ");

			console.log("docs : "+docs);
			console.log("---------------------------------: ");

			console.log("results_mongodb : "+results_mongodb);

			res.render('process/supplierinvoice_detail_edit_especial_adm', { title: 'Enviar a SAP', 
																recdata: results_mongodb
																//, 
																//xsup: results_mongodb.supplier,
																//user_id: req.user.username
																});

			//  	return res.redirect('/process/supplierinvoice_edit');

		});


	});

	// -------------------------------------
	//      Post /supplierinvoice_view_all
	// -------------------------------------	
		router.post('/supplierinvoice_view_all', function(req, res, next) 
		{

		var temp_id = req.body.post_id;

		//		tmp_id = temp_id.split(":")[0];
		console.log("---------------------------------: ");

		// aquiestoy
		console.log("post /supplierinvoice_view/post_id : "+temp_id);
		console.log("post /supplierinvoice_view -req.user.username : "+req.user.username);
		console.log("post /supplierinvoice_view - req.session: "+req.session);
		console.log("post /supplierinvoice_view - req.session.passport.user: "+req.session.passport);


	   	Supplierinvoice.findById(temp_id, function(err, docs) 
		{
			if (err)
			{
			       console.log("Error docs : "+docs);
			}
					
			var results_mongodb = [];

			results_mongodb.push(docs);


			console.log("---------------------------------: ");

			console.log("docs : "+docs);
			console.log("---------------------------------: ");

			console.log("results_mongodb : "+results_mongodb);

			res.render('process/supplierinvoice_detail_view', { title: 'Visualizar Factura', 
																recdata: results_mongodb
																//, 
																//xsup: results_mongodb.supplier,
																//user_id: req.user.username
																});

			//  	return res.redirect('/process/supplierinvoice_edit');

		});


	});


	// -------------------------------------
	//      Get /supplierinvoiceDelete
	// -------------------------------------	
	//	router.get('/supplierInvoiceDelete/:id', function(req, res, next) 

	router.get('/supplierInvoiceDelete', function(req, res, next) 
	{



	});


	// -------------------------------------
	//      post /Supplier Invoice Insert
	// -------------------------------------	
	router.post('/supplierInvoiceInsert', function(req, res, next) 
	{

  		console.log('-----------------------------------------------');
  		console.log('SupplierInvoiceInsert     ---------------------');
  		console.log('-----------------------------------------------');

		// var post_data = req.body;
  		// console.log('post_data:',post_data);
		// var post_query = req.query;
  		// console.log('post_query:',post_query);

		// console.log("Post --> /supplierInvoiceInsert ---> req.body.supplier :", req.body.supplier);
		// console.log("Post --> /supplierInvoiceInsert ---> req.body.tdetail.size :", req.body.detail[0]);

  		// console.log('post_query.supplier:');
		console.log('req.body.pprovalarea .... .... :'+req.body.approvalarea);
		console.log('req.body.currency .... ....... :'+req.body.currency);
		console.log('req.body.exchangerate. ....... :'+req.body.exchangerate);		
		console.log('req.body.amountinvoice ....... :'+req.body.amountinvoice);
		console.log('req.body.aplevel.............. :'+req.body.aplevel);
		console.log('req.body.approver1............ :'+req.body.approver1);
		console.log('req.body.approver2............ :'+req.body.approver2);
		console.log('req.body.approver3............ :'+req.body.approver3);		
		console.log('req.body.approver4............ :'+req.body.approver4);
		console.log('req.body.approver5............ :'+req.body.approver5);
  		console.log('req.body.inputimage........... : '+ req.body.inputimage);
 		console.log('req.body.imagenbit............ : '+ req.body.imagenbit);

 		var t_release1 = ((req.body.approver1.length > 0) ? "N" : "#");
 		var t_release2 = ((req.body.approver2.length > 0) ? "N" : "#");
 		var t_release3 = ((req.body.approver3.length > 0) ? "N" : "#");
 		var t_release4 = ((req.body.approver4.length > 0) ? "N" : "#");
 		var t_release5 = ((req.body.approver5.length > 0) ? "N" : "#");

  		console.log('post_query.cotcenter.length:',req.body.costcenter.length);

		var arecord = [];
		var adetail = [];


		if (Object.prototype.toString.call(req.body.costcenter) === '[object Array]')
		{
  			console.log('post_query.cotcenter[0]:',req.body.costcenter[0]);
  			console.log('post_query.cotcenter[1]:',req.body.costcenter[1]);
		}
		else
		{
  			console.log('post_query.cotcenter:',req.body.costcenter);
  			console.log('post_query.accountcode:',req.body.accountcode);

  			adetail = {	
  						linenumber: req.body.linenumber,
  						costcenter: req.body.costcenter,
  						accountcode: req.body.accountcode,
  						order: req.body.order,
  						concept: req.body.concept,
  						servicemonth: req.body.servicemonth,
  						description: req.body.description
  						};
		};

		//  ----------------------------------------------------
		//  ---------------- Buscar email usuario
		var t_email = "SIN EMAIL"
		User.findById(req.session.passport.user, {id:1, email:1}, function(err, docs) 
		{
			if (err)
			{
				res.send(err);
			}
			console.log("docs.id:",docs.id);
			console.log("docs.email:",docs.email);			
			t_email = docs.email;
			//console.log("docs.approver",current_approver);
			//console.log("docs.approver",docs[0].approver);

		//  ----------------------------------------------------
		//  ---------------- inicio grabar resto del proceso

		arecord.push( 
			new Supplierinvoice(
				{
					approvalarea: req.body.approvalarea,
					supplier: req.body.supplier,
					company: req.body.company,
					accountingdate: req.body.accountingdate,
					documentdate: req.body.documentdate,
					documenttype: req.body.tpdoc,
					documentnumber: req.body.numdoc,
					currency: req.body.currency,
					netamountinvoice: req.body.amountinvoice,
					totaltax: req.body.totaltax,
					totalinvoice: req.body.totalinvoice,
					approver_total: "N",
					aplevel: req.body.aplevel,
					approver1: req.body.approver1,
					approver1date: "",
					approver1user: "",
					release1 : t_release1,	
					approver2: req.body.approver2,
					approver2date: "",
					approver2user: "",
					release2 : t_release2,
					approver3: req.body.approver3,
					approver3date: "",
					approver3user: "",
					release3 : t_release3,
					approver4: req.body.approver4,
					approver4date: "",
					approver4user: "",
					release4 : t_release4,
					approver5: req.body.approver5,
					approver5date: "",
					approver5user: "",
					release5 : t_release5,
					createdby: t_email,
					exchangerate: req.body.exchangerate,
					sap_id : "",
					sap_status : "PENDIENTE",
					sap_date : "",
					sap_log : "",
					detail: adetail,
				}));

		// ++++++++++++++++++++++
		// 		Agregar taxes
		var tdetail = [];
		if (Object.prototype.toString.call(req.body.taxcode) === '[object Array]')
		{
			console.log('Taxes - como array:');
			console.log('Taxes - req.body.taxcode.length:', req.body.taxcode.length);

			for (var i=0; i < req.body.taxcode.length; i++)
			{
  				console.log('post_query.taxcode[i]:',req.body.taxcode[i]);
	 			tdetail = 
	  					{	
	  						taxcode: req.body.taxcode[i],
	  						taxamount: req.body.taxamount[i]
	  					};
	  			arecord[0].detailtax.push(tdetail);			    
			}  			
		}
		else
		{
			console.log('Taxes - plano:');			
  			console.log('post_query.taxcode:',req.body.taxcode);
  			console.log('post_query.taxamount:',req.body.taxamount);

  			tdetail = 
  					{	
  						taxcode: req.body.taxcode,
  						taxamount: req.body.taxamount
  					};
  			arecord[0].detailtax.push(tdetail);
		};				


		arecord[0].save(function(err, result) 
		{
			console.log( "Grabando:", result, err );
			if(err) {
			    console.log("Error .." + err);
			}
			else
			{
			    console.log("Actualización existosa " + result + "document!");		
		 	}

		});    

		}); // user.find()

		//  ----------------fin grabar resto del proceso
		//  ----------------------------------------------------

    
		res.redirect('/supplierInvoice_Pending');

	});





	// -------------------------------------
	//      post /Supplier Invoice Insertbackup
	// -------------------------------------	
	router.post('/supplierInvoiceInsertbackup', function(req, res, next) 
	{

  		console.log('-----------------------------------------------');
  		console.log('SupplierInvoiceInsert     ---------------------');
  		console.log('-----------------------------------------------');

		// var post_data = req.body;
  		// console.log('post_data:',post_data);
		// var post_query = req.query;
  		// console.log('post_query:',post_query);

		// console.log("Post --> /supplierInvoiceInsert ---> req.body.supplier :", req.body.supplier);
		// console.log("Post --> /supplierInvoiceInsert ---> req.body.tdetail.size :", req.body.detail[0]);

  		// console.log('post_query.supplier:');

  		console.log('post_query.cotcenter.length:',req.body.costcenter.length);

		var arecord = [];
		var adetail = [];


		if (Object.prototype.toString.call(req.body.costcenter) === '[object Array]')
		{
  			console.log('post_query.cotcenter[0]:',req.body.costcenter[0]);
  			console.log('post_query.cotcenter[1]:',req.body.costcenter[1]);
		}
		else
		{
  			console.log('post_query.cotcenter:',req.body.costcenter);
  			console.log('post_query.accountcode:',req.body.accountcode);

  			adetail = {	
  						linenumber: req.body.linenumber,
  						costcenter: req.body.costcenter,
  						accountcode: req.body.accountcode,
  						order: req.body.order,
  						concept: req.body.concept,
  						servicemonth: req.body.servicemonth,
  						description: req.body.description
  						};
		};


		// +++++++++++++++++++++++++++++++++
		//    Buscar nivel de aprobación

		var t_aplevel = "";
		var t_approver1 = "";
		var t_approver2 = "";
		var t_approver3 = "";
		var t_approver4 = "";
		var t_approver5 = "";

        console.log('Antes Approvallevels - req.body.amountinvoice:', req.body.amountinvoice);
        console.log('Antes Approvallevels - req.body.currency:', req.body.currency);
		Approvallevels.find({$and: [ 	{valmin : {$lte: req.body.amountinvoice }}, 
										{valmax : {$gte: req.body.amountinvoice }}, 
										{currency : {$eq: req.body.currency}} 
									]} , function(err, docs)
		{
            console.log('Approvallevels - doc :',docs);
            console.log('Approvallevels - docs.length:', docs.length);
            console.log('Approvallevels - err:', err);
            console.log('Approvallevels - req.body.costcenter  :',req.body.costcenter);
            var t_pos = req.body.costcenter.indexOf(':');
            console.log('Approvallevels - t_pos :', t_pos);

            var t_costcenter = req.body.costcenter.slice(0,t_pos).trim();

            console.log('Approvallevels - req.body.costcenter.slice(0,t_pos).trim() :', t_costcenter );
            var repite = true;
			for (var i=0; i < docs.length; i++)
			{

            	console.log('Approvallevels - i :',i);
            	console.log('Approvallevels - doc[',i,'].aplevel :',docs[i].aplevel);

				Approvalscheme.find({ 	costcenter: new RegExp(t_costcenter), 
						  				aplevel : docs[i].aplevel}, function(err, docs1)
				{
            		console.log('Approvalscheme docs1:',docs1);
            		console.log('Approvalscheme - docs1.length :',docs1.length);            		
					// 	console.log('Approvalscheme - docs1[0].aplevel :',docs1[0].aplevel);  

            		if (docs1.length > 0)
            		{
            			t_aplevel = docs1[0].aplevel;
            			t_approver1 = docs1[0].approver1;
						t_approver2 = docs1[0].approver2;
						t_approver3 = docs1[0].approver3;
						t_approver4 = docs1[0].approver4;
						t_approver5 = docs1[0].approver5;

						i=100;

						console.log('Approvalscheme: break',t_aplevel);

						//  ----------------------------------------------------
						//  ---------------- inicio grabar resto del proceso

							console.log('Approvalscheme - t_aplevel :',t_aplevel);
							console.log('Approvalscheme - t_approver1  :',t_approver1 );
							console.log('Approvalscheme - t_approver2  :',t_approver2 );
							console.log('Approvalscheme - t_approver3  :',t_approver3 );
							console.log('Approvalscheme - t_approver4  :',t_approver4 );
							console.log('Approvalscheme - t_approver5  :',t_approver5 );

							arecord.push( 
								new Supplierinvoice(
									{
										supplier: req.body.supplier,
										company: req.body.company,
										accountingdate: req.body.accountingdate,
										documentdate: req.body.documentdate,
										documenttype: req.body.tpdoc,
										documentnumber: req.body.numdoc,
										currency: req.body.currency,
										netamountinvoice: req.body.amountinvoice,
										totaltax: req.body.totaltax,
										totalinvoice: req.body.totalinvoice,
										aplevel: t_aplevel,
										approver1: t_approver1,
										approver1date: "",
										approver1user: "",
										approver2: t_approver2,
										approver2date: "",
										approver2user: "",										
										approver3: t_approver3,
										approver3date: "",
										approver3user: "",										
										approver4: t_approver4,
										approver4date: "",
										approver4user: "",
										approver5: t_approver5,
										approver5date: "",
										approver5user: "",
										detail: adetail,
									}));

							// ++++++++++++++++++++++
							// 		Agregar taxes
							var tdetail = [];
							if (Object.prototype.toString.call(req.body.taxcode) === '[object Array]')
							{
								console.log('Taxes - como array:');
								console.log('Taxes - req.body.taxcode.length:', req.body.taxcode.length);

								for (var i=0; i < req.body.taxcode.length; i++)
								{
					  				console.log('post_query.taxcode[i]:',req.body.taxcode[i]);
						 			tdetail = 
						  					{	
						  						taxcode: req.body.taxcode[i],
						  						taxamount: req.body.taxamount[i]
						  					};
						  			arecord[0].detailtax.push(tdetail);			    
								}  			
							}
							else
							{
								console.log('Taxes - plano:');			
					  			console.log('post_query.taxcode:',req.body.taxcode);
					  			console.log('post_query.taxamount:',req.body.taxamount);

					  			tdetail = 
					  					{	
					  						taxcode: req.body.taxcode,
					  						taxamount: req.body.taxamount
					  					};
					  			arecord[0].detailtax.push(tdetail);
							};				


							arecord[0].save(function(err, result) 
							{
								console.log( "Grabando:", result, err );
								if(err) {
								    console.log("Error .." + err);
								}
								else
								{
								    console.log("Actualización existosa " + result + "document!");		
							 	}

							});    


						//  ----------------fin grabar resto del proceso
						//  ----------------------------------------------------





					}
					else
            		{
            			console.log("No Encontró esquema de aprobación. No se graba la factura")

					} //(docs1.length > 0)
            	}); //Approvalscheme.find
        	} // for (var i=0; i < docs.length; i++)
		}); // Approvallevels.find

    
		res.redirect('/supplierInvoice_Pending');

	});

	// ******************************************************
	//
	//      	API's Datamaestra
	//
	// ******************************************************


	// -----------------------------------
	//
	//    API exist_approvalschema
	//
	// -----------------------------------
		router.get('/api/exist_approvalschema', function(req, res, next) 

		{
			var action_returned = req.body.returnaction;
			console.log('invpice....... :'+action_returned);	

			var output = { "error" : true};



	  		console.log('-----------------------------------------------');
	  		console.log('/api/exist_approvalschema            ----------');
	  		console.log('-----------------------------------------------');
			console.log('req.query.approvalarea  ....... :'+req.query.approvalarea);	
			console.log('req.query.............. ....... :'+req.query);
			console.log('req.query.costcenterice ....... :'+req.query.costcenter);	
			console.log('req.query.currency .... ....... :'+req.query.currency);
			console.log('req.query.amountinvoice ....... :'+req.query.amountinvoice);

			

			// +++++++++++++++++++++++++++++++++
			//    Buscar nivel de aprobación

			var t_aplevel = "";
			var t_approver1 = "";
			var t_approver2 = "";
			var t_approver3 = "";
			var t_approver4 = "";
			var t_approver5 = "";
			exist_approvalscheme = false;

	        console.log('Antes Approvallevels - req.body.amountinvoice:', req.query.amountinvoice);
	        console.log('Antes Approvallevels - typeof req.body.amountinvoice:', typeof req.query.amountinvoice);
	        var amountinvoice_number = Number(req.query.amountinvoice);
	        console.log('Antes Approvallevels - amountinvoice_number:', amountinvoice_number);
	        console.log('Antes Approvallevels - typeof amountinvoice_number:', typeof amountinvoice_number);


	        console.log('Antes Approvallevels - req.body.currency:', req.query.currency);

	        /*  logica en MongoShell

				db.approvallevels.aggregate([
						{ $match: {
							$and: [	{valmin : {$lte: 500 }},
								{valmax : {$gte: 500 }}, 
								{currency : {$eq: "ARS"}}]
						}},
						{ $lookup: {
								from : "approvalschemes",
								localField: "aplevel",
								foreignField: "aplevel",
								as: "approvationfound"
							 }
						},
						{ $project: { "approvationfound": 
								{$filter: 
									{ input: "$approvationfound",
								          as: "approvalscheme",
									  cond: { $eq: [ "$$approvalscheme.costcenter", "BLOO9000:ACCOUNTING" ] }
									}
								}
							     }
						}
				])

				*/


          	console.log('Approvallevels - req.query.costcenter  :',req.query.costcenter);
		    var t_pos = req.query.costcenter.indexOf(':');
		    console.log('Approvallevels - t_pos :', t_pos);
            var t_costcenter = req.query.costcenter.slice(0,t_pos).trim();

            console.log('Approvallevels - req.query.costcenter.slice(0,t_pos).trim() :', t_costcenter );

          	console.log('Approvallevels - req.query.approlvalarea  :',req.query.approvalarea);
		    var t_pos = req.query.approvalarea.indexOf(':');
		    console.log('Approvallevels - t_pos :', t_pos);
            var t_approvalarea = req.query.approvalarea.slice(0,t_pos).trim();

            console.log('Approvallevels - req.query.approlvalarea.slice(0,t_pos).trim() :', t_approvalarea );            

			/*	
			Approvallevels.find({$and: [ 	{valmin : {$lte: req.query.amountinvoice }}, 
											{valmax : {$gte: req.query.amountinvoice }}, 
											{currency : {$eq: req.query.currency}} 
										]} 
			*/
/*
			Approvallevels.aggregate(
					[
						{ "$match" : 
							{
								"$and": [	
										{"valmin" : {"$lte": req.query.amountinvoice }},
										{"valmax" : {"$gte": req.query.amountinvoice }}, 
										{"currency" : {"$eq": req.query.currency}}
									  ]
							}
						},
						{ "$lookup": 
							{
								from : 'approvalschemes',
								localField: 'aplevel',
								foreignField: 'aplevel',
								as: 'approvationfound'
							}
						},
						//{ $project: { "approvationfound": 
						{ "$project": 
							{  
								"aplevel" : "$aplevel ",
								"approvationfound" : 
								{
									"$filter": 
										{ 
											"input": "$approvationfound",
								        	"as": "approvalscheme",
									  		"cond": 
									  			{ 
									  				"$eq": [ "$$approvalscheme.costcenter", req.query.costcenter ] 
									  				//"$eq": [ "$$approvalscheme.costcenter", new RegExp(t_costcenter) ] 
									  				//"$in": ["$$approvalscheme.costcenter", t_costcenter]
									  			}
										}									
								}
							}
						}
				],

*/

			Approvallevels.aggregate(
					[
						{ "$match" : 
							{
								$and: [	
										{"valmin" : {$lte: amountinvoice_number }},
										{"valmax" : {$gt: amountinvoice_number }}, 
										{"currency" : {$eq: req.query.currency}}
										//,
										//{"costcenter" :{$eq: new RegExp(t_costcenter) }}
									  ]
							}
						},
						
						{ "$lookup": 
							{
								from : 'approvalschemes',
								localField: 'aplevel',
								foreignField: 'aplevel',
								as: 'approvationfound'
							}
						},
//						{
//						    "$unwind": "$approvalscheme1"
//						},						
						//{ $project: { "approvationfound": 
						{ $project: 
							{  
								aplevel : 1,
								currency: 1,
								approver1 : "$approvationfound.approver1",
								approver2 : "$approvationfound.approver2",
								approver3 : "$approvationfound.approver3",
								approver4 : "$approvationfound.approver4",
								approver5 : "$approvationfound.approver5",
								approvalarea : "$approvationfound.approvalarea",

								// costcenter : "$approvationfound.costcenter",
/*
								approvationfound : 
								{
									$filter: 
										{ 
											input: "$approvationfound",
								        	as: "approvalscheme1",
									  		cond: 
									  			{ 
									  				//"$eq": [ "$$approvalscheme1.costcenter", req.query.costcenter ] 
									  				//$in: [ new RegExp(t_costcenter), "$$approvalscheme1.costcenter" ] 
									  				//"$in": [ "$$approvalscheme1.costcenter", new RegExp() ] 
									  				//"$in": ["$$approvalscheme.costcenter", t_costcenter]
									  			}
										},

								},
								*/
								
							},

						}
				],
				function(err, docs)
			{

	            console.log("err:", err);
	            if (err)
	            {
					console.log('------------------> Error');
					console.log(err);
					var output = 
					{ 	"error" : true, "message" : err };
			    	//output["data"] = { "aplevel" : t_aplevel, "approver1" : t_approver1 };
			    	res.json(output)
	            }
	            else
	            {

		            if (docs.length > 0)
		            //if (docs)
		            {
	//            		if (docs1.length > 0)
		            	console.log('Aggregation - docs :',docs);
	        			console.log('Approvalscheme - docs.length :',docs.length);
						console.log('Approvalscheme - docs[0].aplevel :', docs[0].aplevel);
						console.log('Approvalscheme - docs[0].aplevel :', docs[0].aplevel);
						//console.log('Approvalscheme - docs[0].costcenter :', docs[0].costcenter);
						//console.log('Approvalscheme - docs[0].costcenter.length :', docs[0].costcenter.length);
						console.log('Approvalscheme - docs[0].approvalarea :', docs[0].approvalarea);
						console.log('Approvalscheme - docs[0].approvalarea.length :', docs[0].approvalarea.length);

						//if (docs[0].approvalarea.length > 0)

						if (docs.length > 0)
						{
							//for(var i = 0; i < docs[0].costcenter.length; i++) 
							for(var i = 0; i < docs.length; i++) 
							{
								console.log("I:  ", i);								
								console.log("docs["+i+"].approvalarea: ",docs[i].approvalarea[0], new RegExp(t_approvalarea) );
								if ((typeof(docs[i].approvalarea[0]) !== 'undefined'))
								{
									console.log("docs["+i+"].approvalarea.indexOf(t_approvalarea):",docs[i].approvalarea[0].indexOf(t_approvalarea));
								    if (docs[i].approvalarea[0].indexOf(t_approvalarea)>=0) 
								    {
								        console.log("se encuentra objeto!.", i);
						        		t_aplevel = docs[i].aplevel;
						        		t_approver1 = docs[i].approver1;
										t_approver2 = docs[i].approver2;
										t_approver3 = docs[i].approver3;
										t_approver4 = docs[i].approver4;
										t_approver5 = docs[i].approver5;

								        i=10000;
								    }
							    }
							}

							console.log("Valor de salida de I:  ", i);								

							if (i>=10000)
							{
								var t_error = false;
								var t_mensaje = "Encontré esquema";
								console.log("Valor de salida de (t_error=false) I:  ", i);								
							}
							else
							{
								var t_error = true;
								var t_mensaje = "No existe esquema para el Area Aprobadora";
								console.log("Valor de salida de (t_error=true) I:  ", i);								
							}


							//console.log('Approvalscheme - docs[0].approvalarea.indexOf(t_approvalarea) :', docs[i].approvalarea.indexOf(t_approvalarea));
							//console.log('Approvalscheme - docs[0].approvalarea.indexOf(new RegExp(t_approvalarea)) :', docs[i].approvalarea[0].indexOf(new RegExp(t_approvalarea)));
							//console.log('Approvalscheme - docs[0].costcenter.indexOf(new RegExp(t_costcenter)) :', docs[1].costcenter[1].indexOf(new RegExp(t_costcenter)));

							//console.log('Approvalscheme - docs[0].approvalarea.indexOf(req.body.approvalarea) :', docs[0].approvalarea.indexOf(req.body.approvalarea));




							//console.log('approvationfound :',approvationfound);

				            console.log('Approvallevels - err:', err);
				            /*
		        			t_aplevel = docs[0].aplevel;
		        			t_approver1 = docs[0].approver1;
							t_approver2 = docs[0].approver2;
							t_approver3 = docs[0].approver3;
							t_approver4 = docs[0].approver4;
							t_approver5 = docs[0].approver5;
							*/

							//  ----------------------------------------------------
							//  ---------------- inicio grabar resto del proceso

							console.log('Approvalscheme - t_aplevel :',t_aplevel);
							console.log('Approvalscheme - t_approver1  :',t_approver1 );
							console.log('Approvalscheme - t_approver2  :',t_approver2 );
							console.log('Approvalscheme - t_approver3  :',t_approver3 );
							console.log('Approvalscheme - t_approver4  :',t_approver4 );
							console.log('Approvalscheme - t_approver5  :',t_approver5 );

							console.log('------------------> Aprobó la validación')
							var output = 
							{ 	"error" : t_error, "message" : t_mensaje, "aplevel" : t_aplevel, 
								"approver1" : t_approver1, "approver2" : t_approver2, "approver3" : t_approver3,
								"approver4" : t_approver4, "approver5" : t_approver5 };
					    	//output["data"] = { "aplevel" : t_aplevel, "approver1" : t_approver1 };
					    	res.json(output)
						}
						else
						{
							console.log('----------Index------> 2 Esquema sin Area Aprobadora')
							var output = { "error" : true, "message" : "No puede grabar la factura. Esquema no tiene centro de costo" };
							console.log('-----Index Output------> :', output);
							res.json(output)
						}						
					}
					else
					{							
						console.log('----------Index------> 1 No existe esquema')
						var output = { "error" : true, "message" : "No puede grabar la factura. No tiene esquema definido" };
						console.log('-----Index Output------> :', output);
						res.json(output)
					}
				} 
			}); // Aggregation
		});


	// --------------------------------------------------
	//
	//    API exist_supplierinvoicenumber
	//
	// --------------------------------------------------
		router.get('/api/exist_supplierinvoicenumber', function(req, res, next) 

		{
			var action_returned = req.body.returnaction;
			console.log('invoice....... :'+action_returned);	

			var output = { "error" : true};



	  		console.log('---------------------------------------------------');
	  		console.log('/api/exist_supplierinvoicenumber         ----------');
	  		console.log('---------------------------------------------------');

			console.log('req.query.............. ....... :'+req.query);
			console.log('req.query.id........... ....... :'+req.query.id);			
			console.log('req.query.supplier..... ....... :'+req.query.supplier);	
			console.log('req.query.numdoc....... ....... :'+req.query.numdoc);
			console.log('req.query.crud_type.... ....... :'+req.query.crud_type);



			//Supplierinvoice.find({$and: [ 	{supplier : {$eq: req.query.supplier }}, 
			//								{documentnumber : {$eq: req.query.numdoc}} 
			//							]}
			Supplierinvoice.find({supplier : req.query.supplier, documentnumber : req.query.numdoc},
				function(err, docs)
				{

	            console.log("err:", err);
	            if (err)
	            {
					console.log('------------------> Error');
					console.log(err);
					var output = 
					{ 	"error" : true, "message" : err };
			    	//output["data"] = { "aplevel" : t_aplevel, "approver1" : t_approver1 };
			    	res.json(output)
	            }
	            //else
	            //{
	            if (req.query.crud_type == "NEW" )
	            {
		        	if (docs.length > 0)
		        	{
						console.log('---NEW--------> Rechazada validación');		            	
		            	console.log('Factura Repetid ID Distintos - docs :',docs);
	        			console.log(' 						 docs.length :',docs.length);
						console.log('					docs[0].supplier :', docs[0].supplier);
						var output = { 	"error" : true, "message" : "Factura Repetida", 
										"documentdate" : docs[0].documentdate,
										"documenttype" : docs[0].documenttype,
										"documentnumber" : docs[0].documentnumber,
										"netamount" : docs[0].netamountinvoice
									 };
				    	res.json(output)

		        	}
		        	else
		        	{
						console.log('---NEW--------> Aprobada validación');		            	
		            	console.log('No Existe Facturas');
						var output = { 	"error" : false, "message" : "Factura No esta Repetida"};
			    		res.json(output)
		        	}

	            }
	            else
	            {
			        if (docs.length > 0)
			        {
			            if (docs[0]._id == req.query.id)
			            {
							console.log('-MODIFICACION-> Aprobada validación');		            	
			            	console.log('No Existe Facturas');
							var output = { 	"error" : false, "message" : "Factura No esta repetida (ID=)"};
				    		res.json(output);	
			            }
				        else
				        {
							console.log('-MODIFICACIÓN-> Rechazada validación');		            	
			            	console.log('Factura Repetid ID Distintos - docs :',docs);
		        			console.log('docs.length :',docs.length);
							console.log('docs[0].supplier :', docs[0].supplier);
			            	console.log('docs[0]._id:',docs[0]._id);
			            	console.log('req.query.id:',req.query.id);							
							var output = { 	"error" : true, "message" : "Factura Repetida", 
											"documentdate" : docs[0].documentdate,
											"documenttype" : docs[0].documenttype,
											"documentnumber" : docs[0].documentnumber,											
											"netamount" : docs[0].netamountinvoice
										 };			            	
						    	res.json(output);
						}
					}
					else
					{							
						console.log('-MODIFICACION-> Aprobada validación');		            	
		            	console.log('No Existe Facturas');
						var output = { 	"error" : false, "message" : "Factura No esta repetida (Length=0)"};
			    		res.json(output);	
					}
				}					
				//} 
			}); // Aggregation
		});





// -----------------------------------
	//
	//    API exist_approvalschema bakup
	//      antes de unificar el find para multiple tablas
	// -----------------------------------
		router.get('/api/exist_approvalschema_backup', function(req, res, next) 

		{
			var action_returned = req.body.returnaction;
			console.log('invpice....... :'+action_returned);	

			var output = { "error" : true};



	  		console.log('-----------------------------------------------');
	  		console.log('/api/exist_approvalschema            ----------');
	  		console.log('-----------------------------------------------');

			console.log('req.query.............. ....... :'+req.query);
			console.log('req.query.costcenterice ....... :'+req.query.costcenter);	
			console.log('req.query.currency .... ....... :'+req.query.currency);
			console.log('req.query.amountinvoice ....... :'+req.query.amountinvoice);

			

			// +++++++++++++++++++++++++++++++++
			//    Buscar nivel de aprobación

			var t_aplevel = "";
			var t_approver1 = "";
			var t_approver2 = "";
			var t_approver3 = "";
			var t_approver4 = "";
			var t_approver5 = "";
			exist_approvalscheme = false;

	        console.log('Antes Approvallevels - req.body.amountinvoice:', req.query.amountinvoice);
	        console.log('Antes Approvallevels - req.body.currency:', req.query.currency);
			Approvallevels.find({$and: [ 	{valmin : {$lte: req.query.amountinvoice }}, 
											{valmax : {$gte: req.query.amountinvoice }}, 
											{currency : {$eq: req.query.currency}} 
										]} , function(err, docs)
			{

	            console.log("err:", err);
	            if (err)
	            {
					console.log('------------------> Error');
					console.log(err);
					var output = 
					{ 	"error" : true, "message" : err };
			    	//output["data"] = { "aplevel" : t_aplevel, "approver1" : t_approver1 };
			    	res.json(output)

	            }
	            if (docs)
	            {
		            console.log('Approvallevels - doc :',docs);
		            //console.log('Approvallevels - docs.length:', docs.length);
		            console.log('Approvallevels - err:', err);
		            console.log('Approvallevels - req.query.costcenter  :',req.query.costcenter);
		            var t_pos = req.query.costcenter.indexOf(':');
		            console.log('Approvallevels - t_pos :', t_pos);

		            var t_costcenter = req.query.costcenter.slice(0,t_pos).trim();

		            console.log('Approvallevels - req.query.costcenter.slice(0,t_pos).trim() :', t_costcenter );
		            var repite = true;
		            var output = { "error" : "vacio"}
					for (var i=0; i < docs.length; i++)
					{
		            	console.log('Approvallevels - i :',i);
		            	console.log('Approvallevels - doc[',i,'].aplevel :',docs[i].aplevel);

						Approvalscheme.find({ 	costcenter: new RegExp(t_costcenter), 
								  				aplevel : docs[i].aplevel}, function(err, docs1)
						{
		            		console.log('Approvalscheme docs1:',docs1);
		            		console.log('Approvalscheme - docs1.length :',docs1.length);            		
							// 	console.log('Approvalscheme - docs1[0].aplevel :',docs1[0].aplevel);  

		            		if (docs1.length > 0)
		            		{
		            			t_aplevel = docs1[0].aplevel;
		            			t_approver1 = docs1[0].approver1;
								t_approver2 = docs1[0].approver2;
								t_approver3 = docs1[0].approver3;
								t_approver4 = docs1[0].approver4;
								t_approver5 = docs1[0].approver5;

								i=1000;

								console.log('Approvalscheme: break',t_aplevel);

								//  ----------------------------------------------------
								//  ---------------- inicio grabar resto del proceso

								console.log('Approvalscheme - t_aplevel :',t_aplevel);
								console.log('Approvalscheme - t_approver1  :',t_approver1 );
								console.log('Approvalscheme - t_approver2  :',t_approver2 );
								console.log('Approvalscheme - t_approver3  :',t_approver3 );
								console.log('Approvalscheme - t_approver4  :',t_approver4 );
								console.log('Approvalscheme - t_approver5  :',t_approver5 );
								exist_approvalscheme = true;

								console.log('------------------> Aprobó la validación')
								var output = 
								{ 	"error" : false, "message" : "Encontré esquema", "aplevel" : t_aplevel, 
									"approver1" : t_approver1, "approver2" : t_approver2, "approver3" : t_approver3,
									"approver4" : t_approver4, "approver5" : t_approver5 };
						    	//output["data"] = { "aplevel" : t_aplevel, "approver1" : t_approver1 };
						    	res.json(output)
								
							}
							else
							{							
								console.log('----------Index------> 1 No existe esquema')
								var output = { "error" : true, "message" : "No tiene esquema definido" };
								console.log('-----Index Output------> :', output);
								res.json(output)
							} // if (docs1.length > 0)
						}); // Approvalscheme.find({ 	costcenter: new RegExp(t_costcenter), 
							//	  				aplevel : docs[i].aplevel}, function(err, docs1)

					} // for (var i=0; i < docs.length; i++)

					if (i == docs.length && output["error"] == "vacio")
					{
						console.log('----------Index------> 2 No existe esquema')
						console.log("(i = docs.length:",i, docs.length);
						console.log('output["error"]:',output["error"]);
						var output = { "error" : true, "message" : "No tiene esquema definido" };
				    	res.json(output)
			    	}

				} // (docs)

				//res.json(output);

			}); // Approvallevels.find({$and: [ 	{valmin : {$lte: req.body.amountinvoice }}, 
					//						{valmax : {$gte: req.body.amountinvoice }}, 
					//						{currency : {$eq: req.body.currency}} 
					//					]} , function(err, docs)
			//res.json(output);					
		});






	// -------------------------------------
	//      get api /api/approvalareas
	// -------------------------------------	
	router.get('/api/approvalareas', function(req, res, next) 
	{
		console.log('Entro en /api/approvalareas.........');
	   	Approvalareas.find({ approvalarea: { $exists: true } } , function(err, alldata)
		{
			console.log('Entro en /api/approvalarea... dentro de find');

			if (err)
			{
				console.log('api-error:',err);
				res.send(err);

			}

			console.log('alldata.size:',alldata.length);
			var totrec = alldata.length;
	//		console.log('totrec :',totrec);
		    var output = { "iTotalRecords" : totrec, "iTotalDisplayRecords" : 10 };
		    output["data"] = alldata;

	//		res.json(output);

					
			// Return all clients
	//		console.log(output);
			res.json(output);
		});

	});


	// -------------------------------------
	//      get api /api/suppliers
	// -------------------------------------	
	router.get('/api/suppliers', function(req, res, next) 
	{
		console.log('Entro en //api/suppliers.........');
	   	Suppliers.find({ codsupplier: { $exists: true } } , function(err, alldata)
		{
			console.log('Entro en /api/supplier... dentro de find');

			if (err)
			{
				console.log('api-error:',err);
				res.send(err);

			}

			console.log('alldata.size:',alldata.length);
			var totrec = alldata.length;
	//		console.log('totrec :',totrec);
		    var output = { "iTotalRecords" : totrec, "iTotalDisplayRecords" : 10 };
		    output["data"] = alldata;

	//		res.json(output);

					
			// Return all clients
	//		console.log(output);
			res.json(output);
		});

	});


	// -------------------------------------
	//      get api /api/cecos
	// -------------------------------------	
	router.get('/api/cecos', function(req, res, next) 
	{
		console.log('Entro en //api/cecos.........');
	   	Cecos.find({ ceco: { $exists: true } } , function(err, alldata)
		{
			console.log('Entro en /api/cecos.... dentro de find');

			if (err)
			{
				console.log('api-error:',err);
				res.send(err);

			}

			console.log('alldata.size:',alldata.length);
			var totrec = alldata.length;
	//		console.log('totrec :',totrec);
		    var output = { "iTotalRecords" : totrec, "iTotalDisplayRecords" : 10 };
		    output["data"] = alldata;

	//		res.json(output);

					
			// Return all clients
	//		console.log(output);
			res.json(output);
		});

	});


	// -------------------------------------
	//      get api /api/usersdm
	// -------------------------------------	
		router.get('/api/userdm', function(req, res, next) 
		{
			console.log('Entro en /api/userdm.........');
		   	User.find({ email: { $exists: true } } , function(err, alldata)
			{
				console.log('Entro en //api/userdm .. dentro de find');

				if (err)
				{
					console.log('api-error:',err);
					res.send(err);

				}

				console.log('alldata.size:',alldata.length);
				var totrec = alldata.length;
		//		console.log('totrec :',totrec);
			    var output = { "iTotalRecords" : totrec, "iTotalDisplayRecords" : 10 };
			    output["data"] = alldata;

		//		res.json(output);

						
				// Return all clients
		//		console.log(output);
				res.json(output);
			});

		});



	// -------------------------------------
	//      get api /api/approvallevels
	// -------------------------------------	
		router.get('/api/approvallevels', function(req, res, next) 
		{
			console.log('Entro en /api/approvalevels.........');
		   	Approvallevels.find({ aplevel: { $exists: true } } , function(err, alldata)
			{
				console.log('Entro en /api/approvalevels .. dentro de find');

				if (err)
				{
					console.log('api-error:',err);
					res.send(err);

				}

				console.log('alldata.size:',alldata.length);
				var totrec = alldata.length;
		//		console.log('totrec :',totrec);
			    var output = { "iTotalRecords" : totrec, "iTotalDisplayRecords" : 10 };
			    output["data"] = alldata;

		//		res.json(output);

						
				// Return all clients
		//		console.log(output);
				res.json(output);
			});

		});

	// -------------------------------------
	//      get api /api/approvalscheme
	// -------------------------------------	
		router.get('/api/approvalscheme', function(req, res, next) 
		{
			console.log('Entro en /api/approvalscheme.........');
		   	Approvalscheme.find({ aplevel: { $exists: true } } , function(err, alldata)
			{
				console.log('Entro en /api/approvalevels .. dentro de find');

				if (err)
				{
					console.log('api-error:',err);
					res.send(err);

				}

				console.log('alldata.size:',alldata.length);
				var totrec = alldata.length;
		//		console.log('totrec :',totrec);
			    var output = { "iTotalRecords" : totrec, "iTotalDisplayRecords" : 10 };
			    output["data"] = alldata;

		//		res.json(output);

						
				// Return all clients
		//		console.log(output);
				res.json(output);
			});

		});


	// ******************************************************
	//
	//      				API's Procesos
	//
	// ******************************************************


	// -------------------------------------
	//      get api /api/supplierinvoice
	// -------------------------------------	
	router.get('/api/supplierinvoice', function(req, res, next) 
	{

//	   	Supplierinvoice.find({ supplier: { $exists: true }, accountingdate: { $exists: true } } , function(err, alldata)
	   	Supplierinvoice.find({ supplier: { $exists: true } } , function(err, alldata)
		{
			if (err)
			{
				console.log('api-error:',err);
				res.send(err);

			}

	//		console.log('alldata.size:',alldata.length);
			var totrec = alldata.length;
	//		console.log('totrec :',totrec);
		    var output = { "iTotalRecords" : totrec, "iTotalDisplayRecords" : 10 };
		    output["data"] = alldata;

	//		res.json(output);

					
			// Return all clients
	//		console.log(output);
			res.json(output);
		});

	});


	// -------------------------------------
	//      get api /api/supplierinvoice_createby
	// -------------------------------------	
	router.get('/api/supplierinvoice_createby', function(req, res, next) 
	{

		console.log('/api/restUserAccount--------------');
		console.log('user_id', req.session.passport.user);
		var xn = 1;
	   	//var cond = "{ approver"+xn+": tmp) }";
		//console.log('cond:', cond);


		User.findById(req.session.passport.user, {id:1, email:1}, function(err, docs) 
		{
			if (err)
			{
				res.send(err);
			}
			console.log("docs.id:",docs.id);
			var t_email = docs.email;
			//console.log("docs.approver",current_approver);
			//console.log("docs.approver",docs[0].approver);
			//var id_string = docs.id.toString();
			console.log("t_email:",t_email);

		   	//Supplierinvoice.find({ approver4: new RegExp(tmp) } , function(err, alldata);
		   	Supplierinvoice.find({createdby : t_email}, function(err, alldata)
			{
				console.log('alldata:'+alldata);

				if (err)
				{
					console.log('api-error:',err);
					res.send(err);

				}
				console.log()

		//		console.log('alldata.size:',alldata.length);
				var totrec = alldata.length;
		//		console.log('totrec :',totrec);
			    var output = { "iTotalRecords" : totrec, "iTotalDisplayRecords" : 10 };
			    output["data"] = alldata;

		//		res.json(output);

						
				// Return all clients
		//		console.log(output);
				res.json(output);
			});

		});		

	});


	// -------------------------------------------------
	//      get api /api/supplierinvoice2approvers
	// -------------------------------------------------
	router.get('/api/supplierinvoice2approvers', function(req, res, next) 
	{

		console.log('/api/supplierinvoice2approvers--------------');
		console.log('user_id', req.session.passport.user);
		var xn = 1;
	   	var cond = "{ approver"+xn+": tmp }";
		console.log('cond:', cond);


		User.findById(req.session.passport.user, {email:1, accounts:1, approver:1}, function(err, docs) 
		{
			if (err)
			{
				res.send(err);
			}
			console.log("docs.approver: ",docs.approver);
			var current_approver = docs.approver.split(":")[0]+":";
			console.log("docs.approver",current_approver);
			//console.log("docs.approver",docs[0].approver);

		   	//Supplierinvoice.find({ approver4: new RegExp(tmp) } , function(err, alldata);
		   	Supplierinvoice.find({ $or: [
		   							{ $and: [{approver1 : docs.approver}, {release1 : "N"}] },
		   							{ $and: [{approver2 : docs.approver}, {release1 : "Y"}, {release2 : "N"}] },
		   							{ $and: [{approver3 : docs.approver}, {release1 : "Y"}, {release2 : "Y"}, {release3 : "N"}] },
		   							{ $and: [{approver4 : docs.approver}, {release1 : "Y"}, {release2 : "Y"}, {release3 : "Y"}, {release4 : "N"}] },
		   							{ $and: [{approver5 : docs.approver}, {release1 : "Y"}, {release2 : "Y"}, {release3 : "Y"}, {release4 : "Y"}, {release5 : "N"}] }

		   		]}, function(err, alldata)
			{
				console.log('alldata:'+alldata);

				if (err)
				{
					console.log('api-error:',err);
					res.send(err);

				}
				console.log()

		//		console.log('alldata.size:',alldata.length);
				var totrec = alldata.length;
		//		console.log('totrec :',totrec);
			    var output = { "iTotalRecords" : totrec, "iTotalDisplayRecords" : 10 };
			    output["data"] = alldata;

		//		res.json(output);

						
				// Return all clients
		//		console.log(output);
				res.json(output);
			});

		});		

//	   	Supplierinvoice.find({ supplier: { $exists: true }, accountingdate: { $exists: true } } , function(err, alldata)

	});



	// -------------------------------------------------
	//      get api /api/supplierinvoice2sent2sap
	// -------------------------------------------------
	router.get('/api/supplierinvoice2sent2sap', function(req, res, next) 
	{

		console.log('/api/supplierinvoice2sent2sap --------------');
		console.log('user_id', req.session.passport.user);
		var xn = 1;
	   	var cond = "{ approver"+xn+": tmp }";
		console.log('cond:', cond);

	   	//Supplierinvoice.find({ approver4: new RegExp(tmp) } , function(err, alldata);
	   	Supplierinvoice.find({ $and: [
	   							{ $or: [{release1 : "Y"}, {release1 : "#"}] },
	   							{ $or: [{release2 : "Y"}, {release2 : "#"}] },
	   							{ $or: [{release3 : "Y"}, {release3 : "#"}] },
	   							{ $or: [{release4 : "Y"}, {release4 : "#"}] },
	   							{ $or: [{release5 : "Y"}, {release5 : "#"}] }

	   		]}, function(err, alldata)
		{
			console.log('alldata:'+alldata);

			if (err)
			{
				console.log('api-error:',err);
				res.send(err);

			}
			console.log()

			// console.log('alldata.size:',alldata.length);
			var totrec = alldata.length;
			// console.log('totrec :',totrec);
		    var output = { "iTotalRecords" : totrec, "iTotalDisplayRecords" : 10 };
		    output["data"] = alldata;

			// res.json(output);

					
			// Return all clients
	//		console.log(output);
			res.json(output);
		});


//	   	Supplierinvoice.find({ supplier: { $exists: true }, accountingdate: { $exists: true } } , function(err, alldata)

	});


// -------------------------------------

//       RestDelUserSupplier

// -------------------------------------
router.get('/api/restDelUserSupplier/:id', function(req, res)
{

	var temp_id = req.params.id;
	 var marray = temp_id.split("&")

//	console.log("----------------------------");	

//	console.log("email:",marray[0]);
//	console.log("codsupplier:",marray[1]);
//	console.log("----------------------------");	




	//db.users.update({ email: "1@1.com" }, {$set:{ supplier: [{ codsupplier: "NUEVO01", name: "NOMBRENUEVO01"} ]}})

	//db.users.update({ email: "1@1.com" }, {$addToSet:{ supplier: { codsupplier: "NUEVO05", name: "NOMBRENUEVO05"} }})
	//db.users.update({email: "1@1.com"}, { $pull: {supplier: { codsupplier:"2018"}}})


 	User.update({ email: marray[0] }, 
 				{$pull:{ supplier: { codsupplier: marray[1]} }}, function(err, docs) 
	{
		if (err)
		{
			res.send(docs);
			console.log('Error en Eliminación:', err);
		}
				
		// Return all clients
		res.json(docs);
		console.log('Eliminación correcta');

	});
});



router.get('/api/restUpdateUser/:id', function(req, res)
{
	var temp_id = req.params.id;
	console.log("temp_id:", temp_id);

//db.users.update({ email: "1@1.com" }, {$set:{ supplier: [{ codsupplier: "NUEVO01", name: "NOMBRENUEVO01"} ]}})

   	User.update(temp_id, function(err, docs) 
	{
		if (err)
		{
			res.send(docs);
			console.log('Error en grabación:', err);
		}
				
		// Return all clients
		res.json(docs);
		console.log('Grabó bien');

	});
});


// ************************************************************************************


// -------------------------------------

//       RestGetCecobyCeco

// -------------------------------------
router.get('/api/restGetCecobyCeco/:id', function(req, res)
{

//	var temp_id =  '{codsupplier : ' + req.params.id + '}';
	var temp_id =  req.params.id.trim() ;

//	console.log("temp_id :",temp_id)


//   	Suppliers.find(temp_id, function(err, docs) 
   	Cecos.find({ceco :temp_id}, function(err, docs) 
	{
		if (err)
		{
			res.send(docs);
		}
				
		// Return all clients
//		console.log(docs);
		res.json(docs);
	});
});


router.get('/api/restGetAllCecos', function(req, res)
{
   	Cecos.find({}, function(err, alldata)
	{
		if (err)
		{
			res.send(err);
		}
				
		// Return all clients
		res.json(alldata);
	});
});




// -------------------------------------

//       RestDelSupplierInvoice

// -------------------------------------
router.get('/api/restDelSupplierInvoice/:id', function(req, res)
{

//	var temp_id =  '{codsupplier : ' + req.params.id + '}';
	var temp_id =  req.params.id.trim() ;

//	console.log("temp_id :",temp_id)


//   	Suppliers.find(temp_id, function(err, docs) 
   	Cecos.find({ceco :temp_id}, function(err, docs) 
	{
		if (err)
		{
			res.send(docs);
		}
				
		// Return all clients
//		console.log(docs);
		res.json(docs);
	});

		var temp_id = req.params.id;

		console.log("---------------------------------: ");

		// aquiestoydelete
		console.log("post /supplierInvoiceDelete/post_id : "+temp_id);

		// collection.deleteOne({_id: new mongodb.ObjectID('4d512b45cc9374271b00000f')});
		// Supplierinvoice.remove({_id: temp_id},{justOne: true,});

		console.log("Delete  --------------------------------: ");
        // Supplierinvoice.remove({_id: ObjectID("52b2f757b8116e1df2eb46ac")}, {safe: true}, function(err, result) {

        Supplierinvoice.remove({_id: temp_id}, {justOne: true, safe: true}, function(err, result) 
        {
            if (err) 
            {
				console.log("Error  --------------------------------: ");
                console.log(err);
                // throw err;
            }
			console.log("Result   --------------------------------: ");
            console.log(result);
        });

		console.log("after Delete  --------------------------------: ");




});


	// -------------------------------------

	//       Rest API Delete SupplierInvoice

	// -------------------------------------
	router.get('/api/deleteSupplierInvoice/:id', function(req, res)

	{

		//	var temp_id =  '{codsupplier : ' + req.params.id + '}';
		var temp_id =  req.params.id.trim() ;

		//	console.log("temp_id :",temp_id)

		var temp_id = req.params.id;

		console.log("---------------------------------: ");

		// aquiestoydelete
		console.log("get API /supplierInvoiceDelete/post_id : "+temp_id);

		// collection.deleteOne({_id: new mongodb.ObjectID('4d512b45cc9374271b00000f')});
		// Supplierinvoice.remove({_id: temp_id},{justOne: true,});

		console.log("Delete  --------------------------------: ");
        // Supplierinvoice.remove({_id: ObjectID("52b2f757b8116e1df2eb46ac")}, {safe: true}, function(err, result) {

        Supplierinvoice.remove({_id: temp_id}, {justOne: true, safe: true}, function(err, result) 
        {
            if (err) 
            {
				console.log("Error  --------------------------------: ");
                console.log(err);
       			res.send(err);


                // throw err;
            }
			console.log("Result   --------------------------------: ");
            console.log(result);
            res.send(result);

        });

		console.log("after Delete  --------------------------------: ");
	});





	// -----------------------------------
	//
	//    API exist_approvalschema
	//
	// -----------------------------------
	function exist_approvalschema(costcenter, currency, amountinvoice)
	{

	  		console.log('-----------------------------------------------');
	  		console.log('function exist_approvalschema            ----------');
	  		console.log('-----------------------------------------------');

			console.log('costcenter ....... :'+costcenter);	
			console.log('currency .... ....... :'+currency);
			console.log('amountinvoice ....... :'+amountinvoice);

			// +++++++++++++++++++++++++++++++++
			//    Buscar nivel de aprobación

			var t_aplevel = "";
			var t_approver1 = "";
			var t_approver2 = "";
			var t_approver3 = "";
			var t_approver4 = "";
			var t_approver5 = "";
			exist_approvalscheme = false;

	        console.log('Antes Approvallevels - req.body.amountinvoice:', amountinvoice);
	        console.log('Antes Approvallevels - req.body.currency:', currency);
			Approvallevels.find({$and: [ 	{valmin : {$lte: amountinvoice }}, 
											{valmax : {$gte: amountinvoice }}, 
											{currency : {$eq: currency}} 
										]} , function(err, docs)
			{

	            console.log('Approvallevels - doc :',docs);
	            //console.log('Approvallevels - docs.length:', docs.length);
	            console.log('Approvallevels - err:', err);
	            console.log('Approvallevels - req.query.costcenter  :',costcenter);
	            var t_pos = costcenter.indexOf(':');
	            console.log('Approvallevels - t_pos :', t_pos);

	            var t_costcenter = costcenter.slice(0,t_pos).trim();

	            console.log('Approvallevels - costcenter.slice(0,t_pos).trim() :', t_costcenter );
	            var repite = true;
				for (var i=0; i < docs.length; i++)
				{
	            	console.log('Approvallevels - i :',i);
	            	console.log('Approvallevels - doc[',i,'].aplevel :',docs[i].aplevel);

					Approvalscheme.find({ 	costcenter: new RegExp(t_costcenter), 
							  				aplevel : docs[i].aplevel}, function(err, docs1)
					{
	            		console.log('Approvalscheme docs1:',docs1);
	            		console.log('Approvalscheme - docs1.length :',docs1.length);            		
						// 	console.log('Approvalscheme - docs1[0].aplevel :',docs1[0].aplevel);  

	            		if (docs1.length > 0)
	            		{
	            			t_aplevel = docs1[0].aplevel;
	            			t_approver1 = docs1[0].approver1;
							t_approver2 = docs1[0].approver2;
							t_approver3 = docs1[0].approver3;
							t_approver4 = docs1[0].approver4;
							t_approver5 = docs1[0].approver5;

							i=100;

							console.log('Approvalscheme: break',t_aplevel);

							//  ----------------------------------------------------
							//  ---------------- inicio grabar resto del proceso

							console.log('Approvalscheme - t_aplevel :',t_aplevel);
							console.log('Approvalscheme - t_approver1  :',t_approver1 );
							console.log('Approvalscheme - t_approver2  :',t_approver2 );
							console.log('Approvalscheme - t_approver3  :',t_approver3 );
							console.log('Approvalscheme - t_approver4  :',t_approver4 );
							console.log('Approvalscheme - t_approver5  :',t_approver5 );
							exist_approvalscheme = true;

							console.log('------------------> Aprobó la validación')
							var output = { "error" : false, "message" : "Encontré esquema" };
					    	output["data"] = { "aplevel" : t_aplevel, "approver1" : t_approver1 };
							return output
						}
						else
						{							
							console.log('----------Index------> No existe esquema')
							var output = { "error" : false, "message" : "No tiene esquema definido" };
							console.log('-----Index Output------> :', output);
							return output
						} // if (docs1.length > 0)
					}); // Approvalscheme.find({ 	costcenter: new RegExp(t_costcenter), 
						//	  				aplevel : docs[i].aplevel}, function(err, docs1)
				} // for (var i=0; i < docs.length; i++)

				console.log('----------Index------> No existe esquema')
				var output = { "error" : false, "message" : "No tiene esquema definido" };
				console.log('-----Index Output------> :', output);

				return output;

			}); // Approvallevels.find({$and: [ 	{valmin : {$lte: req.body.amountinvoice }}, 
					//						{valmax : {$gte: req.body.amountinvoice }}, 
					//						{currency : {$eq: req.body.currency}} 
					//					]} , function(err, docs)

		};



	//---------------------------------------------------------
	//
	// Subir imagenes al servidor
	//
	//---------------------------------------------------------
	
	router.post('/upload', function(req, res)
	{

		console.log("/upload...");
		// creamos un objeto IncomingForm de formidable
		var form = new formidable.IncomingForm();

		console.log("1 form  :", form);
	 
		  // especificamos que queremos permitir al usuario subir varios archivos en un único request
		  form.multiples = true;
		 
		  // guardamos todos los archivos entrantes en la carpeta /uploads


		  //form.uploadDir = path.join(__dirname, '/uploads');
		  form.uploadDir = path.join(__dirname, '/../public/uploads');




		   console.log("2 form  :"+form.uploadDir);

		  //var tmp_id = form.get('id_doc');
		  //console.log("tmp_id :"+ tmp_id);
		  //});


		// cada vez que un archivo haya sido cargado con éxito, lo renombramos con su nombre original
		var tmp_id = 0;

		form.on('field', function(field, value) {
			console.log("a. field :", field);
			console.log("a. value :", value);
			tmp_id = value;

			console.log("tmp_id: "+tmp_id);
			var condition = {"_id": tmp_id}

			var schemaimg = [];

			form.on('file', function(field, file) 
			{
				//console.log("b. field :", field);
				//console.log("b. file :", file);
				
				// mueve el archivo al server
				console.log("1. Antes del rename");
				console.log("file.path:"+file.path);
				console.log("path.join(form.uploadDir, file.name):"+path.join(form.uploadDir, file.name));



				// Renombra al nombre original del archivo
				//fs.rename(file.path, path.join(form.uploadDir, file.name));

				// Renombra al ID del doc en mongodb
				//var new_filename = tmp_id+"."+file.name.split(".")[1];
				var new_filename = tmp_id+".jpg"; //+file.name.split(".")[1];
				var newfile = path.join(form.uploadDir, new_filename);
				console.log("2. newfile:"+newfile);


				fs.stat(newfile, function(err, stat) {
				    if(err == null) 
				    {
				        console.log('fs.stat -> File exists');
				        fs.unlink(newfile);
   				        console.log('fs.stat -> File exists despues de borrado');
				        fs.rename(file.path, newfile);
				        console.log('fs.stat -> File exists despues de renombrado');
				        //fs.rename(path.join(form.uploadDir, file.name), newfile);
				    } else if(err.code == 'ENOENT') 
				    {
				        // file does not exist
				        console.log('fs.stat -> File NO exists - err'+err);
	
				        //fs.rename(path.join(form.uploadDir, file.name), path.join(form.uploadDir, new_filename), function(err, stat) 
 						fs.rename(file.path, newfile, function(err, stat) 
				        {
					        console.log('------------------------------------');

						    if(err == null) 
						    {
						        console.log('Renombre Exitoso!');
						    } else 
						    {
						        // file does not exist
						        console.log('Renombre Error:', err);
						    }
				        });
				    } else 
				    {
				        console.log('Some other error - fs.stat: ', err.code);
				    }
				});




				/*

				var t_data = fs.readFileSync(path.join(form.uploadDir, new_filename));
				var t_contentType = 'image/png';

				console.log("Despues del readFileSync");
				
				schemaimg = {
								data: t_data,
								contentType : t_contentType
							};		

				console.log("Antes del find");	
				Supplierinvoice.find(condition, function (err, doc) 
				{  

					console.log("dentro del find");
					console.log("err...."+err);
					console.log("doc...."+doc);
				    // Handle any possible database errors
				    if (err) 
				    {
				    	console.log("No existe el Registro");
				        res.status(500).send(err);
				    } else 
				    {
				    	if (doc.length > 0) /// existe el doc y lo actualiza
				    	{		
				    		console.log("dentro de doc.length");
							//doc[0].imgfact.data = fs.readFileSync(req.body.inputimage);
							doc[0].imgfact = [];
							doc[0].imgfact.push(schemaimg);
							//doc[0].imgfact.contentType = 'image/jpeg';
							console.log("Antes de Grabar...");
							//++++++++++++++++++++++++++++
							//   Grabar modificaciones
							doc[0].save(function(err, result) 
							{
								console.log( "Grabando:", result, err );
								if(err) {
								    console.log("Error .." + err);
								}
								else
								{
									invoicesaved = true;
								    console.log("Actualización existosa " + result + "document!");		
							 	}
							}); 
						}
						//  ----------------fin grabar resto del proceso
						//  ----------------------------------------------------
					} // if (doc.length > 0)											
				}); // Supplierinvoice.find(condition, function (err, doc) 
				*/
			  });


		});

		  // Copia el archivo localmente en el servidor 		 
		  // cada vez que un archivo haya sido cargado con éxito, lo renombramos con su nombre original
		  /*
		  form.on('file', function(field, file) {
			console.log("b. field :", field);
			console.log("b. file :", file);

		    fs.rename(file.path, path.join(form.uploadDir, file.name));
		  });
		  */

	  	// Grabar el archivo en nodejs
	  	// cada vez que un archivo haya sido cargado con éxito, l
	  	//o renombramos con su nombre original




			console.log("3 form  :");
		 
		  // logueamos todos los errores que puedan ocurrir
		  form.on('error', function(err) {
		    console.log('Se ha producido un error: \n' + err);
		  });

			console.log("4 form  :");
		 
		  // una vez que todos los archivos hayan sido subidos, se envía una respuesta al usuario
		  form.on('end', function() {
		    res.end('success');
		  });
			console.log("5 form  :");

		 
		  // parseamos la petición entrante que contiene los datos del formulario
		  form.parse(req);
			console.log("6 form  :");

	});


	router.post('/upload1', function(req, res, next) {
		console.log("/upload1...");

	    var form = new formidable.IncomingForm();
		console.log("/upload1...2");

	    form.parse(req, function(err, fields, files) {
	        if (err) next(err);

			console.log("/upload1...3 files:"+files);
	        // TODO: make sure my_file and project_id exist    
	        fs.rename(files.name.path, fields.project_id, function(err) {
	            if (err) next(err);
	            res.end();
	        });
	    });
	});

	// Manejo de Imagenes
//	router.get("/images/:image", function(req,res) {




    //https://stackoverflow.com/questions/25091761/retrieving-posting-images-from-mongodb-mongoose

    // javascript how to know if jpg was saved correctly en mongodb

/*    
//	var testChamp = new Champion ({
//	    name: "aatrox.jpg",
//	    img: fs.readFileSync("D:/CounterMe/Aatrox_0.jpg"),
	    contentType: "image/jpg"
	});

*/

	// Mostrar Imagen

	router.get("/images", function(req,res) 
	{
		//var t_id = req.param.image;

		console.log("*******    -------/images---------------------");

		console.log('req.query.id........... ....... :'+req.query.id);			

		var t_id = req.query.id;

		console.log('mostrar imagen -> t_id :'+t_id );
	    //Supplierinvoiceimagen.findById(t_id, function(err,doc) 
	    Supplierinvoiceimagen.findById(t_id, function(err,doc) 

	    {
	    	if (err)
	    	{
	   			console.log("-------------------------");
	   			console.log("Error:",err);

	    		res.send("");
	    	}

   			console.log("doc imagen._id:",doc);
	    	/*

   			console.log("doc imagen:",doc.length);

			*/
	    	if (doc)
	    	{
	   			console.log("-------------------------");
	   			console.log("/images: Encontro Archivo",doc._id);
	   			console.log(" doc.contentType: ", doc.img_contentType);

		    	res.set("Content-Type", doc.img_contentType);
		    	res.send( doc.img_file );
	       	}
	       	else
	       	{
	   			console.log("-------------------------");
	   			console.log("/images: NO ENCONTRO Archivo");
		    	//res.set("Content-Type", doc.contentType);
	       	 	res.send("");
	       	}
	       



	    });
	});


	// Mostrar PDF

	router.get("/pdf", function(req,res) 
	{
		//var t_id = req.param.image;

		console.log("*******    -------/images---------------------");

		console.log('req.query.id........... ....... :'+req.query.id);			

		var t_id = req.query.id;

		console.log('mostrar imagen -> t_id :'+t_id );
	    //Supplierinvoiceimagen.findById(t_id, function(err,doc) 
	    Supplierinvoiceimagen.findById(t_id, function(err,doc) 

	    {
	    	if (err)
	    	{
	   			console.log("-------------------------");
	   			console.log("Error:",err);

	    		res.send("");
	    	}

   			console.log("doc imagen._id:",doc);
	    	/*

   			console.log("doc imagen:",doc.length);

			*/
	    	if (doc)
	    	{
	   			console.log("-------------------------");
	   			console.log("/pdf: Encontro Archivo",doc._id);
	   			console.log(" doc.contentType: ", doc.pdf_contentType);

		    	res.set("Content-Type", doc.pdf_contentType);
		    	res.send( doc.pdf_file );
	       	}
	       	else
	       	{
	   			console.log("-------------------------");
	   			console.log("/pdf: NO ENCONTRO Archivo");
		    	//res.set("Content-Type", doc.contentType);
	       	 	res.send("");
	       	}
	    });
	});


	//---------------------------------------------------------
	//
	// Subir imagenes al servidor
	//
	//---------------------------------------------------------
	
	router.post('/uploadimages', function(req, res)
	{

		console.log("/uploadimages...");
		// creamos un objeto IncomingForm de formidable
		var form = new formidable.IncomingForm();

		console.log("1 form  :", form);
	 
		// especificamos que queremos permitir al usuario subir varios archivos en un único request
		form.multiples = true;
		 
		// guardamos todos los archivos entrantes en la carpeta /uploads


		//form.uploadDir = path.join(__dirname, '/uploads');
		form.uploadDir = path.join(__dirname, '/../public/uploads');




		console.log("2 form  :"+form.uploadDir);

		//var tmp_id = form.get('id_doc');
		//console.log("tmp_id :"+ tmp_id);
		//});


		// cada vez que un archivo haya sido cargado con éxito, lo renombramos con su nombre original
		var tmp_id = 0;

		form.on('field', function(field, value) {
			console.log("a. field :", field);
			console.log("a. value :", value);
			tmp_id = value;

			console.log("tmp_id: "+tmp_id);
			var condition = {"_id": tmp_id}

			var schemaimg = [];

			form.on('file', function(field, file) 
			{
				//console.log("b. field :", field);
				//console.log("b. file :", file);
				
				// mueve el archivo al server
				console.log("1. Antes del rename");
				console.log("file.path:"+file.path);
				console.log("path.join(form.uploadDir, file.name):"+path.join(form.uploadDir, file.name));



				// Renombra al nombre original del archivo
				//fs.rename(file.path, path.join(form.uploadDir, file.name));

				// Renombra al ID del doc en mongodb
				//var new_filename = tmp_id+"."+file.name.split(".")[1];
				var new_filename = tmp_id+".jpg"; //+file.name.split(".")[1];
				var newfile = path.join(form.uploadDir, new_filename);
				console.log("2. newfile:"+newfile);

				//var t_data = fs.readFileSync(path.join(form.uploadDir, new_filename));
				//var t_data = fs.readFileSync(path.join(form.uploadDir, file.name));
				var t_data = fs.readFileSync(file.path);
				

				var t_contentType = 'image/png';

				console.log("Despues del readFileSync");

				var schemaimg = [];
				
				schemaimg = {
								_id : tmp_id,
								//"_id" : ObjectId("54bc1287c582714e9f062591")
							    img_name: "new_filename",
	    						//img: fs.readFileSync("D:/CounterMe/Aatrox_0.jpg"),
								img_file: t_data, 
								img_contentType: "image/jpg"
							};		


				console.log("Antes del find");	
				Supplierinvoiceimagen.update(condition, schemaimg,  {upsert: true}, function (err, result) 
				{  

					console.log("dentro del find");
					console.log("err...."+err);
					console.log("result...."+result);
				    // Handle any possible database errors
				    if (err) 
				    {
				    	console.log("No existe el Registro");
				        res.status(500).send(err);
				    } else 
				    {
								console.log( "Grabando:");
								invoicesaved = true;
							    console.log("Actualización existosa " + result + "document!");		
					} // if (doc.length > 0)											
				}); // Supplierinvoice.find(condition, function (err, doc) 
			  });


		});

		  // Copia el archivo localmente en el servidor 		 
		  // cada vez que un archivo haya sido cargado con éxito, lo renombramos con su nombre original
		  /*
		  form.on('file', function(field, file) {
			console.log("b. field :", field);
			console.log("b. file :", file);

		    fs.rename(file.path, path.join(form.uploadDir, file.name));
		  });
		  */

	  	// Grabar el archivo en nodejs
	  	// cada vez que un archivo haya sido cargado con éxito, l
	  	//o renombramos con su nombre original




			console.log("3 form  :");
		 
		  // logueamos todos los errores que puedan ocurrir
		  form.on('error', function(err) {
		    console.log('Se ha producido un error: \n' + err);
		  });

			console.log("4 form  :");
		 
		  // una vez que todos los archivos hayan sido subidos, se envía una respuesta al usuario
		  form.on('end', function() {
		    res.end('success');
		  });
			console.log("5 form  :");

		 
		  // parseamos la petición entrante que contiene los datos del formulario
		  form.parse(req);
			console.log("6 form  :");

	});


	//---------------------------------------------------------
	//
	// show /PDF al servidor
	//
	//---------------------------------------------------------

	router.get("/pdf", function(req,res) 
	{
		//var t_id = req.param.image;

		console.log("*******    -------/images---------------------");

		console.log('req.query.id........... ....... :'+req.query.id);			

		var t_id = req.query.id;

		console.log('mostrar imagen -> t_id :'+t_id );
	    //Supplierinvoiceimagen.findById(t_id, function(err,doc) 
	    Supplierinvoiceimagen.findById(t_id, function(err,doc) 

	    {
	    	if (err)
	    	{
	   			console.log("-------------------------");
	   			console.log("Error:",err);

	    		res.send("");
	    	}

   			console.log("doc imagen._id:",doc);
	    	/*

   			console.log("doc imagen:",doc.length);

			*/
	    	if (doc)
	    	{
	   			console.log("-------------------------");
	   			console.log("/images: Encontro Archivo",doc._id);
	   			console.log(" doc.contentType: ", doc.img_contentType);

		    	res.set("Content-Type", doc.img_contentType);
		    	res.send( doc.img_file );
	       	}
	       	else
	       	{
	   			console.log("-------------------------");
	   			console.log("/images: NO ENCONTRO Archivo");
		    	//res.set("Content-Type", doc.contentType);
	       	 	res.send("");
	       	}
	       



	    });
	});


	//---------------------------------------------------------
	//
	// Subir PDF al servidor
	//
	//---------------------------------------------------------
	
	router.post('/uploadPdf', function(req, res)
	{

		console.log("*** ----------------------------------------- ***");
		console.log("***            /uploadPdf...");
		console.log("*** ----------------------------------------- ***");

		// creamos un objeto IncomingForm de formidable
		var form = new formidable.IncomingForm();

		console.log("1 form  :", form);
	 
		// especificamos que queremos permitir al usuario subir varios archivos en un único request
		form.multiples = true;
		 
		// guardamos todos los archivos entrantes en la carpeta /uploads


		//form.uploadDir = path.join(__dirname, '/uploads');
		form.uploadDir = path.join(__dirname, '/../public/uploads');




		console.log("2 form  :"+form.uploadDir);

		//var tmp_id = form.get('id_doc');
		//console.log("tmp_id :"+ tmp_id);
		//});


		// cada vez que un archivo haya sido cargado con éxito, lo renombramos con su nombre original
		var tmp_id = 0;

		form.on('field', function(field, value) {
			console.log("a. field :", field);
			console.log("a. value :", value);
			tmp_id = value;

			console.log("tmp_id: "+tmp_id);
			var condition = {"_id": tmp_id}

			var schemaimg = [];

			form.on('file', function(field, file) 
			{
				//console.log("b. field :", field);
				//console.log("b. file :", file);
				
				// mueve el archivo al server
				console.log("1. Antes del rename");
				console.log("file.path:"+file.path);
				console.log("path.join(form.uploadDir, file.name):"+path.join(form.uploadDir, file.name));



				// Renombra al nombre original del archivo
				//fs.rename(file.path, path.join(form.uploadDir, file.name));

				// Renombra al ID del doc en mongodb
				//var new_filename = tmp_id+"."+file.name.split(".")[1];
				var new_filename = tmp_id+".pdf"; //+file.name.split(".")[1];
				var newfile = path.join(form.uploadDir, new_filename);
				console.log("2. newfile:"+newfile);

				//var t_data = fs.readFileSync(path.join(form.uploadDir, new_filename));
				//var t_data = fs.readFileSync(path.join(form.uploadDir, file.name));
				var t_data = fs.readFileSync(file.path);
				

				var t_contentType = 'image/png';

				console.log("Despues del readFileSync");

				var schemaimg = [];
				
				schemaimg = {
								_id : tmp_id,
								//"_id" : ObjectId("54bc1287c582714e9f062591")
							    pdf_name: "new_filename",
	    						//img: fs.readFileSync("D:/CounterMe/Aatrox_0.jpg"),
								pdf_file: t_data, 
								pdf_contentType: "application/pdf"
							};		


				console.log("Antes del find");	
				Supplierinvoiceimagen.update(condition, schemaimg,  {upsert: true}, function (err, result) 
				{  

					console.log("dentro del find");
					console.log("err...."+err);
					console.log("result...."+result);
				    // Handle any possible database errors
				    if (err) 
				    {
				    	console.log("No existe el Registro");
				        res.status(500).send(err);
				    } else 
				    {
								console.log( "Grabando:");
								invoicesaved = true;
							    console.log("Actualización existosa " + result + "document!");		
					} // if (doc.length > 0)											
				}); // Supplierinvoice.find(condition, function (err, doc) 
			  });


		});

		  // Copia el archivo localmente en el servidor 		 
		  // cada vez que un archivo haya sido cargado con éxito, lo renombramos con su nombre original
		  /*
		  form.on('file', function(field, file) {
			console.log("b. field :", field);
			console.log("b. file :", file);

		    fs.rename(file.path, path.join(form.uploadDir, file.name));
		  });
		  */

	  	// Grabar el archivo en nodejs
	  	// cada vez que un archivo haya sido cargado con éxito, l
	  	//o renombramos con su nombre original




			console.log("3 form  :");
		 
		  // logueamos todos los errores que puedan ocurrir
		  form.on('error', function(err) {
		    console.log('Se ha producido un error: \n' + err);
		  });

			console.log("4 form  :");
		 
		  // una vez que todos los archivos hayan sido subidos, se envía una respuesta al usuario
		  form.on('end', function() {
		    res.end('success');
		  });
			console.log("5 form  :");

		 
		  // parseamos la petición entrante que contiene los datos del formulario
		  form.parse(req);
			console.log("6 form  :");

	});




//  como llamar al restfull desde arriba
//  
//    	http://localhost:3000/api/restGetAllSupplier
//    	http://localhost:3000/api/restGetOneSupplierInvoice/5794e0cfe3dbbb2011c04bb2
// 		5794e0cfe3dbbb2011c04bb2

module.exports = router;

function isAdmin(req, res, next) {
    console.log("---------   isAdmin ------:");

	console.log('user_id', req.session.passport.user);
	User.findById(req.session.passport.user, {email:1, administrator:1}, function(err, docs) 
	{
		console.log("-------------------------------:",docs);		
		console.log("Administrator:",docs.administrator);
		console.log("docs.hasOwnProperty(administrator):",docs.hasOwnProperty('administrator'));
		if (err) 
		{
			return done(err);
		}
		if ("administrator" in docs)
		{ 
			console.log("Tiene el objeto administrador");				

			if (docs.administrator == "S") 
			{
				console.log("administrador valor de S");					
		        return next();
			}
			else
			{
		  		req.flash('error', "No Tiene Acceso. Función solo para Administradores (1)");
		  		res.redirect('/');		        
			}
		}
		else
		{
  		  req.flash('error', "No Tiene Acceso. Función solo para Administradores (2)");
  		  res.redirect('/');
		}
	});
};  

function isInvoiceLoader(req, res, next) {
    console.log("---------   isInvoiceLoader ------:");

	console.log('user_id', req.session.passport.user);
	User.findById(req.session.passport.user, {email:1, administrator:1, invoiceloader:1}, function(err, docs) 
	{
		console.log("-------------------------------:",docs);		
		console.log("invoiceloader:",docs.invoiceloader);
		console.log("docs.hasOwnProperty(invoiceloader):",docs.hasOwnProperty('invoiceloader'));
		if (err) 
		{
			return done(err);
		}
		if ("invoiceloader" in docs && "administrator" in docs)
		{ 
			console.log("Tiene el objeto invoiceloader");				

			if (docs.invoiceloader == "S" || docs.administrator == "S") 
			{
				console.log("invoiceloaderdor or administrator valor de S");					
		        return next();
			}
			else
			{
		  		req.flash('error', "No Tiene Acceso. Función solo para Admin o Cargadores de Facturas (1)");
		  		res.redirect('/');		        
			}
		}
		else
		{
  		  req.flash('error', "No Tiene Acceso. Función solo para Admin Cargadores de Facturas (2)");
  		  res.redirect('/');
		}
	}); 
};

function isAcounting(req, res, next) {
    console.log("---------   isAccounting  ------:");

	console.log('user_id', req.session.passport.user);
	User.findById(req.session.passport.user, {email:1, administrator:1, accounting:1}, function(err, docs) 
	{
		console.log("-------------------------------:",docs);		
		console.log("accounting:",docs.accounting);
		console.log("docs.hasOwnProperty(accounting):",docs.hasOwnProperty('accounting'));
		if (err) 
		{
			return done(err);
		}
		if ("accounting" in docs && "administrator" in docs)
		{ 
			console.log("Tiene el objeto accounting");				

			if (docs.accounting == "S" || docs.administrator == "S") 
			{
				console.log("accounting or administrator valor de S");					
		        return next();
			}
			else
			{
		  		req.flash('error', "No Tiene Acceso. Función solo para Adminn o Contable (1)");
		  		res.redirect('/');		        
			}
		}
		else
		{
  		  req.flash('error', "No Tiene Acceso. Función solo para Adminn o Contable (2)");
  		  res.redirect('/');
		}
	}); 
};

