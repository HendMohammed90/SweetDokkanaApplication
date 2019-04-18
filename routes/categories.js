/*jshint esversion: 6 */
/* jshint ignore:start */

// const auth = require('../middleware/auth')
const admin = require('../middleware/admin');
const {Category, validate} = require('../models/categories');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
require('express-async-errors');
const {ensureAuthenticated} = require('../config/auth');


router.get('/',async (req, res)=>{     
    const categories = await Category.find();
    res.send(categories);
});


router.get('/:id', async(req, res)=>{     
    const category = await Category.findById(req.params.id);

    if(!category) return res.status(404).send('Product with given ID is not found');
    
    res.send(category);
}
);


router.post('/' ,async(req, res)=>{     
    const {error} = validate(req.body);
    if (error) return res.status(404).send(error.details[0].message);

    //create the new Product
    const newCategory = new Category({ 
        CategoryName: req.body.CategoryName
        });

    await newCategory.save();
     
    res.send(newCategory);
});


router.put('/:id',ensureAuthenticated,async(req, res)=>{     
    const {error} = validate(req.body);
    if (error) return res.status(404).send(error.details[0].message);

    //update the Order
    const UpdatedCategory = await Category.findByIdAndUpdate(req.params.id, {
        CategoryName: req.body.CategoryName
        }, {
        new: true
      });

    //return the updated product
    res.send(UpdatedCategory);
});

router.delete('/:id',ensureAuthenticated ,async(req, res)=>{     
    const DeletedCategory = await Category.findByIdAndRemove(req.params.id);

    if(!DeletedCategory) return res.status(404).send('genre is not found');

    res.send(DeletedCategory);
});

module.exports = router;