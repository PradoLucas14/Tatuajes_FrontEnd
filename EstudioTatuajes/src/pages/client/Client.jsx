import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Client.css';

const ClientReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

// Función para formatear fechas
  const formatDate = (date) => {
    const formattedDate = new Date(date).toISOString().split('T')[0];
    return formattedDate;
  };

  // Función para obtener las reservas desde la API
  const fetchReservations = async () => {
    const userName = localStorage.getItem('userName'); // Tomar el nombre del usuario del localStorage
    if (!userName) {
      setError('No se encontró información del usuario en el localStorage.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get('http://localhost:5000/api/reservs');
      const userReservations = response.data
        .filter((reservation) => reservation.cliente === userName)
        .map((reservation) => ({
          ...reservation,
          fecha: formatDate(reservation.fecha), // Formatear la fecha
        }));
      setReservations(userReservations);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      setError('Hubo un error al obtener las reservas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  if (loading) {
    return <div className="loading">Cargando reservas...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (reservations.length === 0) {
    return <div className="no-reservations">No tienes reservas registradas.</div>;
  }

  return (
    <div className="client-reservations-container">
      <h2 className="client-reservations-title">Mis Reservas</h2>
      <div className="reservations-grid">
        {reservations.map((reservation) => (
          <div key={reservation._id} className="reservation-card">
            <h3 className="reservation-client">{reservation.cliente}</h3>
            <p className="reservation-detail">
              <strong>Fecha:</strong> {reservation.fecha}
            </p>
            <p className="reservation-detail">
              <strong>Hora:</strong> {reservation.hora}
            </p>
            <p className="reservation-detail">
              <strong>Tatuador:</strong> {reservation.tatuador}
            </p>
            <p className={`reservation-status ${reservation.estado.toLowerCase()}`}>
              Estado: {reservation.estado}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientReservations;
