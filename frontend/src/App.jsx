import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Authform from './components/Authform/Authform'
import Dashboard from './components/Dashboard/Dashboard'

function App() {

  return (
    
      <Router>
      <Routes>
        <Route path="/" element={<Authform />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
   
  )
}

export default App
