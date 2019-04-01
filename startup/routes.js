/*jshint esversion: 6 */
const express = require('express');
const products = require('../routes/products');
const customers = require('../routes/customers');
const cartOrders = require('../routes/cartOrders');
const categories = require('../routes/categories');
const orders = require('../routes/orders');
const home = require('../routes/home');
const users = require('../routes/users');
const auth = require('../routes/auth');
const error = require('../middleware/error');
const cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');




module.exports = function(app){
     
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(fileUpload());
app.use('/api/products', products);
app.use('/api/orders', orders);
app.use('/api/cartOrders', cartOrders);
app.use('/api/customers', customers);
app.use('/api/categories', categories);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/', home);
app.use(error); 


app.set("views" , "./views");
app.set("view engine" , "ejs");

};