/*jshint esversion: 6 */
/* jshint ignore:start */
const express = require('express');
const router = express.Router();
const {Order} = require('../models/orders');

router.get('/',async(req, res) =>{
    const orders = await Order.find();
    res.render("index.ejs" , 
        {
            data :"Welcom To our render Page",
            title : "Main Page",
            orders :orders
        });
    // console.log(orders);
});

module.exports = router; 