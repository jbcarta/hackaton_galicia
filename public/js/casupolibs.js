// casupolibs.js

        // ------------------------------------
        //         transport_2_number()
        // -----------------------------------
        function transform_2_number(valor_2_convert)
        {

            // en el replace /,/g significa reemplaza todas las ocurrencias!!
            var numreturn = parseFloat(valor_2_convert.replace(/,/g,"")).toFixed(2);

            //alert('Valor Numerico: '+num);
            //alert('Valor Numerico: '+parseFloat(num).toFixed(2));  
            numreturn = Number(numreturn);
            return numreturn;

        }

        // ------------------------------------
        //         transport_2_formatnumber()
        // -----------------------------------
        function transform_2_formatnumber(valor_2_convert, currency_sign)
        {
            // en el replace /,/g significa reemplaza todas las ocurrencias!!
            if (currency_sign)
            {
                var numreturn = parseFloat(valor_2_convert).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + " $";
            }
            else
            {
                var numreturn = parseFloat(valor_2_convert).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
            }

            //alert('Valor Numerico: '+num);
            //alert('Valor Numerico: '+parseFloat(num).toFixed(2));  
            return numreturn;

        } 

        // ------------------------------------
        //       getDateTime_asString()
        // -----------------------------------

        function getDateTime_asString() 
        {
            var date = new Date();

            var hour = date.getHours();
            hour = (hour < 10 ? "0" : "") + hour;

            var min  = date.getMinutes();
            min = (min < 10 ? "0" : "") + min;

            var sec  = date.getSeconds();
            sec = (sec < 10 ? "0" : "") + sec;

            var year = date.getFullYear();

            var month = date.getMonth() + 1;
            month = (month < 10 ? "0" : "") + month;

            var day  = date.getDate();
            day = (day < 10 ? "0" : "") + day;

            return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;
        }