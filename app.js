var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var indexRouter = require('./routes/index');
var hbs = require('express-handlebars');//to import handle bars
var expressValdator = require('express-validator');
var expressSession = require('express-session');
var multer = require('multer');
var expressValidator = require('express-validator');



var userRouter = require('./routes/users');//
var vehicleAdRouter = require('./routes/vehicle_ads');
var config = require('./config/database');
var adminRouter = require('./routes/admin');//
var users_login = require('./routes/users_login');

var app = express();

// view engine setup
app.engine('hbs',hbs({extname:'hbs',defaultLayout:'layout',layoutsDir:__dirname +'/views/layouts'}));//path for layout compenents
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');//set the hbs as template engine

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(expressValdator());//should be used after the body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession({secret:'max',saveUninitialized:false,resave:false}));
//app.use(express.static('/public'));

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

/////////routings

app.use('/', indexRouter);//any request is sent to indexrouter method
app.use('/users',userRouter);//req==/users nam userRouter ekata yanna
app.use('/vehicle_ads',vehicleAdRouter);
app.use('/admin',adminRouter);
app.use('/users_login',users_login);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
