import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Importar SweetAlert2
import 'bootstrap/dist/css/bootstrap.min.css';
import './Reception.css';

function Reception() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tatuadores, setTatuadores] = useState([]); // Estado para los tatuadores
  const [clientes, setClientes] = useState([]); // Estado para los clientes registrados
  const [formData, setFormData] = useState({
    cliente: '',
    fecha: '',
    hora: '',
    tatuador: '',
  });

  const [formError, setFormError] = useState('');
  const [searchTerm, setSearchTerm] = useState(''); // Estado para la búsqueda

  // Función para obtener las reservas desde la API
  const fetchReservations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/reservs');
      setReservations(response.data); // Asumiendo que la API devuelve un array
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener los tatuadores desde la API
  const fetchTatuadores = async () => {
    try {
      const token = localStorage.getItem('authToken'); // O sessionStorage, dependiendo de donde guardes el token
      const response = await axios.get('http://localhost:5000/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const tatuadoresList = response.data.filter(user => user.role === 'tatuador');
      setTatuadores(tatuadoresList);
    } catch (error) {
      console.error('Error fetching tatuadores:', error);
    }
  };

  // Función para obtener los clientes registrados desde la API
  const fetchClientes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      const clientesList = response.data.filter(user => user.role === 'cliente');
      setClientes(clientesList);
    } catch (error) {
      console.error('Error fetching clientes:', error);
    }
  };

  useEffect(() => {
    fetchReservations();
    fetchTatuadores();
    fetchClientes(); // Obtener los clientes cuando se cargue el componente
  }, []);

  // Función para manejar el cambio de datos en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Función para registrar una nueva reserva
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const { cliente, fecha, hora, tatuador } = formData;

    // Verificar que el cliente esté registrado
    const clienteExistente = clientes.some(user => user.name === cliente);

    if (!clienteExistente) {
      setFormError('El cliente no está registrado en la base de datos');
      return;
    }

    // Verificar que la fecha no sea anterior al día de hoy
    const today = new Date();
    const selectedDate = new Date(fecha);

    if (selectedDate < today) {
      setFormError('No se pueden registrar reservas en días anteriores');
      return;
    }

    if (!cliente || !fecha || !hora || !tatuador) {
      setFormError('Todos los campos son obligatorios');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/reservs', formData);
      Swal.fire({
        title: 'Éxito',
        text: 'La reserva se ha creado correctamente.',
        icon: 'success',
        background: '#333', // Fondo oscuro
        color: '#fff', // Texto blanco
        confirmButtonColor: '#28a745', // Botón verde
      });

      // Agregar la nueva reserva a la lista
      setReservations([...reservations, response.data]);

      // Limpiar el formulario
      setFormData({
        cliente: '',
        fecha: '',
        hora: '',
        tatuador: '',
      });
    } catch (error) {
      console.error('Error creating reservation:', error);
      Swal.fire({
        title: 'Error',
        text: error.response?.data?.error || 'Hubo un problema al crear la reserva',
        icon: 'error',
        background: '#333',
        color: '#fff',
        confirmButtonColor: '#d33',
      });
    }
  };

  // Función para cambiar el estado de la reserva a "Confirmado"
  const handleConfirm = async (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres confirmar esta reserva?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      background: '#333', // Color de fondo oscuro
      color: '#fff', // Color de texto blanco
      confirmButtonColor: '#28a745', // Botón Confirmar en verde
      cancelButtonColor: '#d33', // Botón Cancelar en rojo
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Solicitud PATCH para cambiar el estado de la reserva
          await axios.patch(`http://localhost:5000/api/reservs/${id}`, { estado: 'Confirmado' });

          // Actualiza el estado local de las reservas
          setReservations(reservations.map(reservation => 
            reservation._id === id ? { ...reservation, estado: 'Confirmado' } : reservation
          ));

          // Alerta de éxito
          Swal.fire({
            title: 'Éxito',
            text: 'La reserva ha sido confirmada.',
            icon: 'success',
            background: '#333', // Color de fondo oscuro
            color: '#fff', // Color de texto blanco
            confirmButtonColor: '#28a745', // Botón Confirmar en verde
          });
        } catch (error) {
          console.error('Error confirming reservation:', error);
        }
      }
    });
  };

  // Función para cambiar el estado de la reserva a "Cancelado"
  const handleCancel = async (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres cancelar esta reserva?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Cancelar',
      cancelButtonText: 'Volver',
      background: '#333', // Color de fondo oscuro
      color: '#fff', // Color de texto blanco
      confirmButtonColor: '#d33', // Botón Cancelar en rojo
      cancelButtonColor: '#28a745', // Botón Volver en verde
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Solicitud PATCH para cambiar el estado de la reserva
          await axios.patch(`http://localhost:5000/api/reservs/${id}`, { estado: 'Cancelado' });

          // Actualiza el estado local de las reservas
          setReservations(reservations.map(reservation => 
            reservation._id === id ? { ...reservation, estado: 'Cancelado' } : reservation
          ));

          // Alerta de éxito
          Swal.fire({
            title: 'Éxito',
            text: 'La reserva ha sido cancelada.',
            icon: 'success',
            background: '#333', // Color de fondo oscuro
            color: '#fff', // Color de texto blanco
            confirmButtonColor: '#d33', // Botón Cancelar en rojo
          });
        } catch (error) {
          console.error('Error canceling reservation:', error);
        }
      }
    });
  };

  // Función para manejar el cambio en la barra de búsqueda
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filtrar las reservas por el nombre del cliente
  const filteredReservations = reservations.filter(reservation =>
    reservation.cliente.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="reception-container mt-5">
      <h2 className="reception-title text-center mb-4">Lista de Reservas</h2>
      
      {/* Barra de búsqueda con Bootstrap */}
      <div className="reception-search-bar mb-4 d-flex justify-content-center">
        <input
          type="text"
          className="reception-search-input form-control w-50"
          placeholder="Buscar por nombre del cliente"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Formulario para crear nuevas reservas */}
      <form onSubmit={handleSubmit} className="reception-form mb-4">
        {formError && <div className="reception-form-error alert alert-danger">{formError}</div>}
        <div className="reception-form-row form-row">
          <div className="reception-form-col col">
            <input
              type="text"
              className="reception-input form-control"
              name="cliente"
              value={formData.cliente}
              onChange={handleInputChange}
              placeholder="Nombre del cliente"
              required
            />
          </div>
          <div className="reception-form-col col">
            <input
              type="date"
              className="reception-input form-control"
              name="fecha"
              value={formData.fecha}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="reception-form-col col">
            <input
              type="time"
              className="reception-input form-control"
              name="hora"
              value={formData.hora}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="reception-form-col col">
            <select
              name="tatuador"
              className="reception-select form-control"
              value={formData.tatuador}
              onChange={handleInputChange}
              required
            >
              <option value="">Seleccionar Tatuador</option>
              {tatuadores.map(tatuador => (
                <option key={tatuador._id} value={tatuador.name}>
                  {tatuador.name}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="reception-submit btn btn-dark">Registrar Reserva</button>
        </div>
      </form>

      {/* Tabla de reservas */}
      <table className="reception-table table table-dark">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Tatuador</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredReservations.map(reservation => (
            <tr key={reservation._id}>
              <td>{reservation.cliente}</td>
              <td>{reservation.fecha}</td>
              <td>{reservation.hora}</td>
              <td>{reservation.tatuador}</td>
              <td>{reservation.estado}</td>
              <td>
                {reservation.estado !== 'Confirmado' && reservation.estado !== 'Cancelado' && (
                  <>
                    <button
                      className="reception-confirm-btn btn btn-success btn-sm"
                      onClick={() => handleConfirm(reservation._id)}
                    >
                      Confirmar
                    </button>
                    <button
                      className="reception-cancel-btn btn btn-danger btn-sm ml-2"
                      onClick={() => handleCancel(reservation._id)}
                    >
                      Cancelar
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Reception;