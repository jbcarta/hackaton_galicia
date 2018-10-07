    $(document).ready(function () 
    {   

        // ------------------------------------
        //         Actitate table 
        // -----------------------------------
        var oTable =  $('#t_accounts').DataTable(
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
                    "url": "/api/restPostaccountsField",
                    "type": "GET"
                },
            "columns": 
                [
                    //{ "title":"ID","data": "_id"},                
                    { "title":"account","data": "account" },
                    { "title":"Descripción","data": "description" }
                ]
        });

        // ------------------------------------
        //         #ts tbody CLICK
        // -----------------------------------
        $('#t_accounts tbody').on( 'click', 'tr', function () 
        {

            var data = oTable.row( this ).data();
//            alert("data : "+data["supplier"]);

            $("#modal-costcenter").modal('hide');         
            $("#costcenter").val(data["account"]+":"+data["description"]);

        });
    });
