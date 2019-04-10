/*jshint esversion: 6 */
/* jshint ignore:start */
const auth= require('../middleware/auth');
const cookieParser = require('cookie-parser'); 
const {User, validate} = require('../models/user'); 
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const _ =  require('lodash'); 
const bcrypt = require('bcrypt');
require('express-async-errors'); //here we tell the app to use this middelware in every routs
router.use(cookieParser());

router.get('/me',auth,async(req ,res)=>{
const token =  req.cookies.x-auth-token
const user = await User.findById(req.user._id).select('-password');
res.send(user);
})

router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  
  let user = await User.findOne({Email : req.body.Email});
  if(user) return res.status(400).send("Invalid Email It's alredy registered");

  //create the new User
  user = new User({ 
    name :req.body.name,
    Email :req.body.Email,
    Password : req.body.Password,
    isAdmin : req.body.isAdmin
  });
  const salt = await bcrypt.genSalt(10);
  user.Password = await bcrypt.hash(user.Password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res.header('x-auth-token' , token).json({token : token}).send(_.pick(user,['name' ,'email']));
 

});

module.exports = router; 