var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
bodyParser = require('body-parser'),
path = require('path');
var config = require('../config/database');
mongoose.connect(config.database);
var Schema = mongoose.Schema;
var multer = require('multer');


var adDataSchema = new Schema({
  Owner:{type:String,required:true},
  Contactno:{type:Number,required:true},
  VehicleCategory:{type:String,required:true},//can't be empty
  VehicleBrand:{type:String,required:true},
  VehicleModel:{type:String,required:true},
  fuelType:{type:String,required:true},
  year:{type:Number,required:true},
  condition:{type:String,required:true},
  mileage:{type:Number,required:true},
  engineCapacity:{type:Number,required:true},
  transmissioinType:{type:String,required:true},
  VehicleBrand:{type:String,required:true},
  district:{type:String,required:true},
  town:{type:String,required:true},
  description:{type:String,required:true},
  ////////////////////////image
	image1Path:{type:String,required:true},
	image2Path:{type:String,required:true},
	image3Path:{type:String,required:true},
	added_date:{type: Date,default: Date.now},
  //////////////////////////
  isLive:{type:Number,default:0},
  price:{type:Number,required:true}
},{collection:'vehicle-ad-data'});

module.exports = mongoose.model("adData",adDataSchema);//