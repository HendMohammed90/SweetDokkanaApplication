/*jshint esversion: 6 */
/* jshint ignore:start */
// const auth= require('../middleware/auth');
// const cookieParser = require('cookie-parser'); 
const {User, validate} = require('../models/user'); 
const mongoose = require('mongoose');
const passport = require('passport');
require('../config/passport-setup')(passport);
const express = require('express');
const router = express.Router();
const _ =  require('lodash'); 
const bcrypt = require('bcryptjs');
require('express-async-errors'); //here we tell the app to use this middelware in every routs
// router.use(cookieParser());


//  login user view 
router.get('/' ,async (req, res) =>{
  // res.send("Welcom To our application")
  res.render("login.ejs",
  {
    data : "welcom Admin ^_^ "
  });
  // console.log("welcom Admin ^_^");
})


// login post request 
router.post('/', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/api/home',
    failureRedirect: '/api/users',
    badRequestMessage: 'Somthing Bad has happend.',
    failureFlash: true
  })(req, res, next);
});


// sign up form 
router.get('/singup', (req,res)=> {
  res.render('signup.ejs',
  {
    data : "welcom To Joining us ^_^ "
  });
})



// sign up post request
router.post('/singup',async(req,res)=>{

  // console.log(req.body);

  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  if(req.body.Password != req.body.confirm_Password) {
    return res.status(400).render('signup.ejs',
    {
      data : "Password Do Not Match"
    });
  }
  

  let user = await User.findOne({Email : req.body.Email});
  if(user){
    return res.status(400).render('signup.ejs',
    {
      data : "  Invalid Email It's alredy registered Pleas Sign in"
    });
  } 

  // //create the new User
   user =  new User({
    name :req.body.name,
    Email :req.body.Email,
    Password : req.body.Password,
    isAdmin : req.body.isAdmin
  });

  // console.log(user);

  //hash Password
  const salt = await bcrypt.genSalt(10);
  user.Password = await bcrypt.hash(user.Password, salt);
  
  console.log(user);

  //save the user
  await user.save();
  req.flash('success_msg', 'you are now registersd and can log in ');
  res.redirect('/api/users');
  
})


// router.get('/me',async(req ,res)=>{
// // const token =  req.cookies.x-auth-token
// // const user = await User.findById(req.user._id).select('-password');
// res.render('profile.ejs',{
//   name : req.user.name,
//   Email : req.user.Email,
//   isAdmin : req.user.isAdmin,
//   Password :req.user.Password
// })
// console.log(req.body);
// })


// logout user

router.get('/logout', (req,res)=> {
  // res.send("log Out");
  req.logout();
  req.flash('success_msg',"You Are Logged Out");
  res.redirect('/api/users');
})

module.exports = router; 