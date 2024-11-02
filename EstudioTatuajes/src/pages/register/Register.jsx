import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './Register.css';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que todos los campos sean mayores a 5 caracteres
    if (formData.name.length <= 5) {
      Swal.fire({
        title: 'Error',
        text: 'El nombre debe tener más de 5 caracteres',
        icon: 'error',
        customClass: {
          popup: 'swal2-dark'
        }
      });
      return;
    }

    if (formData.email.length <= 5) {
      Swal.fire({
        title: 'Error',
        text: 'El correo electrónico debe tener más de 5 caracteres',
        icon: 'error',
        customClass: {
          popup: 'swal2-dark'
        }
      });
      return;
    }

    if (formData.password.length <= 5) {
      Swal.fire({
        title: 'Error',
        text: 'La contraseña debe tener más de 5 caracteres',
        icon: 'error',
        customClass: {
          popup: 'swal2-dark'
        }
      });
      return;
    }

    if (confirmPassword.length <= 5) {
      Swal.fire({
        title: 'Error',
        text: 'La confirmación de la contraseña debe tener más de 5 caracteres',
        icon: 'error',
        customClass: {
          popup: 'swal2-dark'
        }
      });
      return;
    }

    // Validar que las contraseñas sean exactamente iguales
    if (formData.password !== confirmPassword) {
      Swal.fire({
        title: 'Error',
        text: 'Las contraseñas deben ser exactamente iguales',
        icon: 'error',
        customClass: {
          popup: 'swal2-dark'
        }
      });
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5000/api/users/register`, {
        ...formData,
        role: 'cliente', // Valor por defecto
        claveDeAccion: '1234' // Valor por defecto
      });

      Swal.fire({
        title: 'Éxito',
        text: response.data.msg,
        icon: 'success',
        customClass: {
          popup: 'swal2-dark'
        }
      });

      // Limpiar los campos del formulario
      setFormData({
        name: '',
        email: '',
        password: ''
      });
      setConfirmPassword(''); // Limpiar confirmPassword después del registro
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

  return (
    <div className='Register'>
      <div className='columnRegister column1Register'></div>
      <div className='columnRegister column2Register'>
        <form className='registerForm' autoComplete="off" onSubmit={handleSubmit}>
          <h2>Regístrate</h2>
          <label>
            Nombre:
            <input type="text" name="name" 
            value={formData.name} 
            onChange={handleChange} required 
            placeholder="Escribe tu nombre"
            />
          </label>
          <label>
            Correo Electrónico:
            <input type="email" name="email" 
            value={formData.email}
            onChange={handleChange} required 
            placeholder="Escribe tu correo electrónico"
            />
          </label>
          <label>
            Contraseña:
            <input type="password" 
            name="password" 
            value={formData.password} 
            onChange={handleChange} required 
            placeholder="Escribe tu contraseña"
            />
          </label>
          <label>
            Confirmar Contraseña:
            <input type="password" 
            name="confirmPassword" 
            value={confirmPassword} 
            onChange={handleConfirmPasswordChange} required 
            placeholder="Confirma tu contraseña"
            />
          </label>
          <button type="submit">Registrarse</button>
        </form>
      </div>
    </div>
  );
}

export default Register;
