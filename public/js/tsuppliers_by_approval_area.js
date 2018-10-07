    $(document).ready(function () 
    {   

        // ------------------------------------
        //         Actitate table Supply
        // -----------------------------------
        var oTable =  $('#tsuppliers_by_approval_area').DataTable(
        {
            "pagingType": "full_numbers",
            "processing": true,

//            "serverSide": false,

//           "searching": true,
//            "bLengthChange": false,
//             dom: 'Bfrtip',
            "language": {
                            "url": "//cdn.datatables.net/plug-ins/1.10.13/i18n/Spanish.json"
                        },
            "dataSrc": "data",
            //"data": "aula=parametro",            
            "ajax": 
                {
                    "url": "/api/restGetAllSupplier_by_approval_area",
                    "type": "GET"
                },
            "columns": 
                [
                    { "title":"Código","data": "codsupplier" },
                    { "title":"Nombre","data": "name" },                    
                ]
        });


        // ------------------------------------
        //         #ts tbody CLICK
        // -----------------------------------
        $('#tsuppliers_by_approval_area tbody').on( 'click', 'tr', function () 
        {
            var data = oTable.row( this ).data();
//            alert("data : "+data["codsupplier"]);
            $("#modal-suppliers").modal('hide');         
            


            //var oTable1 = $('#tconcepts').DataTable();

            //oTable1.ajax.reload( null, false )           
//            alert( 'You clicked on '+data["ceco"]+'\'s row' );
//            saveRow( data );

            var table = $('#tsuppliers_by_approval_area').DataTable();
            if (table.cell( $("#currentRow").val(), 1).data())
            {
                var t_texto =  data["codsupplier"] + ":";
                t_texto =  t_texto.concat(data["name"])
                //tval = '<label>'+tval + '</>';                
                console.log('------------> t_texto: '+t_texto);
                var tval =   '<a href="#" data-toggle="modal" data-target=".modal-suppliers">'+t_texto+ 
                            '<input type="text" name="supplier" id="supplier" '+
                            ' value='+t_texto+' hidden="true"></a>';  
                /*
                  var tval =  '<input type="text" class="form-control separate-bottom" readonly="readonly" '+ 
                              'placeholder="indique la Cuenta" name="accountcode" id="accountcode" '+
                              ' value="'+data["account"]+':'+data["description"]+'" /><span class="input-group-addon">'+
                              '<a href="#" data-toggle="modal" data-target=".modal-accounts">'+
                              '<span class="fa fa-external-link"></a></span>'         
                */                
                table.cell( $("#currentRow").val(), 1).data(tval);
            }
            else
            {

                $("#supplier").val(data["codsupplier"]+":"+data["name"]);

            }


        });
    });
