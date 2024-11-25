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
  const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual
  const rowsPerPage = 5; // Número de filas por página

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

  // Función para manejar el cambio en la barra de búsqueda
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filtrar las reservas por el nombre del cliente
  const filteredReservations = reservations.filter(reservation =>
    reservation.cliente.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calcular los datos paginados
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredReservations.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(filteredReservations.length / rowsPerPage);

  return (
    <div className="reception-container">
      <h2 className="reception-title mb-4">Recepción</h2>

      <form onSubmit={handleSubmit} className="reception-form">
        <h3 className="form-reserv-title">Registrar reserva:</h3>
        {formError && <div className="reception-form-error alert alert-danger">{formError}</div>}

        <div className="row">
          <div className="col-md-6">
            <div className="form-group reception-form-group">
              <label htmlFor="cliente">Nombre del cliente:</label>
              <input
                type="text"
                id="cliente"
                className="reception-input form-control"
                name="cliente"
                value={formData.cliente}
                onChange={handleInputChange}
                placeholder="Nombre del cliente"
                autoComplete='off'
                required
              />
            </div>

            <div className="form-group reception-form-group">
              <label htmlFor="fecha">Fecha:</label>
              <input
                type="date"
                id="fecha"
                className="reception-input form-control"
                name="fecha"
                value={formData.fecha}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-group reception-form-group">
              <label htmlFor="hora">Hora:</label>
              <input
                type="time"
                id="hora"
                className="reception-input form-control"
                name="hora"
                value={formData.hora}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group reception-form-group">
              <label htmlFor="tatuador">Tatuador:</label>
              <select
                id="tatuador"
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
          </div>
        </div>

        <div className="text-center mt-4">
          <button type="submit" className="reception-submit">Registrar Reserva</button>
        </div>
      </form>

      <div className="reception-search-bar">
        <h3 className=''>Lista de reservas:</h3>
        <input
          type="text"
          className="reception-search-input form-control w-50"
          placeholder="Buscar por nombre del cliente"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

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
          {currentRows.map(reservation => (
            <tr key={reservation._id}>
              <td>{reservation.cliente}</td>
              <td>{reservation.fecha}</td>
              <td>{reservation.hora}</td>
              <td>{reservation.tatuador}</td>
              <td>{reservation.estado}</td>
              <td className='accion-reserv'>
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

      {/* Paginación */}
      <nav aria-label="Page navigation">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
              Anterior
            </button>
          </li>
          {Array.from({ length: totalPages }, (_, index) => (
            <li
              key={index + 1}
              className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
            >
              <button className="page-link" onClick={() => setCurrentPage(index + 1)}>
                {index + 1}
              </button>
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
              Siguiente
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Reception;
