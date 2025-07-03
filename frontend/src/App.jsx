import React from 'react'
import Discover from './routes/Discover'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterStartup from './routes/RegisterStartup';
import AddProduct from './routes/AddProduct';
import LoginStartup from './routes/LoginStartup';
import Profile from './routes/Profile';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path = "/discover" element ={<Discover/>}/>
        <Route path = "/register" element ={<RegisterStartup/>}/>
        <Route path = "/addproduct" element ={<AddProduct/>}/>
        <Route path = "/login" element ={<LoginStartup/>}/>
        <Route path = "/profile" element ={<Profile/>}/>
      </Routes>
    </Router>
  )
}

export default App
