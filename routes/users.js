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

var AdData = require('../models/vehicle_ad.model');

var app = new express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
////////////////////////////////
/* GET users listing. */
router.get('/user_profile', function(req, res, next) {
  res.send('logged page of user should be displayed');
});

router.get('/garage_profile', function(req, res, next) {
  res.send('logged page of garage should be displayed');
});

router.get('/vehicle_ad_form', function(req, res, next) {
    res.render('vehicle-ad-form', { title: 'Fill Your Advertisment Details' });
  });

  router.get('/rent_ad_form', function(req, res, next) {
    res.render('rent-ad-form', { title: 'Fill Your Advertisment Details' });
  });

  router.get('/login', function(req, res, next) {
    res.render('login', { title: 'Login' });
  });

  router.get('/register', function(req, res, next) {
    res.render('register', { title: 'Register' });
  });

  router.get('/garage_ad_form', function(req, res, next) {
    res.render('garage-ad-form', { title: 'Fill Your Garage Advertisment Details' });
  });

  router.get('/spare_part_ad_form', function(req, res, next) {
    res.render('spare-part-ad-form', { title: 'Fill Your Spare Part Advertisment Details' });
  });

  router.get('/helpAndTips', function(req, res, next) {
    res.render('helpAndTips', { title: 'Helps & Tips' });
  });

  router.get('/aboutUs', function(req, res, next) {
    res.render('aboutUs', { title: 'About Us' });
  });

  router.post('/sendMessage', function(req, res, next){
    var name =req.body.name;
    var email =req.body.email;
    var phone =req.body.phone;
    var message =req.body.message;
    console.log(name);
   
  
  
  
    
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'mohammed.zaith123@gmail.com',
        pass: 'fusion2018'
      }
    });
    
    var mailOptions = {
      from: 'VehiclePartner.lk<mohammed.zaith123@gmail.com>',
      to: 'anushcs55@gmail.com',
      subject: 'Please check your VehiclePartner.lk ad',
      text: "name: "+name+", email: "+email+", phone: "+phone+", message: "+message
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    res.redirect('/users/aboutUs');
  
  });
module.exports = router;