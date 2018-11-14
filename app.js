// Apps Claxson  
var express = require('express');


var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');
var MongoStore = require('connect-mongo')(session);

var routes = require('./routes/index');
var userRoutes = require('./routes/user');

//var blockchainRoutes = require('./routes/blockchain_api');

var app = express();

//app.locals.optionmenu = false;
// Paara evitar e log un mensaje 4304 de volver a carga la pagina
//app.disable('etag'); no hizo nada se mantuvo igual


var settings = require('./i2p_settings.js');

//require('./i2p_functions.js');


console.log("MongoServer: ",settings.MongoServer);
//console.log("sapWebServer:",settings.sapWebServer);

// para usar con internet servidor de claxson
  // mongoose.connect('mongodb://invoice:Inv.1984@admapps01:27017/invoice2pay');

  mongoose.connect(settings.MongoServer);

// -------------------------------------------------------------------
//   BigchainDB drivers

    const bigchainDb = require('bigchaindb-driver');

    const API_PATH = 'http://localhost:9984/api/v1/';

    //const conn = new driver.Connection(API_PATH);

    const connDb = new bigchainDb.Connection(API_PATH, {
        app_id: '385b62f9',
        app_key: '185a4d7d619448dbf0c725f3485fa0b6'
        })


    console.log("connDb:", connDb);

//--- Para usar con internet servidor mlab
// mongoose.connect('mongodb://testuser:20160707@ds017175.mlab.com:17175/shopping');


//--- Para usar local sin internet esta es la instrucción
//    mongoose.connect('127.0.0.1:27017/casupo');

require('./config/passport');

// view engine setup
app.engine('.hbs', expressHbs({
          defaultLayout: 'layout', 
          extname: '.hbs',
          helpers: require("./public/js/helpers.js").helpers}));
app.set('view engine', '.hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'mysupersecret', 
    resave : false, 
    saveUninitialized: false,
    store: new MongoStore({mongooseConnection:mongoose.connection}),
    cookie: { maxAge: 180 * 60 * 1000 }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(validator());
app.use(flash());


app.use(function(req, res, next) {
    app.showisotope = function(t_action) {
        if (t_action)
            return false
        else
            return true
    };
    next();
});


app.use(function(req, res, next)
{
    res.locals.login = req.isAuthenticated();  
    res.locals.session = req.session;
    res.locals.optionmenu = app.locals.optionmenu;
    
    res.locals.activateIsotope = app.showisotope(); //true; //showisotope();  

    //res.locals.email_logged =  i2p_functions.get_useremail();

    //console.log("app req.session:",req.session);
    //console.log("app locals.optionmenu:",app.locals.optionmenu);

    next();  
});


//app.use('/blockchain', blockchainRoutes);
app.use('/user', userRoutes);
app.use('/', routes);




// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
    });
});


module.exports = app;
