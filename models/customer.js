/*jshint esversion: 6 */
const Joi = require('joi');
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  UserName: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  Password: {
    type :String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  Email: {
    type: String,
    unique : true,
    required: true,
    minlength: 5,
    maxlength: 255
  },
  Phone: {
    type: Number,
    required: true,
    min :10 
  },
  Address: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  DateOfCreation:{
    type:Date ,
    default :Date.now
  }
});

const Customer = mongoose.model('Customer',customerSchema);

function validateCustomer(customer) {
  const schema = {
    UserName: Joi.string().min(5).max(50).required(),
    Password: Joi.string().min(5).max(255).required(),
    Email:Joi.string().email().min(5).max(255).required(),
    Phone: Joi.number().min(10).required(),
    Address: Joi.string().min(5).max(50).required()  
};
  return Joi.validate(customer, schema);
}

exports.Customer = Customer; 
exports.validate = validateCustomer;