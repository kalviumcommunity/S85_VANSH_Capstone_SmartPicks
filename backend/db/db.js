const mongoose = require('mongoose');
require('dotenv').config();

const connectdb = async() =>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Mongo db was connected successfully")
    }catch(err){
        console.log("Unable to connect mongoDb")
        console.log(err.message);
    }
}

module.exports = connectdb;