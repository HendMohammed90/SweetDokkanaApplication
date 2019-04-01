/*jshint esversion: 6 */
/* jshint ignore:start */
const winston= require('winston');
const mongoose = require('mongoose');

module.exports = function(){
    mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/Sweets', { useNewUrlParser: true })
    .then(() => winston.info('Connected to MongoDB...'));
  
};