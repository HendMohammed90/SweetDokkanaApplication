/*jshint esversion: 6 */
/* jshint ignore:start */


const Joi = require('joi');
const mongoose = require('mongoose');
Joi.objectId = require('joi-objectid')(Joi);
const CartOrder = mongoose.model('CartOrder', new mongoose.Schema({  
  customer: {
    type: new mongoose.Schema({
      UserName: {
        type: String,
        require: true,
        minlength: 3,
        maxlength: 50
      }
    }),
    required:true
  },
  product: {
    type: new mongoose.Schema({
      Pro_Name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
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
    Pro_IMG: {
        type: String,
        minlength: 5,
        maxlength: 50
      }
    }),
    require: true
  },
    SelectedQuantity: {
        type: Number,
    }
  }));
  //I need here to adjust the category to an array to add more then a product
  function validateCartOrder(cartOrder) {
    const schema = {
      customerId: Joi.objectId().min(3).required(),
      productId: Joi.objectId().min(3).required(),
      SelectedQuantity: Joi.number(),
    };
  
    return Joi.validate(cartOrder, schema);
  }
  
  exports.CartOrder = CartOrder; 
  exports.validate = validateCartOrder;