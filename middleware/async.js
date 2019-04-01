/*jshint esversion: 6 */
/* jshint ignore:start */
module.exports = function asyncMiddleware(hundler){
    return async(req ,res ,next)=>{
      try{
        await hundler(req ,res);
      }catch(ex){
        next(ex);
      }
    }
  };

  //this implemintiation for cathing errors have an npm can be replace it npm (express-async-errors) 