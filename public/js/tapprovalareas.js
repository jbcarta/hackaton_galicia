    $(document).ready(function () 
    {   

        // ------------------------------------
        //         Actitate table Supply
        // -----------------------------------
        var otapprovalareas =  $('#tapprovalareas').DataTable(
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
                    "url": "/api/restPostApprovalAreasField",
                    "type": "GET"
                },
            "columns": 
                [
                    { "title":"Area Aprob.","data": "approvalarea" },
                    { "title":"Descripción","data": "description" }
                ]
        });


        // ------------------------------------
        //         #ts tbody CLICK
        // -----------------------------------
        $('#tapprovalareas tbody').on( 'click', 'tr', function () 
        {
            var data = otapprovalareas.row( this ).data();
            // alert("data : "+data["codsupplier"]);
            $("#modal-approvalareas").modal('hide');         
            // $("#account").val(data["account"]+":"+data["description"]);


            // supplierinvoice_create.hbs
            // supplierinvoice_edit.hbs            
            var table = $('#tdetail').DataTable();
            if (table.cell( $("#currentRow").val(), 3).data())
            {
//                var t_texto = data["account"]+':'+data["description"];
                var t_texto = data["approvalarea"]; //+':'+data["description"];
                console.log('------------> t_texto:'+t_texto);
                var tval =  '<input type="text" class="form-control separate-bottom" readonly="readonly" '+ 
                            'placeholder="indique el Area" name="approvalareas" id="approvalareas" '+
                            ' value="'+data["approvalarea"]+':'+data["description"]+'"| /><span class="input-group-addon">'+
                            '<a href="#" data-toggle="modal" data-target=".modal-approvalareas">'+
                            '<span class="fa fa-external-link"></a></span>'

                table.cell( $("#currentRow").val(), 3).data(tval);
            }

            // userdm_create.hbs
            // userdm_edit.hbs
            console.log('------------> antes t_texto:'+data["approvalarea"]+':'+data["description"]);
            var table = $('#tapprovalarea').DataTable();
            if (table.cell( $("#currentRow").val(), 1).data())
            {
                var t_texto =  data["approvalarea"] + ":";
                t_texto =  t_texto.concat(data["description"])
                //tval = '<label>'+tval + '</>';                
                console.log('------------> t_texto: '+t_texto);
               var tval =   '<a href="#" data-toggle="modal" data-target=".modal-approvalareas">'+data["approvalarea"]+':'+data["description"]+ 
                            '<input type="text" name="approvalarea" id="approvalarea" '+
                            ' value='+data["approvalarea"]+':'+data["description"]+' hidden="true"></a>';  

                /*
                  var tval =  '<input type="text" class="form-control separate-bottom" readonly="readonly" '+ 
                            'placeholder="indique la Cuenta" name="accountcode" id="accountcode" '+
                            ' value="'+data["account"]+':'+data["description"]+'" /><span class="input-group-addon">'+
                            '<a href="#" data-toggle="modal" data-target=".modal-accounts">'+
                            '<span class="fa fa-external-link"></a></span>'         
                */
                
                table.cell( $("#currentRow").val(), 1).data(tval);
            }
        });
    });
