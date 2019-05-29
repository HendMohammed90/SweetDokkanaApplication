/*jshint esversion: 6 */
/* jshint ignore:start */
const {Customer, validate} = require('../models/customer'); 
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
require('express-async-errors');
const {ensureAuthenticated} = require('../config/auth');
const passport = require('passport');
const _ =  require('lodash'); 
const bcrypt = require('bcryptjs');
require('../config/passport-setup')(passport);



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

// router.post('/', async (req, res) => { 
//   const { error } = validate(req.body); 
//   if (error) return res.status(400).send(error.details[0].message);
//   try{
//     customer = new Customer({ 
//       UserName: req.body.UserName,
//       Email: req.body.Email,
//       Password: req.body.Password,
//       Phone: req.body.Phone,
//       Address: req.body.Address,
//     });
//       customer = await customer.save();
//   }
//   catch(ex){
//     console.log(ex);
//     return res.status(404).send('This email is already regested pleas sign in');
//   }
  
//   res.send(customer);
// });


// login post request 
//this part will be for login systym for custonmer
// <%if (typeof name !== "undefined"){%>
//   <ul class="navbar-nav ml-auto ">
//       <li class="nav-item ml-auto"><a class="nav-link">
//       <%=name%></a></li>
//   </ul>
// <%}else if(typeof name == "undefined"){%>
//   <ul class="navbar-nav ml-auto ">
//       <li class="nav-item ml-auto"><a class="nav-link popupbutton" data-show=".popup">
//       <i class="fa fa-user"></i> log in </a></li>
//   </ul>
// <%}%>

// router.post('/', (req, res, next) => {
//   passport.authenticate('sweetDokkana-signup', {
//     successRedirect: '/',
//     failureRedirect: '/singup',
//     badRequestMessage: 'Somthing Bad has happend.',
//     failureFlash: true
//   })(req, res, next);
  
// });

// router.use((req ,res ,next)=>{
//     res.locals.user= req.user;
//     next();
// });

// sign up for customer post request
router.post('/singup',async(req,res)=>{

  // console.log(req.body);

  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  
  let customer = await Customer.findOne({Email : req.body.Email});
  
  if(customer){
    return res.status(400).render('account.ejs',
    {
      data : "  Invalid Email It's alredy registered Pleas Sign in"
    });
  } 

  // //create the new User
  customer =  new Customer({
    UserName: req.body.UserName,
    Email: req.body.Email,
    Password: req.body.Password,
    Phone: req.body.Phone,
    Address: req.body.Address
  });

  // console.log(customer);

  //hash Password
  const salt = await bcrypt.genSalt(10);
  customer.Password = await bcrypt.hash(customer.Password, salt);
  
  console.log(customer);

  //save the user
  await customer.save();
  req.flash('success_msg', 'you are now registersd and can log in ');
  res.redirect('/account');
  
})



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