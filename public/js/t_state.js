    $(document).ready(function () 
    {   

        var tmp_state = $("#state").val();
        alert(tmp_state);
        // ------------------------------------
        //         Actitate table Country
        // -----------------------------------
        var oTable =  $('#tstate').DataTable(
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
                    "url": "/api/states/",
                    "type": "GET",
                    data:  {xcountry: $("#state").val()} //tmp_state}
                },
            "columns": 
                [
                    { "title":"Pais","data": "country"},                
                    { "title":"Provincia","data": "state", "defaultValue": null }
                    /* ,
                    { "title":"Descripción","data": "description", "defaultValue": null }
                    */
                ]
        });

        // ------------------------------------
        //         #ts tbody CLICK
        // -----------------------------------
        $('#tstate tbody').on( 'click', 'tr', function () 
        {

            var data = oTable.row( this ).data();
//            alert("data : "+data["supplier"]);

            $("#modal-state").modal('hide');         
            $("#state").val(data["state"]);

        });
    });
