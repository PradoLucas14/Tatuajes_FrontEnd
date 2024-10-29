import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/home/Home'
import Register from './pages/register/Register' // Asegúrate de que esta ruta sea correcta
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> {/* Página principal */}
        <Route path="/Register" element={<Register />} /> {/* Página de registro */}
      </Routes>
    </Router>
  )
}

export default App
