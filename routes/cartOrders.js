/*jshint esversion: 6 */
/* jshint ignore:start */


const Fawn = require('fawn');
const {Product} = require('../models/products');
const {Customer} = require('../models/customer')
const {CartOrder, validate} = require('../models/cartOrders');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
require('express-async-errors');


Fawn.init(mongoose);

//============================
//get the shooping cart items
router.get('/', async(req, res)=>{     
    // res.send(cartOrders);
    if (req.session.cartOrders && req.session.cartOrders.length==0 ){
        delete req.session.cartOrders;
        res.redirect('back');
    }else{
        res.render("ShoppingCart.ejs" ,{
            cartOrders : req.session.cartOrders
        });
        console.log(req.session.cartOrders);
    
    }
   
});

//============================
//Add Item to the cart
router.get("/add/:productID" ,async(req,res)=>{
    const productID = req.params.productID;
    const product = await Product.findById(productID);
    // console.log(product);
    if(typeof req.session.cartOrders== "undefined"){
        req.session.cartOrders = [];
        req.session.cartOrders.push({
            product : product.Pro_Name,
            qyt : 1 ,
            price : parseFloat(product.Pro_Price).toFixed(2),
            image : '/productIMGS/'+ product._id+"."+product.ProIMG.split('.')[1]
        });
    }else{
        var cartOrders = req.session.cartOrders;
        var newItem = true;

        for (var i = 0 ; i< cartOrders.length ; i++){
            if (cartOrders[i].product == product.Pro_Name) {
                cartOrders[i].qyt++;
                newItem = false;
                break;
            }
        }

        if(newItem){
            cartOrders.push({
                product : product.Pro_Name ,
                qyt : 1 ,
                price : parseFloat(product.Pro_Price).toFixed(2),
                image : '/productIMGS/'+ product._id+"."+product.ProIMG.split('.')[1]
            });
        }
    }
    console.log(req.session.cartOrders);
    req.flash('success_msg' ,"Product has been Added To the cart");
    res.redirect('back')

})

//============================
//delet Item from the cart
router.get('/ubdate/:product' ,function (req, res){
    var product = req.params.product;
    var cartOrders = req.session.cartOrders;
    var action = req.query.action

    for (var i=0 ; i < cartOrders.length ; i++){
        if(cartOrders[i].product == product){
            switch (action){
                case "add":
                 cartOrders[i].qyt++;
                break;
                case "remove":
                 cartOrders[i].qyt--;
                 if (cartOrders[i].qyt<1) cartOrders.splice(i,1);
                break;
                case "clear":
                 cartOrders.splice(i,1);
                 if (cartOrders.length == 0 ) delete req.session.cartOrders;
                break;
                default:
                console.log("update problem");
                break;
            }
            break;
        }
    }
    req.flash('success_msg' ," cart updated");
    res.redirect('/api/cartOrders')
})


//============================
//delet all Items from the cart
router.get("/clear", function(req ,res){
    if (req.session.cartOrders ){
        delete req.session.cartOrders;
        req.flash('success_msg' ," cart Cleard");
        res.redirect('back');
        }
    })


//============================
router.get('/:id', async(req, res)=>{     
    const cartOrders = await CartOrder.findById(req.params.id);

    if(!cartOrders) return res.status(404).send('Product with given ID is not found');
    
    res.send(cartOrders);
});

//============================
router.post('/', async(req, res)=>{     
    const {error} = validate(req.body);
    if (error) return res.status(404).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(404).send('Invalide Customer');

    const product = await Product.findById(req.body.productId);
    if (!product) return res.status(404).send('Invalide Product');

    if (product.numberInStock === 0) return res.status(400).send('Product not in stock.');

    //create the new CartOrder
    let newCartOrder = new CartOrder({ 
        customer:{
            _id: customer._id,
            UserName: customer.UserName,
            Email: customer.Email,
            Phone: customer.Phone
        },
        product:{
            _id: product._id,
            Pro_Name: product.Pro_Name,
            Pro_Price: product.Pro_Price
        },
        SelectedQuantity: req.body.SelectedQuantity,
    });

    if(req.body.SelectedQuantity <= product.numberInStock){
    try{
        new Fawn.Task()
            .save('cartorders', newCartOrder)
            .update('products', { _id: product._id}, {
                $inc: { numberInStock: -req.body.SelectedQuantity}
            })
            .run();
    
        res.send(newCartOrder);
    }
    catch(ex)
    {
        res.status(500).send('Somthing Faild');
    }
}
else{
    res.status(500).send("Stock is not enough for this order");
}
}
);
//===========================================

router.put('/:id', async(req, res)=>{     
    const {error} = validate(req.body);
    if (error) return res.status(404).send(error.details[0].message);
    
        //update the Order
        const UpdateCartdOrder = await CartOrder.findByIdAndUpdate(req.params.id, {
            customer:{
                _id: customer._id,
                UserName: customer.UserName,
                Email: customer.Email,
                Phone: customer.Phone
            },
            product:{
                _id: product._id,
                Pro_Name: product.Pro_Name,
                Pro_Price: product.Pro_Price
            },
            SelectedQuantity: req.body.SelectedQuantity,
            }, {
            new: true
          });
    
        //return the updated CartdOrder
        res.send(UpdateCartdOrder);
});

//===============================================

router.delete('/:id', async(req, res)=>{     
    //find the Product
    const DeletedCartOrder = await CartOrder.findByIdAndRemove(req.params.id);

    if(!DeletedCartOrder) return res.status(404).send('genre is not found');

    res.send(DeletedCartOrder);

});

module.exports = router;