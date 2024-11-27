import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Para la navegación
import "bootstrap/dist/css/bootstrap.min.css";
import myImage from '../assets/img/icon/icon4.png'; // Ruta de la imagen
import "./NavBar.css"

const NavBar = () => {
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole") || "");
  const navigate = useNavigate(); // Hook para redirigir

  useEffect(() => {
    // Chequear si el rol del usuario está en localStorage
    const storedRole = localStorage.getItem("userRole");
    
    // Si el rol es diferente al actual, recargar la página
    if (storedRole && storedRole !== userRole) {
      setUserRole(storedRole);
      window.location.reload(); // Forzar la recarga de la página
    }
  }, [userRole]); // Dependencia de 'userRole'

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setUserRole(""); // Restablecer el estado del usuario
    navigate("/login"); // Redirige a la página de login
  };

  // Renderizar los elementos del Navbar según el rol
  const renderMenuItems = () => {
    switch (userRole) {
      case "cliente":
        return (
          <>
            <li className="nav-item">
              <a className="nav-link" href="/home">Inicio</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/galeria">Galería</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/cliente">Reservas</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#" onClick={handleLogout}>Salir</a>
            </li>
          </>
        );
      case "tatuador":
        return (
          <>
            <li className="nav-item">
              <a className="nav-link" href="/home">Inicio</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/galeria">Galería</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/tatuador">Tatuador</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#" onClick={handleLogout}>Salir</a>
            </li>
          </>
        );
      case "recepcionista":
        return (
          <>
            <li className="nav-item">
              <a className="nav-link" href="/home">Inicio</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/galeria">Galería</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/recepcionista">Recepción</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#" onClick={handleLogout}>Salir</a>
            </li>
          </>
        );
      case "administrador":
        return (
          <>
            <li className="nav-item">
              <a className="nav-link" href="/home">Inicio</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/galeria">Galería</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/usuarios">Usuarios</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/reservas">Reservas</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/tatuajes">Tatuajes</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#" onClick={handleLogout}>Salir</a>
            </li>
          </>
        );
      default:
        return (
          <>
            <li className="nav-item">
              <a className="nav-link" href="/home">Inicio</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/galeria">Galería</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/login">Acceso</a>
            </li>
          </>
        );
    }
  };

  return (
    <nav className="navbar navbar-expand-lg fixed-top">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          <img src={myImage} alt="Descripción de la imagen" className='imgNavBar'/>
          {userRole ? userRole.toUpperCase() : "MAGIA NEGRA"}
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {renderMenuItems()}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
