/*jshint esversion: 6 */
/* jshint ignore:start */
// const auth= require('../middleware/auth');
// const cookieParser = require('cookie-parser'); 
const {User, validate} = require('../models/user'); 
const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
const {ensureAuthenticated} = require('../config/auth');
const {Order} = require('../models/orders');
require('../config/passport-setup')(passport);
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
require('express-async-errors'); //here we tell the app to use this middelware in every routs
// router.use(cookieParser());


// passport.use('AdminPanal-signup',
// new LocalStrategy({ usernameField: 'Email',passwordField: 'Password' }, (Email, Password, done) => {
//   // Match user
//   User.findOne({
//     Email: Email
//   }).then(user => {
//         if (!user) {
//         return done(null, false, { message: 'That Email is not registered' });
//         }

//         // Match Password
//         bcrypt.compare(Password, user.Password, (err, isMatch) => {
//         if (err) throw err;
//         if (isMatch) {
//             console.log(user); //here give me the user 
//             return done(null, user);
//         } else {
//             return done(null, false, { message: 'Password incorrect' });
//         }
//         });
//   }).catch(err => console.log(err));
// })
// );

// passport.serializeUser(function(user, done) {
// console.log(user); // here give me indefiend 
// done(null, user.id);
// });

// passport.deserializeUser(function(id, done) {
// User.findById(id, function(err, user) {
// done(err, user);
// });
// });


// router.use((req, res, next) => {
//   res.locals.user = req.user;
//   if(!req.session.passport){
//     return next();
//   }
//   User.findById(req.session.passport.user)
//   .then(user =>{
//     req.user = user;
//     next();
//   })
//   next()
// });


// login post request 
router.post('/', (req, res, next) => {
  passport.authenticate('AdminPanal-signup', {
    successRedirect: '/api/home',
    failureRedirect: '/api/users',
    badRequestMessage: 'Somthing Bad has happend.',
    failureFlash: true
  })(req, res, next);
});


//  login user view 
router.get('/' ,async (req, res) =>{
  // res.send("Welcom To our application")
  res.render("login.ejs",
  {
    data : "welcom Admin ^_^ "
  });
  
  // console.log("welcom Admin ^_^");
})


// router.get('/home',async(req, res) =>{
//   const orders = await Order.find();
//   console.log(req.user); //==>this give me the user 

//   res.render("index.ejs" , 
//       {
//           orders :orders,
//           name : req.user.name
//       });
//   // console.log(orders);
//   console.log(req.session.passport);
  
// });


// sign up form 
router.get('/singup', (req,res)=> {
  res.render('signup.ejs',
  {
    data : "welcom To Joining us ^_^ "
  });
})



// sign up post request
router.post('/singup',async(req,res)=>{

  // console.log(req.body);

  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  if(req.body.Password != req.body.confirm_Password) {
    return res.status(400).render('signup.ejs',
    {
      data : "Password Do Not Match"
    });
  }
  

  let user = await User.findOne({Email : req.body.Email});
  if(user){
    return res.status(400).render('signup.ejs',
    {
      data : "  Invalid Email It's alredy registered Pleas Sign in"
    });
  } 

  // //create the new User
   user =  new User({
    name :req.body.name,
    Email :req.body.Email,
    Password : req.body.Password,
    isAdmin : req.body.isAdmin
  });

  // console.log(user);

  //hash Password
  const salt = await bcrypt.genSalt(10);
  user.Password = await bcrypt.hash(user.Password, salt);
  
  console.log(user);

  //save the user
  await user.save();
  req.flash('success_msg', 'you are now registersd and can log in ');
  res.redirect('/api/users');
  
})


// router.get('/me',async(req ,res)=>{
// // const token =  req.cookies.x-auth-token
// // const user = await User.findById(req.user._id).select('-password');
// res.render('profile.ejs',{
//   name : req.user.name,
//   Email : req.user.Email,
//   isAdmin : req.user.isAdmin,
//   Password :req.user.Password
// })
// console.log(req.body);
// })


// logout user

router.get('/logout', (req,res)=> {
  // res.send("log Out");
  req.logout();
  req.flash('success_msg',"You Are Logged Out");
  res.redirect('/api/users');
})

module.exports = router; 