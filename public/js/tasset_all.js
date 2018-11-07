    $(document).ready(function () 
    {   
        
        /*

        if ($(#message_err).val())
        {
            $.toaster({ priority : 'warning', title : 'Title',  message: $(#message_err).val()});
        }
        */
              
        // ------------------------------------
        //         Actitate table Supply
        // -----------------------------------
        var oTable =  $('#tasset').DataTable(
        {
            "pagingType": "full_numbers",
            "processing": true,
            "language": {
                          "url": "//cdn.datatables.net/plug-ins/1.10.13/i18n/Spanish.json"
                        },
            "serverSide": false,
            dom: 'Blfrtip',
//            dom: 'B<"clear">lfrtip',            
             buttons: [
                    'colvis',
                    'excel',
                    'print'
                ],       

//           "searching": true,
//            "bLengthChange": false,
//             dom: 'Bfrtip',
            "dataSrc": "data",
            "ajax": 
                {
                    "url": "/api/assetlist", 
                    "type": "GET"
                },
            "columns": 
                [
                    //{ "title":"ID","data": "_id"},                
                    { "title":"Tipo","data": "asset_type", "defaultValue": null },
                    { "title":"Fundada","data": "year_foundation", "defaultValue": null },                    
                    { "title":"Activo Reg.Banco","data": "asset_bank_registre", "defaultValue": null },
                    { "title":"Prop.Reg.Banco","data": "owner_bank_register", "defaultValue": null },
                    { "title":"País","data": "country", "defaultValue": null },
                    { "title":"Provincia","data": "state", "defaultValue": null },                    
                    { "title":"Hectáreas","data": "surface_total", "defaultValue": null },
                    { "title":"Hect.Cosechable","data": "surface_agricultura", "defaultValue": null },
                    { "title":"Producto","data": "products", "defaultValue": null },
                    { "title":"Periodo","data": "period", "defaultValue": null },                        
                    { "title":"Tipo Agric.","data": "agricultural_system", "defaultValue": null },
                    { "title":"H.Sembradas","data": "surface_planted", "defaultValue": null },
                    { "title":"Ton.Cosechadas","data": "tons_harvested", "defaultValue": null },
                    { "title":"Ingreso Bruto","data": "income_gross", "defaultValue": null },         
                    { "title":"Ingreso Neto","data": "income_net", "defaultValue": null }                            

                ]
        });

        // ------------------------------------
        //         #ts tbody CLICK
        // -----------------------------------
        $('#tasset tbody').on( 'click', 'tr', function () 
        {

            var data = oTable.row( this ).data();
//            alert("data : "+data["supplier"]);

            xcodsup = data["supplier"].split(':')[0];
            xid = data["_id"];

            document.body.innerHTML += '<form id="dynForm" action="/supplierInvoice2release_view" method="post"><input type="hidden" name="post_id" value="'+xid+'"></form>';
            document.getElementById("dynForm").submit();


        });              
              
    });