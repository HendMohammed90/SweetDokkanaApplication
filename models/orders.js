/*jshint esversion: 6 */
/* jshint ignore:start */

const Joi = require('joi');
const mongoose = require('mongoose');
const {cartOrderSchema} = require('./cartOrders'); 
const {ProductSchema} = require('./products');

const orderSchema =  new mongoose.Schema({
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
  },
  customer: {
    type: new mongoose.Schema({
      UserName: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
      },
      Email: {
        type: String,
        unique : true,
        required: true,
        minlength: 5,
        maxlength: 255
      },Phone: {
        type: Number,
        required: true,
        min :10 
      },
      Address: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
      }
    }),  
    required: true
  },
  // product:
  //    {
  //   type: new mongoose.Schema({
  //   Pro_Name: {
  //     type: String,
  //     required: true,
  //     minlength: 5,
  //     maxlength: 50
  //   },
  //   Pro_Price: {
  //     type: Number,
  //     required: true
  //     },
  //   Pro_IMG: {
  //       type: String,
  //       minlength: 5,
  //       maxlength: 50
  //     },
  //   Pro_Qty: {
  //     type: Number,
  //     min: 1
  //     }
  //   }),
  //   require: true
  // }
  product:{
    type : [ProductSchema],
    required :true
  }
  // cartOrder :{
  //   type :cartOrderSchema,
  //   required :true
  // }
 
  });
const Order = mongoose.model('Order',orderSchema);
  
  function validateOrder(order) {
    const schema = {
      Name: Joi.string().min(3).required(),
      Address: Joi.string().required(),
      City: Joi.string().required(),
      Phone: Joi.number().required(),
      Payment: Joi.string().required(),
      OrderPrice: Joi.number().required(),
      customerID:Joi.objectId(),
      productID:Joi.objectId(),
      // cartOrderID:Joi.objectId()
      
    };
  
    return Joi.validate(order, schema);
  }
  
  exports.Order = Order; 
  exports.validate = validateOrder;