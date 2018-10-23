    $(document).ready(function () 
    {   

        // ------------------------------------
        //         Actitate table Country
        // -----------------------------------
        var oTable =  $('#tcountry').DataTable(
        {
            "pagingType": "full_numbers",
            "processing": true,
            "language": {
                          "url": "//cdn.datatables.net/plug-ins/1.10.13/i18n/Spanish.json"
                        },
            "serverSide": false,
            dom: 'Blfrtip',
            //  dom: 'B<"clear">lfrtip',            
            buttons: [
                    'colvis',
                    'excel',
                    'print'
                ],       

            //  "searching": true,
            //  "bLengthChange": false,
            //  dom: 'Bfrtip',
            "dataSrc": "data",
            "ajax": 
                {
                    "url": "/api/countries",
                    "type": "GET"
                },
            "columns": 
                [
                    //{ "title":"ID","data": "_id"},                
                    { "title":"Pais","data": "country", "defaultValue": null }
                    /* ,
                    { "title":"Descripción","data": "description", "defaultValue": null }
                    */
                ]
        });

        // ------------------------------------
        //         #ts tbody CLICK
        // -----------------------------------
        $('#tcountry tbody').on( 'click', 'tr', function () 
        {

            var data = oTable.row( this ).data();
            //  alert("data : "+data["supplier"]);

            $("#modal-country").modal('hide');         
            $("#country").val(data["country"]);

        });
    });
