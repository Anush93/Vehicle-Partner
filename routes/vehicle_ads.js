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

var app = new express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* GET home page. */
router.get('/', function(req, res, next) {
  AdData.find({isLive:1}).
  
  then(function(doc){
    res.render('vehicle-ads-all', { title: 'All vehicle adds',items: doc });
  });
});

router.get('/:id', function(req, res, next) {
  var id=req.params.id;
  AdData.find({ _id: id}).
  then(function(doc){
    res.render('vehicle-ad-view', { title: 'Clicked Ad Details',items: doc });
  });
});

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

router.post('/vehicle-data-insert',upload.any(),function(req, res, next) {
  console.log("req.body"); //form fields
  console.log(req.body);
  console.log("req.file");
  console.log(req.files);

  if(!req.body && !req.files){
    res.json({success: false});
  } else {

  var item = {
    //title: req.body.title,
    Owner:req.body.owner,
    Contactno:req.body.contactNo,
    VehicleCategory:req.body.VehicleCategory,//can't be empty
    VehicleBrand:req.body.VehicleBrand,
    VehicleModel:req.body.VehicleModel,
    fuelType:req.body.fuelType,
    year:req.body.year,
    condition:req.body.condition,
    mileage:req.body.mileage,
    engineCapacity:req.body.engineCapacity,
    transmissioinType:req.body.transmissioinType,
    VehicleBrand:req.body.VehicleBrand,
    district:req.body.district,
    town:req.body.town,
    description:req.body.description,
    //image:{type:String,required:true},
    image1Path:req.files[0].filename,
    image2Path:req.files[1].filename,
    image3Path:req.files[2].filename,
    price:req.body.price,
  };//item obj

  var data = new AdData(item);//data is our model of collection to which we passed item objct
  data.save();//jst save dat objct man;
  res.redirect('/');
}
});

module.exports = router;
