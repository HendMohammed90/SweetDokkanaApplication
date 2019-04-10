/*jshint esversion: 6 */
const express = require('express');
const winston= require('winston');
const app = express();
require('./startup/logging');
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();


const port = process.env.PORT || 3000;
app.listen(port, () => winston.info(`Listening on port ${port}...`));

//I have three errors first can't ubdate a product the rout of put working as post 
//second the source of Img Dosn't make it Appear 
//Third also the category dosn't appear

