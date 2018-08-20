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
var AdData=require('../models/vehicle_ad.model');
var userData =require('../models/user')

/* GET home page. */
router.get('/', function(req, res, next) {

  userData.find().
  then(function(doc){
    res.render('admin_home', { title: 'Welcome admin',items: doc });
  });

  
});

router.get('/allAds', function(req, res, next) {
  res.render('admin_allAds', { title: 'allAds' });
});

//admin confirmation of vehicle ad

router.get('/confirm_vehicle_ad/:id', function(req, res, next) {
  var id=req.params.id;
  AdData.findById(id, function (err,vehicle_ad) {

    vehicle_ad.set({isLive:1});
    vehicle_ad.save(function (err, updatedAd) {
      if (err) return handleError(err);
      console.log(updatedAd);
      res.redirect('/admin/pending_vehicle_ads');   
      });
    });
  });

//to view all pending vehicle ads
router.get('/pending_vehicle_ads', function(req, res, next) {
  AdData.find({isLive:0}).
  then(function(doc){
    res.render('pending_vehicle_ads', { title: 'Pending Vehicle Ads', items: doc });
  });
});

//delete vehicle ads from admin view
router.get('/delete_vehicle_ad/:id', function(req, res, next) {
  var id = req.params.id;
  AdData.findByIdAndRemove(id).exec();//exec is for executing previous function 
  res.render('admin_home', { title: 'Welcome admin' }); 
});


router.post('/sendSMS', function(req, res, next){
  var sms =req.body.sms;
  var number ="+94"+req.body.contactNo;
  console.log("meka");



  
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
    text: sms
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });





  







    res.redirect('/admin/pending_vehicle_ads');
  
});


module.exports = router;
