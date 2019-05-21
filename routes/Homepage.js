/*jshint esversion: 6 */
/* jshint ignore:start */

const {Product} = require('../models/products');
const{Category} = require('../models/categories');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
require('express-async-errors');


router.get('/',async(req, res) =>{
    const categories = await Category.find();
    // console.log(categories);

    const products = await Product.find();
    // console.log(products);

  console.log(req); //==>this give me undefined 
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
      user : req.session.user
    });
  }
    
});

router.get('/about',async(req, res) =>{
    res.render("About.ejs");
    
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
        res.render("product.ejs" , 
        {
            products :products,
            total :parseInt(totalDocs),
            pageNo :pageNo,
            categories :categories
        });
    })

    // console.log(products);
    
});
//get diffrent types of prroducts
router.get('/product/select/:category',async(req, res)=>{ 

    let categoryName = req.params.category;
    // console.log(categoryName);
    const products = await Product.find( { 'Category.CategoryName' : categoryName });
    console.log(products);
    res.render("ProductTypes.ejs",{
        products :products
    })
    
});


router.get('/contact',async(req, res) =>{
    res.render("contact.ejs");
});

router.post('/contact',async(req, res) =>{
    res.render("contact.ejs");
});

router.get('/forgot_password',async(req, res) =>{
    res.render("forgot_password.ejs");
});

router.post('/forgot_password',async(req, res) =>{
    res.render("forgot_password.ejs");
});

//Creat a customer
router.get('/account',async(req, res) =>{
    res.render("account.ejs",{
        data : " "
    });
});

// //Post The New customer
// router.post('/account',async(req, res) =>{
//     res.render("account.ejs",{
//         data : " "
//     });
    
// });

//Get The Customer Info
router.get('/myAccount',async(req, res) =>{
    res.render("myAccount.ejs");
});

//Ubdate The Customer Info
//=====>

//get main product
router.get('/productDescription/:id',async(req, res) =>{
    const product = await Product.findById(req.params.id);

    if(!product) return res.status(404).send('Product with given ID is not found');
    
    // console.log(product);

    res.render("productDescription.ejs" , 
    {
        product :product
    });

  
});

router.get('/search',async(req, res) =>{
    res.render("search.ejs");
});
// :productName/:categoryType/:searchInProductName/:searchInProductDeescription

router.post('/search',(req, res) =>{
    let nameOfProduct = req.body.productName;
    res.render("search.ejs");
    console.log(req.body.productName);
});



module.exports = router; 