/*jshint esversion: 6 */
/* jshint ignore:start */
const {User} = require('../models/user'); 
const {Customer} = require('../models/customer');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Joi = require('joi');
const _ =  require('lodash');
const bcrypt = require('bcrypt');
require('express-async-errors'); 

//login Process
router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  
  // let user = await User.findOne({Email : req.body.Email});
  //   if(!user) return res.status(400).send("Invalid Email ");
  //   const validPassword = await bcrypt.compare(req.body.Password , user.Password);
  //   if(!validPassword) return res.status(400).send("Invalid password");
    
  //   const token = user.generateAuthToken();
  //   res.header('x-auth-token' , token);

  let customer = await Customer.findOne({ Email: req.body.Email});
    if (!customer) return res.status(404).send('Invalide email or password');
    
    const validPassword = await bcrypt.compare(req.body.Password, customer.Password);
    if(!validPassword) return res.status(400).send('Invalide email or password');

    const token = customer.generateAuthToken();

    res.header('x-auth-token', token).send(_.pick(customer, ['_id', 'UserName', 'Email']));

});

function validate(req) {
    const schema = {
      Email :Joi.string().required().email().min(5).max(255),
      Password : Joi.string().min(5).max(255).required()
    };
  
    return Joi.validate(req, schema);
  }
  

module.exports = router; 