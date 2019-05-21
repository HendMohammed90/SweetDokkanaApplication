/*jshint esversion: 6 */
/* jshint ignore:start */

const express = require('express');
const router = express.Router();
const {Order, validate} = require('../models/orders');
const{Customer}=require('../models/customer');
const {Product}=require('../models/products');
const {CartOrder} = require('../models/cartOrders');
const mongoose = require('mongoose');
// const {ensureAuthenticated} = require('../config/auth');


router.get('/:pageNo?', async(req, res)=>{     
    let pageNo = 1;
    if(req.params.pageNo){
        pageNo = parseInt(req.params.pageNo)
    }
    if(req.params.pageNo==0 ||req.params.pageNo<0) {
        pageNo = 1
    }  
    let q= {
        skip :4 * (pageNo -1),
        limit : 4
    }
    const orders = await Order.find({},{},q);
    //find total NU of Documants
    let totalDocs = 0 ;
    Order.countDocuments({},(err,total)=>{

    }).then((response)=>{
        totalDocs = parseInt(response);
        // console.log(response)
        res.render("orders.ejs" , 
        {
            orders :orders,
            total :parseInt(totalDocs),
            pageNo :pageNo,
            name : req.user.name
        });
    })
    // res.send(orders);
});

//============================
router.get('/details/:id',async(req, res)=>{     
    const order = await Order.findById(req.params.id);

    if(!order) return res.status(404).send('Order with given ID is not found');
    
    console.log(order);
    // res.send(order)

    res.render("Order-details.ejs" , 
    {
        order :order,
        name : req.user.name
    });
});
// <% order.product.forEach((PRO ,index)=>{ %>
//     <tr>
//         <th scope="row"><%=PRO._id %></th>
//         <td scope="row"><%=PRO.Pro_Name%></td>
//         <td scope="row"><%=PRO.Pro_Description %></td>
//         <td scope="row"><%=PRO.Pro_Price %></td>
//         <td scope="row"><%=PRO.Pro_IMG %>$</td>
//     </tr>
// <% }) %>
{/* <form>
<label for="name">name :</label>
<p class="d-inline"><%=order.UserName%>.</p>
<br />
<label for="ID">id :</label>
<p class="d-inline"><%=order._id%>.</p>
<br />
<label for="email">email :</label>
<p class="d-inline"><%=order.Email%>.</p>
<br />
<label for="telephone">telephone :</label>
<p class="d-inline"><%=order.Phone%></p>
<br />
<label for="text">address :</label>
<p class="d-inline"><%=order.Address%>.</p>
<br />
</form> */}

//============================
router.post('/', async(req, res)=>{     
    const {error} = validate(req.body);
    if (error) return res.status(404).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerID);
    if (!customer) return res.status(400).send('Invalid customer Pleas Login First.');

    let product = await Product.findById(req.body.productID);
    if (!product) return res.status(400).send('Invalid Product to be add in the cart');

    // const cartOrder = await CartOrder.findById(req.body.cartOrderID);
    // if (!cartOrder) return res.status(400).send('Invalid cartOrder to be added to the order');


    //create the new Order
    let newOrder = new Order({ 
        Name: req.body.Name,
        Address: req.body.Address,
        City: req.body.City,
        Phone: req.body.Phone,
        Payment: req.body.Payment,
        OrderPrice: req.body.OrderPrice,
        customer: {
            _id: customer.id,
            UserName: customer.UserName,
            Email:customer.Email,
            Phone:customer.Phone,
            Address:customer.Address
        },
        product: [{
            _id: product.id,
            Pro_Name: product.Pro_Name,
            Category :product.Category,
            Pro_Description:product.Pro_Description,
            Pro_Price:product.Pro_Price,
            Pro_IMG:product.Pro_IMG
        }]
    });

        //second try

    //     cartOrder:{
    //         _id :cartOrder.id,
    //         customer :{
    //                 _id: customer.id,
    //                 UserName: customer.UserName,
    //                 Email:customer.Email,
    //                 Phone:customer.Phone,
    //                 Address:customer.Address
    //             },
    //         product :{
    //                 _id: product.id,
    //                 Pro_Name: product.Pro_Name,
    //                 Category :product.Category,
    //                 Pro_Description:product.Pro_Description,
    //                 Pro_Price:product.Pro_Price,
    //                 Pro_IMG:product.Pro_IMG
    //             },
    //         SelectedQuantity :cartOrder.SelectedQuantity
    //     }
    // });
    
    // try{
    //     new Fawn.Task()
    //       .save('orders' , newOrder)
    //       .update('product' , {_id:Product._id},{
    //         $inc: {numberInStock : -1 }
    //       })
    //       .run();
    //     res.send(newOrder);
    //   }
    //    catch(ex){
    //      res.status(500).send('Somthing bad has happend -_-.')
    //    }
     

    newOrder = await newOrder.save();
     
    res.send(newOrder);
});
//===========================================

// router.put('/:id', async(req, res)=>{     
//     //validate the Order
//     const {error} = validate(req.body);
//     if (error) return res.status(404).send(error.details[0].message);
    
//         //update the Order
//         const UpdatedOrder = await Order.findByIdAndUpdate(req.params.id, {
//             Name: req.body.Name,
//             Address: req.body.Address,
//             City: req.body.City,
//             Phone: req.body.Phone,
//             Payment: req.body.Payment,
//             OrderPrice: req.body.OrderPrice      
//             }, {
//             new: true
//           });
    
//         //return the updated product
//         res.send(UpdatedOrder);
        
//     });
//===============================================

router.delete('/:id',async(req, res)=>{     
    const DeletedOrder = await Order.findByIdAndRemove(req.params.id);

    if(!DeletedOrder) return res.status(404).send('genre is not found');

    res.send(DeletedOrder);
    
});

module.exports = router;