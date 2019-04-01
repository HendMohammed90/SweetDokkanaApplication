/*jshint esversion: 6 */
/* jshint ignore:start */

const winston= require('winston');

module.exports = function( err ,req ,res ,next){
    winston.error(err.message , err);
    res.status(500).send('Internal server error');
    console.log("Could not read file: " + err);
};