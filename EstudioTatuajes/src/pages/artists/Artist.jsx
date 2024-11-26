import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './Artist.css';

function Artist() {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [projectUrl, setProjectUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8; // Máximo de filas por página

  const tatuadorName = localStorage.getItem('userName');

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/reservs');
        const normalizedReservations = response.data.map((reservation) => ({
          ...reservation,
          fecha: new Date(reservation.fecha).toISOString().split('T')[0],
        }));

        const filteredReservations = normalizedReservations.filter(
          (reservation) =>
            reservation.tatuador === tatuadorName &&
            reservation.estado.toLowerCase() === 'pendiente'
        );

        if (filteredReservations.length === 0) {
          Swal.fire({
            icon: 'info',
            title: 'Sin reservas',
            text: 'No tienes reservas pendientes en este momento.',
          });
        }

        setReservations(filteredReservations);
        setFilteredReservations(filteredReservations);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar reservas',
          text: 'Ocurrió un problema al obtener las reservas. Por favor, intenta nuevamente.',
        });
        console.error('Error fetching reservations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [tatuadorName]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    applyFilters(query, selectedDate);
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    applyFilters(searchQuery, date);
  };

  const applyFilters = (query, date) => {
    let results = reservations;

    if (query) {
      results = results.filter((reservation) =>
        reservation.cliente.toLowerCase().includes(query)
      );
    }

    if (date) {
      results = results.filter((reservation) => reservation.fecha === date);
    }

    setFilteredReservations(results);
    setCurrentPage(1); // Reinicia a la primera página después de filtrar
  };

  const handleSubmitProject = async (e) => {
    e.preventDefault();

    if (!projectUrl) {
      Swal.fire({
        icon: 'warning',
        title: 'URL requerida',
        text: 'Por favor, ingresa una URL para cargar el proyecto.',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const projectData = {
        name: tatuadorName,
        image: projectUrl,
      };

      await axios.post('http://localhost:3000/proyectos', projectData);

      Swal.fire({
        icon: 'success',
        title: 'Proyecto cargado',
        text: 'El proyecto se cargó exitosamente.',
      });

      setProjectUrl('');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al cargar el proyecto',
        text: 'No se pudo cargar el proyecto. Por favor, intenta nuevamente.',
      });
      console.error('Error submitting project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calcula los datos paginados
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredReservations.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredReservations.length / rowsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="artist-container-unique">
      <div className="artist-project-form-unique">
        <h3 className="artist-title-unique">Cargar Proyecto</h3>
        <form onSubmit={handleSubmitProject} className="proyect-register-form mb-4">
          <div className="form-group">
            <input
              type="url"
              id="projectUrl"
              className="artist-search-input-unique form-control"
              placeholder="Ingrese la URL de la imagen"
              value={projectUrl}
              onChange={(e) => setProjectUrl(e.target.value)}
              autoComplete="off"
              required
            />
          </div>
          <button
            type="submit"
            className="reception-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Cargando...' : 'Subir Proyecto'}
          </button>
        </form>
      </div>

      <h2 className="artist-title-unique">Reservas pendientes asignadas</h2>

      <div className="artist-filters-unique">
        <input
          type="text"
          className="artist-search-input-unique form-control"
          placeholder="Buscar por cliente..."
          value={searchQuery}
          onChange={handleSearch}
        />
        <input
          type="date"
          className="artist-search-input-unique form-control"
          value={selectedDate}
          onChange={handleDateChange}
        />
      </div>

      {loading ? (
        <p className="artist-loading-unique text-center">Cargando reservas...</p>
      ) : currentRows.length > 0 ? (
        <>
          <table className="artist-table-unique table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.map((reservation) => (
                <tr key={reservation._id}>
                  <td>{reservation.cliente}</td>
                  <td>{reservation.fecha}</td>
                  <td>{reservation.hora}</td>
                  <td>{reservation.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <nav className="d-flex justify-content-center">
            <ul className="pagination">
              {Array.from({ length: totalPages }, (_, index) => (
                <li
                  key={index + 1}
                  className={`page-item ${
                    currentPage === index + 1 ? 'active' : ''
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </>
      ) : (
        <p className="artist-no-results-unique text-center">
          No hay reservas pendientes que coincidan con los filtros.
        </p>
      )}
    </div>
  );
}

export default Artist;
