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
  SparePartCategory:{type:String,required:true},//can't be empty
  SparePartSubCategory:{type:String,required:true},
  VehicleType:{type:String,required:true},
  SparePartName:{type:String,required:true},
  condition:{type:String,required:true},
  VehicleBrand:{type:String,required:true},
  district:{type:String,required:true},
  town:{type:String,required:true},
  description:{type:String,required:true},
  ////////////////////////image
	image1Path:{type:String,required:true},
	image2Path:{type:String,required:true},
  image3Path:{type:String,required:true},
  price:{type:Number,required:true},
	added_date:{type: Date,default: Date.now},
  isLive:{type:Number,default:0}
  
},{collection:'spare-part-ad-data'});

module.exports = mongoose.model("sparePart",adDataSchema);//