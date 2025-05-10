const express = require('express')
const route = express.Router();
const mongoose = require('mongoose');
const product = require('../model/startup/product');
const startup = require('../model/startup/startup');

route.post('/startup',async (req,res)=>{
    const {name,email,products} = req.body;
    try{
        const createStartup = await startup.create({name,email,products});
        res.status(200).send(createStartup);
    }catch(err){
        res.status(400).send(err)
    }
})

route.post('/product',async (req,res)=>{
    const {name,usp,price,images,category,stock,startupName} = req.body;
    try{
        const findStartup = await startup.findOne({name:startupName});
        if(!findStartup){
            res.status(404).send("No startup found with this name");
        }
        const createProduct = await product.create({name,usp,price,images,category,stock,startup:findStartup._id})
        // const populatedProduct = await createProduct.populate('startup')
        res.status(201).send(createProduct);
    }catch(err){
        res.status(400).send(err);
    }

})

module.exports = route;