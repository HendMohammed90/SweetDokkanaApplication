/*jshint esversion: 6 */
/* jshint ignore:start */
const {User} = require('../models/user'); 
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Joi = require('joi');
const _ =  require('lodash');
const bcrypt = require('bcrypt');
require('express-async-errors'); 

router.get('/' ,async (req, res) =>{
  // res.send("Welcom To our application")
  res.render("login.ejs",
  {
    data : "welcom Admin ^_^ "
  });
  // console.log("welcom Admin ^_^");
})

//login Process
router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  
  let user = await User.findOne({ Email: req.body.Email});
  if (!user) return res.status(404).render("login.ejs" , 
    {
      data :"Invalide Email"
    });
 
  const validPassword = await bcrypt.compare(req.body.Password, user.Password);
  if(!validPassword) return res.status(400).render("login.ejs" , 
  {
    data :"Invalide password"
  });

  const token = user.generateAuthToken();
  res.cookie('x-auth-token',token,{
    maxAge : 900 ,
    httpOnly : true
  }).header('x-auth-token', token).redirect("/api/home");
  // res.;
  console.log(token);
});

function validate(req) {
  const schema = {
    Email :Joi.string().required().email().min(5).max(255),
    Password : Joi.string().min(5).max(255).required()
  };

  return Joi.validate(req, schema);
}


module.exports = router; 