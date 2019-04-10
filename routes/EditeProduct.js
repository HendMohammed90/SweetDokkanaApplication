/*jshint esversion: 6 */
/* jshint ignore:start */

const fileUpload = require('express-fileupload');
const auth = require('../middleware/auth');
const {Product, validate} = require('../models/products');
const{Category} = require('../models/categories');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
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
require('express-async-errors');



router.get('/' ,async(req, res)=>{     
    res.render("AddProduct.ejs" , 
    {
        message : ""
    });
});


// router.post('/',auth ,async(req, res)=>{   
router.post('/',upload.single('Pro_IMG') ,async(req, res)=>{     
    if(!req.file) return res.status(400).send("No Product has been Ubloded");

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
        Pro_IMG:  req.file.filename,
        Status :req.body.Status
    });

    console.log(req.file);
    await newProduct.save();
    console.log(newProduct);
    res.render("AddProduct.ejs" , 
    {
        message :`A new Product has been added to database ^_^` 
    });

});

router.get('/:id',upload.single('Pro_IMG'), async(req, res)=>{     
    const product = await Product.findById(req.params.id);

    if(!product) return res.status(404).send('Product with given ID is not found');
    
    
    res.render("EditeProduct.ejs" , 
    {
        message :"" ,
        product :product
    });
    console.log(req.file);
    console.log(product);
});


// router.put('/:id',auth , async(req, res)=>{     
router.put('/:id', async(req, res)=>{     
    //validate the Product
    const {error} = validate(req.body);
    if (error) return res.status(404).send(error.details[0].message);

    //update the Product
    const UpdatedProduct = await Product.findByIdAndUpdate(req.params.id, {
        Pro_Name: req.body.Pro_Name,
        Category: {
            _id: category.id,
            CategoryName: category.CategoryName
        },
        numberInStock: req.body.numberInStock,
        Pro_Description: req.body.Pro_Description,
        Pro_Price: req.body.Pro_Price,
        Pro_IMG:  req.file.filename,
        Status :req.body.Status      
        }, {
        new: true
      });

    //return the updated product
    console.log(UpdatedProduct);
    res.render("EditeProduct.ejs",
    {
        message :`The Product has been Ubdated ^_^` 
    })
});

router.get('/delete/:id' , async(req, res)=>{     
    //find the Product
    const DeletedProduct = await Product.findByIdAndRemove(req.params.id);

    if(!DeletedProduct) return res.status(404).send('Product is not found');

    res.send(DeletedProduct);
    // console.log(DeletedProduct);
    // res.render("catalog.ejs" );
} ) 


module.exports = router; 