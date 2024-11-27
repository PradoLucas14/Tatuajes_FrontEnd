import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.email.length <= 5 || formData.password.length <= 5) {
      Swal.fire({
        title: 'Error',
        text: 'Todos los campos deben tener más de 5 caracteres',
        icon: 'error',
        customClass: {
          popup: 'swal2-dark'
        }
      });
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5000/api/auth/login`, {
        email: formData.email,
        password: formData.password
      });

      const { token, user } = response.data;

      // Guardar datos en localStorage y sessionStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('userName', user.name);
      sessionStorage.setItem('userRole', user.role);
      sessionStorage.setItem('userName', user.name);

      Swal.fire({
        title: 'Éxito',
        text: 'Inicio de sesión exitoso',
        icon: 'success',
        customClass: {
          popup: 'swal2-dark'
        }
      });

      // Redirección según el rol del usuario (la recarga manejará la navegación)
      switch (user.role) {
        case 'cliente':
          navigate('/cliente');
          break;
        case 'tatuador':
          navigate('/tatuador');
          break;
        case 'recepcionista':
          navigate('/recepcionista');
          break;
        case 'administrador':
          navigate('/home');
          break;
        default:
          navigate('/');
          break;
      }

      // Forzar recarga de la página
      window.location.reload(); // Aquí se recarga la página

      setFormData({ email: '', password: '' });
    } catch (error) {
      if (error.response) {
        Swal.fire({
          title: 'Error',
          text: error.response.data.msg || 'Error desconocido',
          icon: 'error',
          customClass: {
            popup: 'swal2-dark'
          }
        });
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Error en la conexión con el servidor',
          icon: 'error',
          customClass: {
            popup: 'swal2-dark'
          }
        });
      }
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/Register');
  };

  return (
    <div className="loginContainer">
      <div className="columnLeft">
        <form className="loginForm" autoComplete="off" onSubmit={handleSubmit}>
          <h2>Iniciar Sesión</h2>
          <label>
            Correo Electrónico:
            <input
              placeholder="Escribe tu correo electrónico"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Contraseña:
            <input
              placeholder="Escribe tu contraseña"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>
          <button type="submit">Iniciar Sesión</button>
          <button
            type="button"
            onClick={handleRegisterRedirect}
            className="registerRedirectButton"
          >
            Haz click para registrarte
          </button>
        </form>
      </div>
      <div className="columnRight">
        {/* Puedes agregar contenido aquí si es necesario */}
      </div>
    </div>
  );
}

export default Login;
