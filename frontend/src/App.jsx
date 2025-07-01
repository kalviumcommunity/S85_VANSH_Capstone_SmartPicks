import React from 'react'
import Discover from './routes/Discover'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path = "/discover" element ={<Discover/>}/>
      </Routes>
    </Router>
  )
}

export default App
