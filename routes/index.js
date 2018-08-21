var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
bodyParser = require('body-parser'),
path = require('path');
var config = require('../config/database');
mongoose.connect(config.database);
var Schema = mongoose.Schema;
var multer = require('multer');
var AdData=require('../models/vehicle_ad.model');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Vehicle Partner Web site' });
});


module.exports = router;
