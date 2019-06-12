/*jshint esversion: 6 */
/* jshint ignore:start */

const {Product} = require('../models/products');
const{Category} = require('../models/categories');
const express = require('express');
const router = express.Router();
require('express-async-errors');
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const {Customer} = require('../models/customer'); 

passport.use('sweetDokkana-signup',
    new LocalStrategy({ usernameField: 'Email',passwordField: 'Password' }, (Email, Password, done) => {
      // Match user
      Customer.findOne({
        Email: Email
      }).then(user => {
            if (!user) {
            return done(null, false, { message: 'That Email is not registered' });
            }
    
            // Match Password
            if(Password === user.Password){
                console.log(user);
                return done(null, user);
            }else{
                return done(null, false, { message: 'Password incorrect' });
            }
      }).catch(err => console.log(err));
    })
);

passport.serializeUser(function(user, done) {
done(null, user.id);
});

passport.deserializeUser(function(id, done) {
Customer.findById(id, function(err, user) {
    done(err, user);
});
});


router.use((req, res, next) => {
    res.locals.user = req.user
    next()
});

router.use((req, res, next) => {
  res.locals.user = req.user;
  if(!req.session.passport){
    return next();
  }
  Customer.findById(req.session.passport.user)
  .then(user =>{
    req.user = user;
    next();
  })
  next()
});



router.post('/', (req, res, next) => {
    passport.authenticate('sweetDokkana-signup', {
      successRedirect: '/',
      failureRedirect: '/',
      badRequestMessage: 'Somthing Bad has happend.',
      failureFlash: true
    })(req, res, next);
    
  });


router.get('/',async(req, res) =>{
    const categories = await Category.find();
    // console.log(categories);

    const products = await Product.find();
    // console.log(products);
    //console.log(req.user);
  if(typeof req.user == "undefined"){
    res.render("HomePage.ejs" , 
    {
      products :products,
      categories :categories
    });
  }else{
    res.render("HomePage.ejs" , 
    {
      products :products,
      categories :categories,
      user : req.user
    });
  }
    
});

router.get('/about',async(req, res) =>{
    if(typeof req.user == "undefined"){
        res.render("About.ejs");
      }else{
        res.render("About.ejs" , 
        {
          user : req.user
        });
      }
    
});


router.get('/product/:pageNo?',async(req, res) =>{
   
    const categories = await Category.find();
    let pageNo = 1;
    if(req.params.pageNo){
        pageNo = parseInt(req.params.pageNo)
    }
    if(req.params.pageNo==0 ||req.params.pageNo<0) {
        pageNo = 1
    }  
    let q= {
        skip :6 * (pageNo -1),
        limit : 6
    }
    const products = await Product.find({},{},q);
    //find total NU of Documants
    let totalDocs = 0 ;
    // console.log(products.length);
    Product.countDocuments({},(err,total)=>{

    }).then((response)=>{
        totalDocs = parseInt(response);
        // console.log(response)
        if(typeof req.user == "undefined"){
            res.render("product.ejs",{
                products :products,
                total :parseInt(totalDocs),
                pageNo :pageNo,
                categories :categories
            });
          }else{
            res.render("product.ejs" , 
            {
                products :products,
                total :parseInt(totalDocs),
                pageNo :pageNo,
                categories :categories,
                user : req.user
            });
          }

    })

    // console.log(products);
    
});
//get diffrent types of prroducts
router.get('/product/select/:category',async(req, res)=>{ 

    let categoryName = req.params.category;
    // console.log(categoryName);
    const products = await Product.find( { 'Category.CategoryName' : categoryName });
    console.log(products);
    
    if(typeof req.user == "undefined"){
        res.render("ProductTypes.ejs",{
            products :products
        });
      }else{
        res.render("ProductTypes.ejs" , 
        {
        products :products,
          user : req.user
        });
      }
    
});


router.get('/contact',async(req, res) =>{
    if(typeof req.user == "undefined"){
        res.render("contact.ejs");
      }else{
        res.render("contact.ejs" , 
        {
          user : req.user
        });
      }
});

router.post('/contact',async(req, res) =>{
   
    if(typeof req.user == "undefined"){
        res.render("contact.ejs");
      }else{
        res.render("contact.ejs" , 
        {
          user : req.user
        });
      }
});

router.get('/forgot_password',async(req, res) =>{
   

    if(typeof req.user == "undefined"){
        res.render("forgot_password.ejs");
      }else{
        res.render("forgot_password.ejs" , 
        {
          user : req.user
        });
      }
});

router.post('/forgot_password',async(req, res) =>{
  
    if(typeof req.user == "undefined"){
        res.render("forgot_password.ejs");
      }else{
        res.render("forgot_password.ejs" , 
        {
          user : req.user
        });
      }
});

//Creat a customer
router.get('/account',async(req, res) =>{

    if(typeof req.user == "undefined"){
        res.render("account.ejs");
      }else{
        res.render("account.ejs" , 
        {
          user : req.user
        });
      }
});


//Get The Customer Info
router.get('/myAccount',async(req, res) =>{
    res.render("myAccount.ejs");

    if(typeof req.user == "undefined"){
        res.render("myAccount.ejs");
      }else{
        res.render("myAccount.ejs" , 
        {
          user : req.user
        });
      }
});
router.get('/logout',(req, res) =>{
    req.logOut();
    req.flash('success_msg',"You Are Logged Out");
    res.redirect('/');
});

//Ubdate The Customer Info
//=====>
router.post('/myAccount',async(req, res) =>{
    res.render("myAccount.ejs");

    if(typeof req.user == "undefined"){
        res.render("myAccount.ejs");
      }else{
        res.render("myAccount.ejs" , 
        {
          user : req.user
        });
      }
});

//get main product
router.get('/productDescription/:id',async(req, res) =>{
    const product = await Product.findById(req.params.id);

    if(!product) return res.status(404).send('Product with given ID is not found');
    
    console.log(product);

    if(typeof req.user == "undefined"){
        res.render("productDescription.ejs",{
            product :product
        });
      }else{
        res.render("productDescription.ejs" , 
        {
        product :product,
        user : req.user
        });
      }

  
});

router.get('/search',async(req, res) =>{
    if(typeof req.user == "undefined"){
        res.render("search.ejs",{
            product :product
        });
      }else{
        res.render("search.ejs" , 
        {
        product :product,
          user : req.user
        });
      }
});

// { productName: 'cacke1',
//   categoryType: 'Western Sweets',
//   searchInProductName: '1',
//   searchInProductDeescription: '1' }

router.post('/search',async(req, res) =>{
    let nameOfProduct = req.body.productName;
    let typeOfProduct = req.body.categoryType;
    let SInPN = req.body.searchInProductName;
    let SInPD= req.body.searchInProductDeescription;

    const products = await Product.find({'Pro_Name':nameOfProduct , 'Category.CategoryName':typeOfProduct});

    // if(!products){
    //     res.render("search.ejs");
    //     console.log("error Product not found");
    //     return;
    // }else{
    //     res.render("searchResults.ejs",{
    //         products :products
    //     });
    //     console.log(products);
    // }

    
    // if(!product) return res.status(404).render("404.ejs" ,{
    //     data : 'Product is not found'

    // });


    // res.render("search.ejs");
    // console.log(req.body);
});



module.exports = router; 