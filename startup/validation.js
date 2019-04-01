/*jshint esversion: 6 */
/* jshint ignore:start */
const Joi = require('joi');
module.exports = function(){
Joi.objectId = require('joi-objectid')(Joi);

}