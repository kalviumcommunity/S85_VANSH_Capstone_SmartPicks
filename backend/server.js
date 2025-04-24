const express = require("express");
const connectdb = require("./db/db");
const app = express();
const mongoose = require('mongoose');
const testingModel = require('./model/user');
PORT = 3000

app.use(express.json())
app.use(express.urlencoded({extended: false}))

connectdb();

app.get('/',(req,res)=>{
    res.send("This is my home page and if this text is shown in browser that means my server is working correctly and it is deployed as well")
})

app.get('/get',async (req,res)=>{
    const {name} = req.body;
    const findUser = await testingModel.find({name});
    res.send(findUser)
})

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

// new task of recreating CRUD operation 

app.get('/read',async (req,res)=>{
    const {name} = req.body;
    const findUser = await testingModel.find({name});
    res.send(findUser)
})

app.post('/create',async (req,res)=>{
    const {name,email,password} = req.body;

    const createuser = await testingModel.create({name , email , password});
    res.send(createuser);

    res.send("Completed the task of creating an post endpoint");
})

app.put('/update/:oldname', async (req,res)=>{
    const {oldname} = req.params;
    const {name} = req.body;

    const updatedUser = await testingModel.findOneAndUpdate({name:oldname},{name:name},{new:true});
    console.log("the user was renamed successfully")
    res.send(updatedUser);
})

app.delete('/delete', async (req,res)=>{
    const {name} = req.body;

    const deleteUser = await testingModel.findOneAndDelete({name:name});
    console.log("The User was deleted successfully");
    res.send(deleteUser);

})


app.listen(PORT,(req,res)=>{
    console.log(`The backend server is running on http://localhost:${PORT}/`)
})