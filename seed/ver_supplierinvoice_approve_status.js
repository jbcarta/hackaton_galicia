//var mongo = require('mongodb');
var mongoose = require('mongoose');
var Supplierinvoice = require('../models/supplierinvoice');


var settings_MongoServer = 'mongodb://invoice:Inv.1984@admapps01:27017/invoice2pay';


console.log(settings_MongoServer);


// para usar con internet servidor de claxson
  // mongoose.connect('mongodb://invoice:Inv.1984@admapps01:27017/invoice2pay');

mongoose.connect(settings_MongoServer);



	Supplierinvoice.find({ supplier: { $exists: true } } , function(err, alldata)
	{  
		console.log("err........"+err);
		console.log("alldata...."+alldata);
	    // Handle any possible database errors
	    if (err) 
	    {
	    	console.log("No existe el Registro");
	        res.status(500).send(err);
	    } 
	    else 
	    {
	    	if (alldata.length > 0) /// existe el doc y lo actualiza
	    	{
				for (var i = 0; i < alldata.length; i++) 
				{
					console.log(alldata[i].supplier,alldata[i].documentnumber);
					console.log(alldata[i].approver1,alldata[i].release1);
					console.log(alldata[i].approver2,alldata[i].release2);
					console.log(alldata[i].approver3,alldata[i].release3);
					console.log(alldata[i].approver4,alldata[i].release4);
					console.log(alldata[i].approver5,alldata[i].release5);

				}
				//  ----------------fin grabar resto del proceso
				//  ----------------------------------------------------
	    	} 	
	    }
	});



				    		/*

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
/*
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
*/			

							// ++++++++++++++++++++++
							// 		Agregar taxes
			/*
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
*/
							//++++++++++++++++++++++++++++
							//   Grabar modificaciones
						/*
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
							*/
										
