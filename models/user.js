/*jshint esversion: 6 */
const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken'); 
const config = require('config');

const userSchema=  new mongoose.Schema({
  name: {
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
  },
  Password :{
    type :String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  isAdmin : Boolean
});

userSchema.methods.generateAuthToken = function(){
  const token = jwt.sign({_id :this._id, isAdmin:this.isAdmin ,name : this.name ,Email :this.Email} ,config.get('jwtPrivateKey'));
  return token; 
};
const User = mongoose.model('User',userSchema);


function validateUser(user) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    Email :Joi.string().required().email().min(5).max(255),
    Password : Joi.string().min(5).max(255).required(),
    isAdmin : Joi.boolean()
  };

  return Joi.validate(user, schema);
}

exports.User = User; 
exports.validate = validateUser;