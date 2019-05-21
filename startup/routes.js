/*jshint esversion: 6 */
const express = require('express');
const Homepage = require('../routes/Homepage');
const products = require('../routes/products');
const customers = require('../routes/customers');
const cartOrders = require('../routes/cartOrders');
const categories = require('../routes/categories');
const orders = require('../routes/orders');
const home = require('../routes/home');
const users = require('../routes/users');
const EditeProduct = require('../routes/EditeProduct');
const passport = require('passport');
require('../config/passport-setup')(passport);
const error = require('../middleware/error');
const cors = require('cors');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const fileUpload = require('express-fileupload');
// const path = require('path'); //this is a coar nodejs module 
// const crypto = require('crypto'); //this is also a coar nodejs module for creating Image Name 




module.exports = function(app){
     
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('./public'));
app.use(fileUpload()); 

// Express session
app.use(
    session({
      secret: 'secret',
      resave: true, //don't save session if unmodified
      saveUninitialized: true, // don't create sessions for not logged in users
    })
  );

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());
// Global variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });

//cart session
app.get('*' , function(req ,res,next){
  res.locals.cartOrders = req.session.cartOrders;
  next();
});

app.use('/api/products', products);
app.use('/api/EditeProduct', EditeProduct);
app.use('/api/orders', orders);
app.use('/api/cartOrders', cartOrders);
app.use('/api/customers', customers);
app.use('/api/categories', categories);
app.use('/api/users', users);
app.use('/api/home', home);
app.use('/', Homepage);
app.use(error); 


app.set("views" , "./views");
app.set("view engine" , "ejs");



// app.get('/' ,(req,res)=>{
//     res.redirect('/api/users');
// });

};