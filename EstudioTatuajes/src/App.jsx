import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home/Home';
import Register from './pages/register/Register';
import Login from './pages/login/Login';
import Cliente from './pages/client/Client'; // Ruta del componente del cliente
import Tatuador from './pages/artists/Artist'; // Ruta del componente del tatuador
import Recepcionista from './pages/reception/Reception'; // Ruta del recepcionista
import Usuarios from './pages/admin/Usuarios'; // Ruta del administrador
import Tatuajes from './pages/admin/Tatuajes';
import PrivateRoute from '../PrivateRoute'; // Importa el componente PrivateRoute
import NavBar from './layout/NavBar'; // Importa el componente NavBar
import './App.css';

function App() {
  return (
    <Router>
      <NavBar /> {/* Aquí agregamos el NavBar para que esté presente en todas las rutas */}

      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Rutas privadas protegidas por rol */}
        <Route element={<PrivateRoute allowedRoles={['cliente']} />} >
          <Route path="/cliente" element={<Cliente />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={['tatuador']} />} >
          <Route path="/tatuador" element={<Tatuador />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={['recepcionista']} />} >
          <Route path="/recepcionista" element={<Recepcionista />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={['administrador']} />} >
          <Route path="/Usuarios" element={<Usuarios />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={['administrador']} />} >
          <Route path="/reservas" element={<Recepcionista />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={['administrador']} />} >
          <Route path="/tatuajes" element={<Tatuajes />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
