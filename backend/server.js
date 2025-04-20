const express = require("express")
const app = express();
PORT = 3000

app.get('/get',(req,res)=>{
    res.send("Completed the task of creating an get endpoint")
})

app.listen(PORT,(req,res)=>{
    console.log(`The backend server is running on http://localhost:${PORT}/`)
})