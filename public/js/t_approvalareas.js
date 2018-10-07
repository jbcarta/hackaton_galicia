    $(document).ready(function () 
    {   

        // ------------------------------------
        //         Actitate table Supply
        // -----------------------------------
        var oTable =  $('#t_approvalareas').DataTable(
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
                    "url": "/api/restPostApprovalareaField",
                    "type": "GET"
                },
            "columns": 
                [
                    //{ "title":"ID","data": "_id"},                
                    { "title":"approvalarea","data": "approvalarea" },
                    { "title":"Descripción","data": "description" }
                ]
        });

        // ------------------------------------
        //         #ts tbody CLICK
        // -----------------------------------
        $('#t_approvalareas tbody').on( 'click', 'tr', function () 
        {

            var data = oTable.row( this ).data();
            //alert("data : "+data["approvalarea"]);

            $("#modal-approvalareas").modal('hide');         
            $("#approvalarea").val(data["approvalarea"]+":"+data["description"]);

            $("#approvalareas").val(data["approvalarea"]+":"+data["description"]);

        });
    });
