/*jshint esversion: 6 */
/* jshint ignore:start */

//401 unauthorized
//403 forbidden

module.exports = function(req ,res, next){
 if(!req.user.isAdmin) return res.status(403).send("Forbiddin Access denied.");
 next();
};