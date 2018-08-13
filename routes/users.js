var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
bodyParser = require('body-parser'),
path = require('path');
var config = require('../config/database');
mongoose.connect(config.database);
var Schema = mongoose.Schema;
var multer = require('multer');

var AdData = require('../models/vehicle_ad.model');

var app = new express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
////////////////////////////////
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('logged page should be displayed');
});

router.get('/vehicle_ad_form', function(req, res, next) {
    res.render('vehicle-ad-form', { title: 'Fill Your Advertisment Details' });
  });

  router.get('/login', function(req, res, next) {
    res.render('login', { title: 'Login' });
  });

  router.get('/register', function(req, res, next) {
    res.render('register', { title: 'Register' });
  });
module.exports = router;
