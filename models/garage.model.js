var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
bodyParser = require('body-parser'),
path = require('path');
var config = require('../config/database');
mongoose.connect(config.database);
var Schema = mongoose.Schema;
var multer = require('multer');

// Garage Schema
var GarageSchema = new Schema({
    garagename:{type:String,required:true,index:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    Longitude:{type:String,required:true},
    Latitude:{type:String,required:true},
    ServiceTypes:{type:[String],default:""},
    district:{type:String,required:true},
    town:{type:String,required:true},
    description:{type:String,required:true},
    ////////////////////////image
      image1Path:{type:String,required:true},
      image2Path:{type:String,required:true},
      isLive:{type:Number,default:0},
      image3Path:{type:String,required:true},
      contactno:{type:Number,required:true}
    //added_date:{type: Date,default: Date.now}
  },{collection:'garage-data'});

var Garage = module.exports = mongoose.model('Garage', GarageSchema);

module.exports.createUser = function(newGarage, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newGarage.password, salt, function(err, hash) {
	        newGarage.password = hash;
	        newGarage.save(callback);
	    });
	});
}

module.exports.getUserByUsername = function(garagename, callback){
	var query = {garagename: garagename};
	Garage.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	Garage.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}