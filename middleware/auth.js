/*jshint esversion: 6 */
/* jshint ignore:start */
const jwt = require('jsonwebtoken'); 
const config = require('config');

module.exports = function(req ,res, next){
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).send('Access denied, no token provided');

    try{
        const decoded = jwt.verify(token , config.get('jwtPrivateKey'));
        req.user = decoded;
        next()
    }catch(ex){
        res.status(400).send('Invalid Token');
    }
};
///this middelware is to Authorize the user to do something
