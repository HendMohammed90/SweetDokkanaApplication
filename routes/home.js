/*jshint esversion: 6 */
/* jshint ignore:start */
const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../config/auth');
const {Order} = require('../models/orders');
const {User} = require('../models/user'); 

router.get('/',ensureAuthenticated,async(req, res) =>{
    const orders = await Order.find();
  console.log(req.user); //==>this give me the user 
  
    res.render("index.ejs" , 
        {
            orders :orders,
            name : req.user.name
        });
    // console.log(orders);
    
});

router.get('/me',ensureAuthenticated,async(req ,res)=>{
    // const token =  req.cookies.x-auth-token
    // const user = await User.findById(req.user._id).select('-password');
    res.render('profile.ejs',{
      name : req.user.name,
      Email : req.user.Email,
      isAdmin : req.user.isAdmin,
      Password :req.user.Password,
      ID :req.user.id,
      message :""
    })
    console.log(req.user);
})

router.post('/me',ensureAuthenticated,async(req ,res)=>{
    let ID = req.user.id;
 
    const Updateduser = await User.findByIdAndUpdate(ID, {
        name :req.body.name,
        Email :req.body.Email,
        // Password : req.body.Email,
        isAdmin : req.body.isAdmin    
        }, {
        new: true
      });
    
    res.render('profile.ejs',{
      name : req.user.name,
      Email : req.user.Email,
      isAdmin : req.user.isAdmin,
      Password :req.user.Password,
      message :"Your Data has been ubdated refresh to see your Ubdate",
      ID :req.user.id
    })
    console.log(Updateduser);
})
module.exports = router; 