/*jshint esversion: 6 */
/* jshint ignore:start */
const {Customer, validate} = require('../models/customer'); 
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
require('express-async-errors');


router.get('/', async (req, res) => {
  const customers = await Customer.find().sort('name');
  res.send(customers);
});

router.post('/', async (req, res) => { 
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  try{
    customer = new Customer({ 
      UserName: req.body.UserName,
      Email: req.body.Email,
      Password: req.body.Password,
      Phone: req.body.Phone,
      Address: req.body.Address,
    });
      customer = await customer.save();
  }
  catch(ex){
    console.log(ex);
    return res.status(404).send('This email is already regested pleas sign in');
  }
  
  res.send(customer);
});

router.put('/:id', async (req, res) => { 
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(req.params.id, {
    UserName: req.body.UserName,
      Email: req.body.Email,
      Password: req.body.Password,
      Phone: req.body.Phone,
      Address: req.body.Address,
    }, {
    new: true
  });
  if (!customer) return res.status(404).send('The customer with the given ID was not found.');
  
  res.send(customer);
});

router.delete('/:id', async (req, res) => { 
  const customer = await Customer.findByIdAndRemove(req.params.id);

  if (!customer) return res.status(404).send('The customer with the given ID was not found.');

  res.send(customer);
});

router.get('/:id', async (req, res) => { 
  const customer = await Customer.findById(req.params.id);

  if (!customer) return res.status(404).send('The customer with the given ID was not found.');

  res.send(customer);
});

module.exports = router; 