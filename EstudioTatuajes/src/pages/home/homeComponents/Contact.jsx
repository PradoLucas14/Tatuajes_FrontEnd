import React, { useState } from 'react';
import './Contact.css';
import Swal from 'sweetalert2';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar que todos los campos tengan al menos 6 caracteres
    if (formData.name.length < 6 || formData.email.length < 6 || formData.message.length < 6) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Todos los campos deben tener al menos 6 caracteres.'
      });
      return;
    }

    // Validar que todos los campos estén completos
    if (!formData.name || !formData.email || !formData.message) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Por favor, complete todos los campos del formulario.'
      });
      return;
    }

    // Mostrar SweetAlert de éxito
    Swal.fire({
      icon: 'success',
      title: '¡Enviado!',
      text: 'Tu mensaje ha sido enviado correctamente.'
    });

    // Limpiar formulario después de enviar
    setFormData({
      name: '',
      email: '',
      message: ''
    });
  };

  return (
    <div className="contact-container">
      <div className="columnContact column1Contact">
        <div className="column1ContactOverlay">
          {/* Puedes agregar contenido aquí si lo necesitas */}
        </div>
      </div>
      <div className="columnContact column2Contact">
        <h2>Contacto</h2>
        <form onSubmit={handleSubmit} className="contact-form">
          <label htmlFor="name">Nombre:</label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label htmlFor="email">Correo Electrónico:</label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="message">Mensaje:</label>
          <textarea
            name="message"
            id="message"
            value={formData.message}
            onChange={handleChange}
            required
          />

          <button type="submit">Enviar</button>
        </form>
      </div>
    </div>
  );
}

export default Contact;
