/*jshint esversion: 6 */
/* jshint ignore:start */

const auth = require('../middleware/auth');
const {Product, validate} = require('../models/products');
const{Category} = require('../models/categories');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
require('express-async-errors');
const multer = require('multer');
const storage =multer.diskStorage({
    destination : function(req ,file , cb){
        cb(null, 'public/assets/imgs/productIMGS/');
    },
    filename: function(req ,file,cb){
        cb(null, new Date().toISOString() + file.originalname)
    }
})
const fileFilter =(req ,file , cb)=>{
    if(file.mimetype=='image/jpeg'|| file.mimetype=='image/jpg')
    {
        cb(null,true)
    }else{
        cb(null,false)
    }
};
const upload = multer({
    storage: storage,
    fileFilter :fileFilter

});



router.get('/:pageNo?',async(req, res)=>{   
   
    let pageNo = 1;
    if(req.params.pageNo){
        pageNo = parseInt(req.params.pageNo)
    }
    if(req.params.pageNo==0 ||req.params.pageNo<0) {
        pageNo = 1
    }  
    let q= {
        skip :5 * (pageNo -1),
        limit : 5
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
            pageNo :pageNo
        });
    })
    // const products = await Product.find({});
    // res.send(products);
  
    // console.log(products);
});


router.get('/Cakes', async(req, res)=>{ 
 
    const products = await Product.find( { 'Category.CategoryName' : 'cakes' });

    if(!products) return res.status(404).send('products on given Category is not found');
    
    // res.send(product);
    res.render("catalog.ejs" , 
        {
            data :"Welcom To our render Page",
            title : "Main Page",
            products :products
        });
    console.log(products);
});

router.get('/Bastry', async(req, res)=>{ 
 
    const products = await Product.find( { 'Category.CategoryName' : 'Pastry' });

    if(!products) return res.status(404).send('products on given Category is not found');
    
    // res.send(product);
    res.render("catalog.ejs" , 
        {
            data :"Welcom To our render Page",
            title : "Main Page",
            products :products
        });
    console.log(products);
});


router.get('/Oriental', async(req, res)=>{ 
 
    const products = await Product.find( { 'Category.CategoryName' : 'oriental' });

    if(!products) return res.status(404).send('products on given Category is not found');
    
    // res.send(product);
    res.render("catalog.ejs" , 
        {
            data :"Welcom To our render Page",
            title : "Main Page",
            products :products
        });
    console.log(products);
});


router.get('/Western',async(req, res)=>{ 
 
    const products = await Product.find( { 'Category.CategoryName' : 'Western Sweets' });

    if(!products) return res.status(404).send('products on given Category is not found');
    
    // res.send(product);
    res.render("catalog.ejs" , 
        {
            data :"Welcom To our render Page",
            title : "Main Page",
            products :products
        });
    console.log(products);
});


router.get('/:id', async(req, res)=>{     
    const product = await Product.findById(req.params.id);

    if(!product) return res.status(404).send('Product with given ID is not found');
    
    // res.send(product);
    res.render("EditeProduct.ejs" , 
    {
        message :"Welcom To our Edite Product Page" ,
        product :product
    });
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
        Pro_IMG:  req.files.Pro_IMG,
        Status :req.body.Status
    });

    await newProduct.save();
     
    // res.send(newProduct);
    res.render("EditeProduct.ejs" , 
        {
            data :"Welcom To our render Page",
            title : "Main Page",
            newProduct :newProduct
        });
    console.log(newProduct);
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


router.delete('/:id' , async(req, res)=>{     
    //find the Product
    const DeletedProduct = await Product.findByIdAndRemove(req.params.id);

    if(!DeletedProduct) return res.status(404).send('Product is not found');

    res.redirect('/api/products');
} ) 

module.exports = router; 