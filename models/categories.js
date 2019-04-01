/*jshint esversion: 6 */
const Joi = require('joi');
const mongoose = require('mongoose');


const CategorySchema = new mongoose.Schema({
    CategoryName: {
        type: String,
        required: true,
        enum :['Western Sweets' ,'oriental' ,'cakes','Pastry']
    },
    date : {
        type :Date ,
        default :Date.now
    }
});
const Category = mongoose.model('Category', CategorySchema);

function validateCategory(category) {
    const schema = {
        CategoryName: Joi.string().required()
    };

    return Joi.validate(category, schema);
}


exports.Category = Category; 
exports.validate = validateCategory;
exports.CategorySchema =CategorySchema;