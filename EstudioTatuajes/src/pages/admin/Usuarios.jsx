import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Usuarios.css"

function Usuarios() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'cliente',
    claveDeAccion: '1234',
  });

  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const rowsPerPage = 10; // Máximo de filas por página

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los usuarios.',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/users/register',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        icon: 'success',
        title: '¡Usuario Registrado!',
        text: `El usuario ${response.data.name} ha sido registrado exitosamente.`,
      });

      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'cliente',
        claveDeAccion: '',
      });

      fetchUsers();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al Registrar',
        text: error.response?.data?.message || 'Hubo un error al registrar el usuario.',
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filtrar usuarios según el término de búsqueda
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Determinar los usuarios visibles en la página actual
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredUsers.slice(indexOfFirstRow, indexOfLastRow);

  // Cambiar de página
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container-usuarios">
      <h2 className="usuar-title text-white mb-4">Registrar Nuevo Usuario</h2>
      <form onSubmit={handleSubmit} className="reception-form">
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="name" className="form-label text-white">Nombre:</label>
              <input
                type="text"
                placeholder='Ingrese su nombre'
                id="name"
                name="name"
                className="form-control reception-input"
                value={formData.name}
                onChange={handleChange}
                required
                minLength="6"
                autoComplete='off'
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label text-white">Correo Electrónico:</label>
              <input
                type="email"
                placeholder='Ingrese su correo electronico'
                id="email"
                name="email"
                className="form-control reception-input"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete='off'
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="password" className="form-label text-white">Contraseña:</label>
              <input
                type="password"
                placeholder='Ingrese su contraseña'
                id="password"
                name="password"
                className="form-control reception-input"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
                autoComplete='off'
              />
            </div>
            <div className="mb-3">
              <label htmlFor="role" className="form-label text-white">Rol:</label>
              <select
                id="role"
                name="role"
                className="form-select reception-input"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="cliente">Cliente</option>
                <option value="tatuador">Tatuador</option>
                <option value="recepcionista">Recepcionista</option>
              </select>
            </div>
          </div>
        </div>
        <button type="submit" className="reception-submit">Registrar</button>
      </form>

      {/* Barra de búsqueda */}
      <h3 className="usuar-title text-white mb-4 mt-5">Usuarios Registrados</h3>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control reception-search-input"
          placeholder="Buscar por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tabla de usuarios */}
      <table className="table table-dark reception-table mt-4">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación */}
      <nav>
        <ul className="pagination justify-content-center">
          {[...Array(totalPages)].map((_, index) => (
            <li
              key={index}
              className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
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
    </div>
  );
}

export default Usuarios;
