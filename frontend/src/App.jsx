import React from 'react'
import Discover from './routes/Discover'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterStartup from './routes/RegisterStartup';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path = "/discover" element ={<Discover/>}/>
        <Route path = "/register" element ={<RegisterStartup/>}/>
      </Routes>
    </Router>
  )
}

export default App
