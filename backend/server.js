const express = require('express');
const app = express();
const startupRoute = require('./routes/startup')
const connectdb = require('./config/db')
const cors = require('cors');
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended:true}))

connectdb();

// router of startup
app.use('/startups',startupRoute)

const port = process.env.PORT || 5000;

app.listen(port,()=>{
    console.log(`The server started ${port}`);
})