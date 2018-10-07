var i2p_functions = exports = module.exports = {};


i2p_functions.getuseremail =
i2p_functions.getUseremail = function(user, options, done) 
    {
        console.log("---------   get_useremail  ------:",);
        User.findById(req.session.passport.user, {email:1}, function(err, docs) 
        {
            if (err)
            {
                return "NOUSER";
            }
            console.log("docs.id:",docs.id);
            var t_email = docs.email;
            //console.log("docs.approver",current_approver);
            //console.log("docs.approver",docs[0].approver);
            //var id_string = docs.id.toString();
            console.log("t_email:",t_email);
            return email;
        });  
    };
