const mongoose = require('mongoose')

const testingSchema = new mongoose.Schema({
    name : String,
    email: String,
    password: String
})

const testingModel = mongoose.model("testing",testingSchema)
module.exports = testingModel;