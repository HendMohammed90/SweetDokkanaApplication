/*jshint esversion: 6 */
/* jshint ignore:start */

const fileUpload = require('express-fileupload');
const {ensureAuthenticated} = require('../config/auth');
// const auth = require('../middleware/auth');
const {Product, validate} = require('../models/products');
const{Category} = require('../models/categories');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
// const multer = require('multer');
// const storage =multer.diskStorage({
//     destination : function(req ,file , cb){
//         cb(null, 'public/assets/imgs/productIMGS/');
//     },
//     filename: function(req ,file,cb){
//         cb(null, new Date().toISOString() + file.originalname)
//     }
// })
// const fileFilter =(req ,file , cb)=>{
//     if(file.mimetype=='image/jpeg'|| file.mimetype=='image/jpg')
//     {
//         cb(null,true)
//     }else{
//         cb(null,false)
//     }
// };
// const upload = multer({
//     storage: storage,
//     fileFilter :fileFilter

// });

const mkdirp = require('mkdirp');
const fs = require('fs-extra');
const resizeImg= require('resize-img');
require('express-async-errors');



router.get('/',ensureAuthenticated ,async(req, res)=>{     
    res.render("AddProduct.ejs" , 
    {
        message : "",
        name : req.user.name
    });
});


// router.post('/',auth ,async(req, res)=>{   
router.post('/',ensureAuthenticated,async(req, res)=>{     
    if(!req.files) return res.status(400).send("No Product has been Ubloded");

    const {error} = validate(req.body);
    if (error) return res.status(404).send(error.details[0].message);

    const category = await Category.findById(req.body.CategoryId);
    if(!category) return res.status(404).send('Invalide Category');

    //create the new Product
    let files = req.files.image;
    // console.log(files);
    console.log(req.body)
    let newProduct = new Product({ 
        Pro_Name: req.body.Pro_Name,
        Category: {
            _id: category.id,
            CategoryName: category.CategoryName
        },
        numberInStock: req.body.numberInStock,
        Pro_Description: req.body.Pro_Description,
        Pro_Price: parseFloat(req.body.Pro_Price).toFixed(2),
        ProIMG:files.name,
        Status :req.body.Status
    });
   
    //  //upload the pic
     let fileExtenion =newProduct.ProIMG.split('.')[1];
    //  console.log(fileExtenion)
     let imageName = newProduct._id + "."+fileExtenion ;
    //  console.log(imageName);
     
     console.log(files.mimetype)
            if( files.mimetype=='image/jpeg' ||
            files.mimetype=='image/png' ||
            files.mimetype=='image/jpg' ||
            files.mimetype=='image/gif' ){
                files.mv('public/assets/imgs/productIMGS/' + imageName , (err)=>{
                if(err) return res.status(500).send(err)
            })
        // res.redirect("/"); //here if i want to come back to the home page
            await newProduct.save();
            res.render("AddProduct.ejs" , 
            {
                message :`A new Product has been added to database ^_^` ,
                name : req.user.name
            });
            console.log(newProduct);
        }else{
            res.render("AddProduct.ejs" , 
            {
                message : "Invalid image formatt it should be PNG or Jpeg or JPG or Gif",
                name : req.user.name
        });
     }
    //  console.log(newProduct._id+"."+newProduct.ProIMG.split('.')[1])
});

router.get('/:id',ensureAuthenticated, async(req, res)=>{     
    const product = await Product.findById(req.params.id);

    if(!product) return res.status(404).send('Product with given ID is not found');
    
    
    res.render("EditeProduct.ejs" , 
    {
        message :"" ,
        product :product,
        name : req.user.name
    });

    // console.log(product);
});


// router.put('/:id',auth , async(req, res)=>{     
router.post('/:id',ensureAuthenticated, async(req, res)=>{     
    //validate the Product
    const {error} = validate(req.body);
    if (error) return res.status(404).send(error.details[0].message);

    const category = await Category.findById(req.body.CategoryId);
    if(!category) return res.status(404).send('Invalide Category');
    
    //this simple code for deleting the img befor ubdate
    // const fs = require('fs');
    // fs.unlink(__dirname+ '/test.txt', function (err) {            
    //      if (err) {                                                 
    //          console.error(err);                                    
    //      }                                                          
    //     console.log('File has been Deleted');                           
    //  });  
    
    let files = req.files.image;
    console.log(files);
    // update the Product
    const UpdatedProduct = await Product.findByIdAndUpdate(req.params.id, {
        Pro_Name: req.body.Pro_Name,
         Category: {
            _id: category.id,
            CategoryName: category.CategoryName
        },
        numberInStock: req.body.numberInStock,
        Pro_Description: req.body.Pro_Description,
        Pro_Price: parseFloat(req.body.Pro_Price).toFixed(2),
        ProIMG:files.name,
        Status :req.body.Status 
        }, {
        new: true
      });

      //  //upload the pic
     let fileExtenion =UpdatedProduct.ProIMG.split('.')[1];
     //  console.log(fileExtenion)
      let imageName = UpdatedProduct._id + "."+fileExtenion ;
     //  console.log(imageName);
      

    //ubdate the image and return the product
    if( files.mimetype=='image/jpeg' ||
            files.mimetype=='image/png' ||
            files.mimetype=='image/jpg' ||
            files.mimetype=='image/gif' ){
                files.mv('public/assets/imgs/productIMGS/' + imageName , (err)=>{
                if(err) return res.status(500).send(err)
            })
            res.render("EditeProduct.ejs",
                {
                    message :`The Product has been Ubdated ^_^` ,
                    name : req.user.name
                })
            console.log(newProduct);
            }else{
                res.render("EditeProduct.ejs" , 
                {
                    message : "Invalid image formatt it should be PNG or Jpeg or JPG or Gif",
                    name : req.user.name
            });
     }

    //return the updated product
    console.log(UpdatedProduct);
    
});

router.get('/delete/:id', ensureAuthenticated, async(req, res)=>{     
    //find the Product
    const DeletedProduct = await Product.findByIdAndRemove(req.params.id);

    if(!DeletedProduct) return res.status(404).send('Product is not found');

    res.send(DeletedProduct);
    // console.log(DeletedProduct);
    // res.render("catalog.ejs" );
} ) 


module.exports = router; 