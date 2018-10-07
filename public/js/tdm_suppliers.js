    $(document).ready(function () 
    {   
        var xtmp = '<a href="/supplierinvoice_add" class="btn btn-success pull-left" role="button">A</a>';

        // ------------------------------------
        //         Actitate table Supply
        // -----------------------------------
        var oTable =  $('#tdm_suppliers').DataTable(
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
                    "url": "/api/suppliers",
                    "type": "GET"
                },
            "columns": 
                [
                    { "title":"ID","data": "_id"},                
                    { "title":"Cod.Prov","data": "codsupplier", "defaultValue": null },
                    { "title":"Name","data": "name", "defaultValue": null }
                ]
        });

        // ------------------------------------
        //         #ts tbody CLICK
        // -----------------------------------
        $('#tdm_suppliers tbody').on( 'click', 'tr', function () 
        {

            var data = oTable.row( this ).data();
//            alert("data : "+data["supplier"]);

            xcod = data["codsupplier"].split(':')[0];
            xid = data["_id"];
            console.log('data["_id"]:'+xid);

            document.body.innerHTML += '<form id="dynForm" action="/suppliers_edit" method="post"><input type="hidden" name="post_id" value="'+xid+'"></form>';
            document.getElementById("dynForm").submit();

        });
    });
