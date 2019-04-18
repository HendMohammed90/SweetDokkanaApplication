/*jshint esversion: 6 */
const Joi = require('joi');
const mongoose = require('mongoose');
const {CategorySchema} = require('./categories');

const ProductSchema=  new mongoose.Schema({
  Pro_Name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
    },
  Category: {
    type: CategorySchema,
    required: true  
    },
  Pro_Description: {
      type: String,
      minlength: 5,
      maxlength: 50
    },
  Pro_Price: {
    type: Number,
    required: true
  },
  ProIMG:String,
  numberInStock: { 
    type: Number, 
    min: 0,
    max: 255
  },
  Status:{
    type:Boolean
  },
  DateOfAdding:{
    type:Date ,
    default :Date.now
  }
    
  });

const Product = mongoose.model('Product',ProductSchema);

  //the reviw must be here ^_^
  
  function validateProduct(product) {
    const schema = {
      Pro_Name: Joi.string().min(3),
      CategoryId: Joi.objectId(),
      numberInStock: Joi.number(),
      Pro_Description: Joi.string(),
      Pro_Price: Joi.number(),
      ProIMG:  Joi.only(),
      Status :Joi.boolean()
    };
  
    return Joi.validate(product, schema);
  }
  
  exports.Product = Product; 
  exports.validate = validateProduct;
  exports.ProductSchema= ProductSchema;