var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
bodyParser = require('body-parser'),
path = require('path');
var config = require('../config/database');
mongoose.connect(config.database);
var Schema = mongoose.Schema;
var multer = require('multer');
const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');
var Garage=require('../models/garage.model');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
//var flash = require('connect-flash');


/* GET home page. */
// to get all garage ads
router.get('/', function(req, res, next) {
  res.render('garage-all', { title: 'All garages' });
});

//image stuff
var upload = multer({storage: multer.diskStorage({

  destination: function (req, file, callback) 
  { callback(null, './public/uploads');},
  filename: function (req, file, callback) 
  { callback(null,Date.now()+path.extname(file.originalname));}

}),

fileFilter: function(req, file, callback) {
  var ext = path.extname(file.originalname)
  if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
    return callback(/*res.end('Only images are allowed')*/ null, false)
  }
  callback(null, true)
}
});

//to get register garage page
router.get('/register', function(req, res, next) {
    res.render('garage-register', { title: 'Garage Register' });
  });

  //to register garage
  router.post('/register',upload.any(), function (req, res) {

    if(!req.body && !req.files){
      res.json({success: false});
    } else {

    var garagename=req.body.garagename;
    var email=req.body.email;
    var password=req.body.password;
    var district=req.body.district;
    var town=req.body.town;
    var longitude=req.body.longitude;
    var latitude=req.body.latitude;
    var ServiceTypes=[req.body.acServices,req.body.eServices,
                    req.body.lmServices,req.body.mechanicServices,
                    req.body.paintServices,req.body.tServices];
    var description=req.body.description;
    var image1Path=req.files[0].filename;
    var image2Path=req.files[1].filename;
    var image3Path=req.files[2].filename;
  
    // Validation
    req.checkBody('garagename', 'Garagename is required').notEmpty();
     req.checkBody('email', 'Email is required').notEmpty();
     req.checkBody('email', 'Email is not valid').isEmail();
    // req.checkBody('garageName', 'Garage name is required').notEmpty();
     req.checkBody('password', 'Password is required').notEmpty();
    //req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
  
    var errors = req.validationErrors();
    
    if (errors) {
      res.render('garage-register', {
        errors: errors
      });
    }
    else {
      //checking for email and username are already taken
      Garage.findOne({ garagename: { 
        "$regex": "^" + garagename + "\\b", "$options": "i"
    }}, function (err, garage) {
      Garage.findOne({ email: { 
          "$regex": "^" + email + "\\b", "$options": "i"
      }}, function (err, mail) {
          if (garage || mail) {
            res.render('register',{ 
              garage: garage,
              mail:mail });
          }
          else {
            var newGarage = new Garage({
              garagename: garagename,
              email: email,
              password: password,
              Longitude: longitude,
              Latitude:latitude,
              ServiceTypes:[ServiceTypes[0],ServiceTypes[1],ServiceTypes[2],ServiceTypes[3],ServiceTypes[4],ServiceTypes[5]],
              district:district,
              town:town,
              description:description,
              image1Path:image1Path,
              image2Path:image2Path,
              image3Path:image3Path

            });
            Garage.createUser(newGarage, function (err, garage) {
              if (err) throw err;
              console.log(garage);
            });
            req.flash('success_msg', 'You are registered and can now login');
            res.redirect('/garage/login');
          }
        });
      });
    }
  }
  });


  //to login garage owner
  router.get('/login', function(req, res, next) {
    res.render('garage-login', { title: 'Garage Login' });
  });

  
//////////////////////
  passport.use(new LocalStrategy(
    function (garagename, password, done) {
      Garage.getUserByUsername(garagename, function (err, garage) {
        if (err) {
          console.log(err);
          throw err;
          }
        if (!garage) {
          console.log("Unknown garage");
          return done(null, false, { message: 'Unknown Garage' });
        }
  
        Garage.comparePassword(password, garage.password, function (err, isMatch) {
          if (err){
            //console.log(err); 
            throw err;}
          if (isMatch) {
            return done(null, garage);
          } else {
            //console.log("Invalid password");
            return done(null, false, { message: 'Invalid password' });
          }
        });
      });
    }));
  
  passport.serializeUser(function (garage, done) {
    done(null, garage.id);
  });
  
  passport.deserializeUser(function (id, done) {
    Garage.getUserById(id, function (err, garage) {
      done(err, garage);
    });
  });
  
  router.post('/login',
    passport.authenticate('local', { successRedirect: '/garage/profile', failureRedirect: '/garage/login'}),
    function (req, res) {
      res.redirect('/garage/profile');
    });
  
    router.get('/profile', ensureAuthenticated, function(req, res){
      res.render('garage-profile');
    });
    
    function ensureAuthenticated(req, res, next){
      if(req.isAuthenticated()){
        return next();
      } else {
        req.flash('error_msg','You are not logged in');
        res.redirect('/garage/login');
      }
    }

  router.get('/logout', function (req, res) {
    req.logout();
  
    req.flash('success_msg', 'You are logged out');
  
    res.redirect('/garage/login');
  });

  module.exports = router;
