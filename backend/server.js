const express = require('express');
const app = express();
const startupRoute = require('./routes/addstartup')
const connectdb = require('./config/db')
const cors = require('cors');
const addProductRoute = require('./routes/addproduct');
const loginStartupRoute = require('./routes/loginstartup');
app.use(cors({
  origin: 'https://vansh-smartpicks.netlify.app',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({extended:true}))

connectdb();

// router of startup
app.use('/startups',startupRoute)
app.use('/startups', loginStartupRoute); // Register login route
app.use('/products', addProductRoute); // POST /api/addproduct

const port = process.env.PORT || 5000;

app.listen(port,()=>{
    console.log(`The server started ${port}`);
})