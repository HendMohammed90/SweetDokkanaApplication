/*jshint esversion: 6 */
/* jshint ignore:start */

const Joi = require('joi');
const mongoose = require('mongoose');

const Order = mongoose.model('Order', new mongoose.Schema({
  Name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },  
  OrderDate: {
    type: Date,
    default : Date.now
  },
  Address: {
    type: String,
    minlength: 3,
    maxlength: 50,
    required: true,
  },
  City: {
    type: String,
    minlength: 3,
    maxlength: 50,
    required: true,
  },
  Phone: {
    type:Number,
    required: true
  },
  Payment: {
    type:String,
    required: true
  },
  OrderPrice: {
    type:String,
    required: true
  },
  ShippingPrice:{
    type:Number
  }
  }));
  
  function validateOrder(order) {
    const schema = {
      Name: Joi.string().min(3).required(),
      Address: Joi.string().required(),
      City: Joi.string().required(),
      Phone: Joi.number().required(),
      Payment: Joi.string().required(),
      OrderPrice: Joi.number().required()
    };
  
    return Joi.validate(order, schema);
  }
  
  exports.Order = Order; 
  exports.validate = validateOrder;