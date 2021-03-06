const express = require('express');
const router = express.Router();
const User = require("../models/user");
const jwt = require('jsonwebtoken');
const config = require("../config/database")
const passport = require('passport');
router.post("/register",function(req,res){
    const newUser = new User({
        username:req.body.username,
        email:req.body.email,
        password:req.body.pass

    });


User.saveUser(newUser,function(err,user){
    if(err){
        console.log(err);
        res.json({state:false,msg:"data not inserted"});
    }
    if(user){
       // res.json({state:true,msg:"data inserted"});
       res.render('user-profile', { title: 'User Profile' });
    }
});

});


router.get('/', function( req,res, next) {
    
      res.render('register', { title: 'Register' });
  });



router.post("/login",function(req,res){
    // const email = req.body.email;
    // const password = req.body.pass;

//     console.log(password);
//     if(password=='admin'){}

   
//     User.findByEmail(email,function(err,user){
//         if(err) throw err;
        
//         if (!user){
//              res.json({state:false,msg:"no user found"});
//         }
        
        
//         User.passwordCheck(user.password,user.password,function(err,match){


        
//         if(err) throw err;

        
//         if (match){
//             const token = jwt.sign(user.toObject(),config.secret,{expiresIn:86400});
//              res.json({
//                  state:true,
//                  token:"Bearer "+ token,
//                  user:{
//                      id:user._id,
//                      username:user.username,
//                      email:user.email


//                  }


//              }); 
//              res.render('user-profile', { title: 'Register' });
            
//         }
//         else{
//             res.json({state:false,msg:"password does not match"});
//         }
//     });
// });

res.render('user-profile', { title: 'User Profile' });
});

router.post('/profile', passport.authenticate('jwt', { session: false }),
    function(req, res) {
        res.json({user:req.user});
    }
);




module.exports = router;