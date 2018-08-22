var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var indexRouter = require('./routes/index');
var hbs = require('express-handlebars');//to import handle bars
//var expressValdator = require('express-validator');
var expressSession = require('express-session');
var multer = require('multer');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var LocalStrategy = require('passport-local').Strategy;
// var mongo = require('mongodb');
// var mongoose = require('mongoose');



var userRouter = require('./routes/users');//
var vehicleAdRouter = require('./routes/vehicle_ads');
var config = require('./config/database');
var adminRouter = require('./routes/admin');//
var users_login = require('./routes/users_login');
var garageRouter = require('./routes/garage');
var rentRouter = require('./routes/rent_ads');

var app = express();

// view engine setup
app.engine('hbs',hbs({extname:'hbs',defaultLayout:'layout',layoutsDir:__dirname +'/views/layouts'}));//path for layout compenents
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');//set the hbs as template engine

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(expressValidator());//should be used after the body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession({secret:'max',saveUninitialized:false,resave:false}));
//app.use(express.static('/public'));

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));


// Connect Flash
app.use(flash());

/////////routings

app.use('/', indexRouter);//any request is sent to indexrouter method
app.use('/users',userRouter);//req==/users nam userRouter ekata yanna
app.use('/vehicle_ads',vehicleAdRouter);
app.use('/admin',adminRouter);
app.use('/users_login',users_login);
app.use('/garage',garageRouter);
app.use('/rent_ads',rentRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  //res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.garage = req.garage || null;
  next();
});

module.exports = app;
