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
var userData =require('../models/user');
var Garage=require('../models/garage.model');
const Nexmo = require('nexmo');
var rentAdData=require('../models/rent_ad.model');

const nexmo = new Nexmo({
  apiKey: '7a13ba49',
  apiSecret: '1vC5i6zmDnRpGDKH'
});

// const from = 'VehiclePartner.lk';
// const to = '+94779868259';
// const text = 'A text message sent using the Nexmo SMS API Now your ad is live on VehiclePartner.lk';

// router.post('/sms', function(req, res, next) {
//   nexmo.message.sendSms(from, to, text, (error, response) => {
//     if(error) {
//       throw error;
//     } else if(response.messages[0].status != '0') {
//       console.error(response);
//       throw 'Nexmo returned back a non-zero status';
//     } else {
//       console.log(response);
//       res.redirect('/');
//     }
//   });
// });

/* GET home page. */
router.get('/', function(req, res, next) {

  userData.find().
  then(function(doc){
    res.render('admin_home', { title: 'Welcome admin',items: doc });
  });

  
});


router.get('/all_Ads', function(req, res, next) {
  AdData.find({isLive:1}).
  
  then(function(doc){
    res.render('admin_allAds', { title: 'All vehicle adds',items: doc });
  });
});

//admin confirmation of vehicle ad///////////////////////////////

router.get('/confirm_vehicle_ad/:id/:contactno', function(req, res, next) {
  var id=req.params.id;
  var from = 'VehiclePartner.lk';
  var to = '+94'+req.params.contactno;
  var text = 'Now your advertisment is live on VehiclePartner.lk';
  AdData.findById(id, function (err,vehicle_ad) {

    nexmo.message.sendSms(from, to, text, (error, response) => {
      if(error) {
        throw error;
      } else if(response.messages[0].status != '0') {
        console.error(response);
        throw 'Nexmo returned back a non-zero status';
      } else {
        console.log(response);
        //res.redirect('/admin/pending_vehicle_ads');
      }
    });
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
  res.render('pending_vehicle_ads', { title: 'Welcome admin' }); 
});

//delete all add
router.get('/deleteVehicleAd/:id', function(req, res, next) {
  var id = req.params.id;
  AdData.findByIdAndRemove(id).exec();//exec is for executing previous function 
  res.redirect('/admin/all_Ads'); 
}); 

//view to admin published rent ads
router.get('/adminPubRentAds', function(req, res, next) {
  rentAdData.find({isLive:1}).
  then(function(doc){
    res.render('admin_all_rentAds', { title: 'All rent adds',items: doc });
  });
});

//delete published renting ads
router.get('/deleteRentAd/:id', function(req, res, next) {
  var id = req.params.id;
  rentAdData.findByIdAndRemove(id).exec();//exec is for executing previous function 
  res.redirect('/admin/adminPubRentAds'); 
}); 
//confirmation of garages
router.get('/confirm_garage/:id/:contactno', function(req, res, next) {
  var id=req.params.id;
  var from = 'VehiclePartner.lk';
  var to = '+94'+req.params.contactno;
  var text = 'Now your Garage is live on VehiclePartner.lk';

  Garage.findById(id, function (err,garage_ad) {

    nexmo.message.sendSms(from, to, text, (error, response) => {
      if(error) {
        throw error;
      } else if(response.messages[0].status != '0') {
        console.error(response);
        throw 'Nexmo returned back a non-zero status';
      } else {
        console.log(response);
        //res.redirect('/admin/pending_vehicle_ads');
      }
    });
  //Garage.findById(id, function (err,garage_ad) {


//delete all add

/*router.get('/deleteVehicleAd/:id', function(req, res, next) {
  var id = req.params.id;
  AdData.findByIdAndRemove(id).exec();//exec is for executing previous function 
  res.render('pending_vehicle_ads', { title: 'Welcome admin' }); 
});
router.get('/ddeleteVehicleAd/:id', function(req, res, next) {
  var id = req.params.id;
  AdData.findByIdAndRemove(id).exec();//exec is for executing previous function 
  res.redirect('/admin/all_Ads'); 
}); */

    garage_ad.set({isLive:1});
    garage_ad.save(function (err, updatedAd) {
      if (err) return handleError(err);
      console.log(updatedAd);
      res.redirect('/admin/pending_garages');   
      });
    });
  });


  router.get('/deleteUser/:id', function(req, res, next) {
    var id = req.params.id;
    userData.findByIdAndRemove(id).exec();//exec is for executing previous function 
    res.redirect('/admin'); 
  });

//to view all pending garages
router.get('/pending_garages', function(req, res, next) {
  Garage.find({isLive:0}).
  then(function(doc){
    res.render('pending-garages', { title: 'Pending Garages', items: doc });
  });
});

//delete garages from admin view
router.get('/delete_garage/:id', function(req, res, next) {
  var id = req.params.id;
  Garage.findByIdAndRemove(id).exec();//exec is for executing previous function 
  res.render('pending-garages', { title: 'Pending Garages', items: doc }); 
});
///////////////////////////////////////////////////////////////master

//delete all add
// router.get('/deleteVehicleAd/:id', function(req, res, next) {
//   var id = req.params.id;
//   AdData.findByIdAndRemove(id).exec();//exec is for executing previous function 
//   res.render('admin_allads', { title: 'All Vehicle Ads' }); 
// });

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
    ///res.redirect('/admin/pending_vehicle_ads');
  
});

///renting ads///////////////////////////////////////////////////////////////

router.get('/confirm_rent_ad/:id/:contactno', function(req, res, next) {
  var id=req.params.id;
  var from = 'VehiclePartner.lk';
  var to = '+94'+req.params.contactno;
  var text = 'Now your Advertisement is live on VehiclePartner.lk';
  
  rentAdData.findById(id, function (err,rent_ad) {

    nexmo.message.sendSms(from, to, text, (error, response) => {
      if(error) {
        throw error;
      } else if(response.messages[0].status != '0') {
        console.error(response);
        throw 'Nexmo returned back a non-zero status';
      } else {
        console.log(response);
        //res.redirect('/admin/pending_vehicle_ads');
      }
    });
  //Garage.findById(id, function (err,garage_ad) {


//delete all add

/*router.get('/deleteVehicleAd/:id', function(req, res, next) {
  var id = req.params.id;
  AdData.findByIdAndRemove(id).exec();//exec is for executing previous function 
  res.render('pending_vehicle_ads', { title: 'Welcome admin' }); 
});
router.get('/ddeleteVehicleAd/:id', function(req, res, next) {
  var id = req.params.id;
  AdData.findByIdAndRemove(id).exec();//exec is for executing previous function 
  res.redirect('/admin/all_Ads'); 
}); */

rent_ad.set({isLive:1});
rent_ad.save(function (err, updatedAd) {
      if (err) return handleError(err);
      console.log(updatedAd);
      res.redirect('/admin/pending_rent_ads');   
      });
    });
  });

//to view all pending renting ads
router.get('/pending_rent_ads', function(req, res, next) {
  rentAdData.find({isLive:0}).
  then(function(doc){
    res.render('pending-rent-ads', { title: 'Pending Rent Ads', items: doc });
  });
});

//delete renting ads from admin view
router.get('/delete_rent_ad/:id', function(req, res, next) {
  var id = req.params.id;
  rentAdData.findByIdAndRemove(id).exec();//exec is for executing previous function 
  res.render('pending-rent-ads', { title: 'Pending Rent Ads', items: doc }); 
});


module.exports = router;
