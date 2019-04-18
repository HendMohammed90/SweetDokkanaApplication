/*jshint esversion: 6 */
/* jshint ignore:start */
const {Customer, validate} = require('../models/customer'); 
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
require('express-async-errors');
const {ensureAuthenticated} = require('../config/auth');


router.get('/:pageNo?',ensureAuthenticated,async (req, res) => {
  // const customers = await Customer.find().sort('name');
  // res.send(customers);

  let pageNo = 1;
  if(req.params.pageNo){
      pageNo = parseInt(req.params.pageNo)
  }
  if(req.params.pageNo==0 ||req.params.pageNo<0) {
      pageNo = 1
  }  
  let q= {
      skip :4 * (pageNo -1),
      limit : 4
  }
  const customers = await Customer.find({},{},q);
  //find total NU of Documants
  let totalDocs = 0 ;
  // console.log(customers.length);
  Customer.countDocuments({},(err,total)=>{

  }).then((response)=>{
      totalDocs = parseInt(response);
      // console.log(response)
      res.render("customers.ejs" , 
      {
        customers :customers,
        total :parseInt(totalDocs),
        pageNo :pageNo,
        name : req.user.name
      });
  })
 
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

router.put('/:id', ensureAuthenticated,async (req, res) => { 
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

router.delete('/:id',ensureAuthenticated ,async (req, res) => { 
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