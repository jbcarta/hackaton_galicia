    $(document).ready(function () 
    {   

        // ------------------------------------
        //         Actitate table Supply
        // -----------------------------------
        var otUaa =  $('#tuseraa').DataTable(
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
            "ajax": 
                {
                    "url": "/api/restUserAA",
                    "type": "GET"
                },
            "columns": 
                [
                    { "title":"Area Aprobadora","data": "approvalarea" }
                ]
        });

        // ------------------------------------
        //         #ts tbody CLICK
        // -----------------------------------
        $('#tuseraa tbody').on( 'click', 'tr', function () 
        {
            var data = otUaa.row( this ).data();
            // alert("data : "+data["codsupplier"]);
            $("#modal-approvalarea").modal('hide');         
            // $("#costcenter").val(data["ceco"]+":"+data["description"]);
           
             $("#approvalarea").val(data["approvalarea"]);

        });

});