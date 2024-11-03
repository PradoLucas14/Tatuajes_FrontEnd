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

  // Maneja los cambios en los campos del formulario
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Maneja el envío del formulario
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

      // Guardar el token en el almacenamiento local o en el estado de la app
      const { token } = response.data;
      localStorage.setItem('token', token);

      Swal.fire({
        title: 'Éxito',
        text: 'Inicio de sesión exitoso',
        icon: 'success',
        customClass: {
          popup: 'swal2-dark'
        }
      });

      // Limpiar el formulario
      setFormData({ email: '', password: '' });

      // Redirigir al usuario a otra ruta (por ejemplo, la página de inicio)
      navigate('/Home');
    } catch (error) {
      if (error.response) {
        Swal.fire({
          title: 'Error',
          text: error.response.data.msg,
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

  // Función para redirigir al componente de registro
  const handleRegisterRedirect = () => {
    navigate('/Register');
  };

  return (
    <div className='Login'>
      <form className='loginForm' autoComplete="off" onSubmit={handleSubmit}>
        <h2>Iniciar Sesión</h2>
        <label>
          Correo Electrónico:
          <input
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
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">Iniciar Sesión</button>
        <button type="button" onClick={handleRegisterRedirect} className="registerRedirectButton">
          Registrarse
        </button>
      </form>
    </div>
  );
}

export default Login;
