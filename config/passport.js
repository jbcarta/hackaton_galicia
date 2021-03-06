var passport = require('passport');
var User = require('../models/user');
var localStrategy = require('passport-local').Strategy;


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
	User.findById(id, function(err, user){
		done(err, user.id);
	});
});



passport.use('local.signup', new localStrategy({
	usernameField: 'email',
	passwordField: 'password',
    nameField: 'name',
	passReqToCallback: true
	}, function(req, email, password, done) {

			req.checkBody('email', 'Invalid email1').notEmpty().isEmail();
			req.checkBody('password', 'Invalid password').notEmpty().isLength({min:4});
			var errors = req.validationErrors();

			if (errors) {
				var messages = [];
				errors.forEach(function(error) {
					messages.push(error.msg);
				});
				return done(null, false, req.flash('error', messages));
			}
			User.findOne({'email': email}, function(err, user) 
			{
				console.log("FindOne.error:",err);
				console.log("findOne.user:",user);		
				if (err) {
					alert("err:"+err);
					return done(err);
				}
				if (user) {
					console.log("user +email ya existe");					
					return done(null, false, {message: 'Email is already in use.'});
				}
				var newUser = new User();
				newUser.email = email;
				//newUser.name = name;

				console.log("newUser.password:",newUser.password);

				newUser.password = newUser.encryptPassword(password);
				console.log("newUser.passwordEncrypt:",newUser.password);
		
				newUser.save(function(err, result) {
					console.log("newUser.save.error:",err);
					console.log("newUser.save.result:",result);
					console.log("newUser: ",newUser);

					if (err) {
						return done(err);
					}
					return done(null, newUser);
			});
	});

}));

passport.use('local.signin', new localStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true},
	function(req, email, password, done){
			req.checkBody('email', 'Invalid email').notEmpty().isEmail();
			req.checkBody('password', 'Invalid password').notEmpty();
			var errors = req.validationErrors();
			if (errors) {
				var messages = [];
				errors.forEach(function(error) {
					messages.push(error.msg);
				});
				return done(null, false, req.flash('error', messages));
			}
			User.findOne({'email': email}, function(err, user) {
			console.log("FindOne.error:",err);
			console.log("findOne.user:",user);		
			if (err) {
				return done(err); 
			}
			console.log("despues error");				
			if (!user) {
				return done(null, false, {message: 'No user found.'});
			}
			console.log("despues !user");				
            console.log("password:", password);	
			if (!user.validPassword(password)){
				console.log("despues de !user.validPassword(password)")
				return done(null, false, {message: 'Wrong password.'});				
			}
			console.log("despues !user.valiDPassoword");				

			return done(null, user);
		});
	}));


