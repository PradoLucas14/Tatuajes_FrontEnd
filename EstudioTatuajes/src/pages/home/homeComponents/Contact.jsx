import React, { useState } from 'react';
import './Contact.css';
import Swal from 'sweetalert2';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (value.length < 8) {
      setErrors({ ...errors, [name]: 'Este campo debe tener al menos 8 caracteres.' });
    } else {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let formValid = true;
    const newErrors = {};

    for (const key in formData) {
      if (formData[key].length < 8) {
        newErrors[key] = 'Este campo debe tener al menos 8 caracteres.';
        formValid = false;
      }
    }

    setErrors(newErrors);

    if (formValid) {
      Swal.fire({
        title: 'Formulario enviado',
        text: 'Gracias por contactarnos. Nos pondremos en contacto contigo pronto.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        background: '#000',
        color: '#fff',
        confirmButtonColor: '#333'
      });

      // Limpiar el formulario
      setFormData({ name: '', email: '', message: '' });
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-column column-one">
        <div className="overlayColumn-one"></div>
      </div>
      <div className="contact-column column-two">
        <h2>Formulario de Contacto</h2>
        <form onSubmit={handleSubmit} className='form'>
          <div className="form-group">
            <label htmlFor="name">Nombre:</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Tu nombre"
              value={formData.name}
              onChange={handleChange}
              required
            />
            {errors.name && <p className="error-message">{errors.name}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico:</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Tu correo electrónico"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="message">Mensaje:</label>
            <textarea
              id="message"
              name="message"
              placeholder="Tu mensaje"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
            {errors.message && <p className="error-message">{errors.message}</p>}
          </div>
          <button type="submit">Enviar</button>
        </form>
      </div>
    </div>
  );
}

export default Contact;
