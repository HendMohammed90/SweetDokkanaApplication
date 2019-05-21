/*jshint esversion: 6 */
/* jshint ignore:start */

const {Product, validate} = require('../models/products');
const {ensureAuthenticated} = require('../config/auth');
const{Category} = require('../models/categories');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
require('express-async-errors');
const fs = require('fs-extra');


router.get('/:pageNo?',ensureAuthenticated,async(req, res)=>{   
   
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
        res.render("catalog.ejs" , 
        {
            data :"Welcom To our render Page",
            title : "Main Page",
            products :products,
            total :parseInt(totalDocs),
            pageNo :pageNo,
            name : req.user.name
        });
    })
   
  
    // console.log(products);
});

router.get('/Cakes', ensureAuthenticated,async(req, res)=>{ 
 
    const products = await Product.find( { 'Category.CategoryName' : 'cakes' });

    if(!products) return res.status(404).send('products on given Category is not found');
    
  
    // res.send(products);
    res.render("catalog.ejs" , 
        {
            data :"Welcom To our render Page",
            title : "Main Page",
            products :products,
            name : req.user.name
        });
    console.log(products);
});

router.get('/Bastry', ensureAuthenticated,async(req, res)=>{ 
 
    const products = await Product.find( { 'Category.CategoryName' : 'Pastry' });

    if(!products) return res.status(404).send('products on given Category is not found');
    
    // res.send(product);
    res.render("catalog.ejs" , 
        {
            data :"Welcom To our render Page",
            title : "Main Page",
            products :products,
            name : req.user.name
        });
    console.log(products);
});


router.get('/Oriental', ensureAuthenticated,async(req, res)=>{ 
 
    const products = await Product.find( { 'Category.CategoryName' : 'oriental' });

    if(!products) return res.status(404).send('products on given Category is not found');
    
    // res.send(product);
    res.render("catalog.ejs" , 
        {
            data :"Welcom To our render Page",
            title : "Main Page",
            products :products,
            name : req.user.name
        });
    console.log(products);
});


router.get('/Western',ensureAuthenticated,async(req, res)=>{ 
 
    const products = await Product.find( { 'Category.CategoryName' : 'Western Sweets' });

    if(!products) return res.status(404).send('products on given Category is not found');
    
    // res.send(product);
    res.render("catalog.ejs" , 
        {
            data :"Welcom To our render Page",
            title : "Main Page",
            products :products,
            name : req.user.name
        });
    console.log(products);
});


router.get('/:id', ensureAuthenticated,async(req, res)=>{     
    const product = await Product.findById(req.params.id);

    if(!product) return res.status(404).send('Product with given ID is not found');
    
    // res.send(product);
    res.render("EditeProduct.ejs" , 
    {
        message :"Welcom To our Edite Product Page" ,
        product :product,
        name : req.user.name
    });
});




router.post('/' ,ensureAuthenticated,async(req, res)=>{     
    const {error} = validate(req.body);
    if (error) return res.status(404).send(error.details[0].message);

    const category = await Category.findById(req.body.CategoryId);
    if(!category) return res.status(404).send('Invalide Category');

    //create the new Product
    const newProduct = new Product({ 
        Pro_Name: req.body.Pro_Name,
        Category: {
            _id: category.id,
            CategoryName: category.CategoryName
        },
        numberInStock: req.body.numberInStock,
        Pro_Description: req.body.Pro_Description,
        Pro_Price: req.body.Pro_Price,
        Pro_IMG:  req.files.Pro_IMG,
        Status :req.body.Status
    });

    await newProduct.save();
     
    // res.send(newProduct);
    res.render("EditeProduct.ejs" , 
        {
            data :"Welcom To our render Page",
            title : "Main Page",
            newProduct :newProduct,
            name : req.user.name
        });
    console.log(newProduct);
});


router.put('/:id' , ensureAuthenticated,async(req, res)=>{     
    //validate the Product
    const {error} = validate(req.body);
    if (error) return res.status(404).send(error.details[0].message);

    //update the Product
    const UpdatedProduct = await Product.findByIdAndUpdate(req.params.id, {
        Pro_Name: req.body.Pro_Name,
        Pro_Category: req.body.CategoryId,
        numberInStock: req.body.numberInStock,
        Pro_Description: req.body.Pro_Description,
        Pro_Price: req.body.Pro_Price,
        Pro_IMG: req.body.Pro_IMG,
        Status: req.body.Status        
        }, {
        new: true
      });

    //return the updated product
    res.send(UpdatedProduct);
});

// router.delete('/delete/:id' , ensureAuthenticated,async(req, res)=>{     
router.get('/delet/:id' , ensureAuthenticated,async(req, res)=>{     
    //find the Product
    const DeletedProduct = await Product.findByIdAndRemove(req.params.id);

    if(!DeletedProduct) return res.status(404).send('Product is not found');
    req.flash('success_msg' , 'Product has been deleted -_-')
    res.redirect('/api/products');
} ) 

module.exports = router; 