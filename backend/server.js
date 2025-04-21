const express = require("express");
const connectdb = require("./db/db");
const app = express();
const mongoose = require('mongoose');
const testingModel = require('./model/user');
PORT = 3000

app.use(express.json())
app.use(express.urlencoded({extended: false}))

connectdb();

app.get('/get',(req,res)=>{
    res.send("Completed the task of creating an get endpoint")
})

app.post('/post',async (req,res)=>{
    const {name,email,password} = req.body;

    const createuser = await testingModel.create({name , email , password});
    res.send(createuser);

    res.send("Completed the task of creating an post endpoint");
})

app.listen(PORT,(req,res)=>{
    console.log(`The backend server is running on http://localhost:${PORT}/`)
})