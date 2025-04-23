const express = require("express");
const connectdb = require("./db/db");
const app = express();
const mongoose = require('mongoose');
const testingModel = require('./model/user');
PORT = 3000

app.use(express.json())
app.use(express.urlencoded({extended: false}))

connectdb();



app.post('/post',async (req,res)=>{
    const {name,email,password} = req.body;

    const createuser = await testingModel.create({name , email , password});
    res.send(createuser);

    res.send("Completed the task of creating an post endpoint");
})

app.put('/put/:oldname', async (req,res)=>{
    const {oldname} = req.params;
    const {name} = req.body;

    const updatedUser = await testingModel.findOneAndUpdate({name:oldname},{name:name},{new:true});
    console.log("the user was renamed successfully")
    res.send(updatedUser);
})

app.listen(PORT,(req,res)=>{
    console.log(`The backend server is running on http://localhost:${PORT}/`)
})