/*jshint esversion: 6 */
/* jshint ignore:start */

const auth = require('../middleware/auth');
const {Product, validate} = require('../models/products');
const{Category} = require('../models/categories');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
require('express-async-errors');

router.get('/',async(req, res)=>{     
    const products = await Product.find();
    res.send(products);
});

router.get('/Cakes', async(req, res)=>{ 
 
    const product = await Product.find( { 'Category.CategoryName' : 'cakes' });

    if(!product) return res.status(404).send('Product on given Category is not found');
    
    res.send(product);
});

router.get('/Bastry', async(req, res)=>{ 
 
    const product = await Product.find( { 'Category.CategoryName' : 'Pastry' });

    if(!product) return res.status(404).send('Product on given Category is not found');
    
    res.send(product);
});


router.get('/Oriental', async(req, res)=>{ 
 
    const product = await Product.find( { 'Category.CategoryName' : 'oriental' });

    if(!product) return res.status(404).send('Product on given Category is not found');
    
    res.send(product);
});


router.get('/Western',async(req, res)=>{ 
 
    const product = await Product.find( { 'Category.CategoryName' : 'Western Sweets' });

    if(!product) return res.status(404).send('Product on given Category is not found');
    
    res.send(product);
});


router.get('/:id', async(req, res)=>{     
    const product = await Product.findById(req.params.id);

    if(!product) return res.status(404).send('Product with given ID is not found');
    
    res.send(product);
});


router.post('/',auth ,async(req, res)=>{     
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
        Pro_IMG: req.body.Pro_IMG,
        Status :req.body.Status
    });

    await newProduct.save();
     
    res.send(newProduct);
});


router.put('/:id',auth , async(req, res)=>{     
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

// "Category" :{
//     "id" :"5ca0cb162815061e7d400f77" ,
//     "CategoryName" :"Pastry"
// } , I Can't Ubdate the category of product -_-


router.delete('/:id',auth , async(req, res)=>{     
    //find the Product
    const DeletedProduct = await Product.findByIdAndRemove(req.params.id);

    if(!DeletedProduct) return res.status(404).send('genre is not found');

    res.send(DeletedProduct);
} ) 

module.exports = router; 