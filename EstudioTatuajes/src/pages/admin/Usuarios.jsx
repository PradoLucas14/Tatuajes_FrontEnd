import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de importar Bootstrap
import { Modal, Button } from 'react-bootstrap';

function Usuarios() {
  // Estado para el formulario de registro
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'cliente',
    claveDeAccion: '',
  });

  // Estado para los usuarios obtenidos
  const [users, setUsers] = useState([]);

  // Estado para controlar la visualización del modal de edición
  const [showEditModal, setShowEditModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null); // Guardamos el usuario a editar

  // Función para manejar los cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Función para obtener los usuarios registrados
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

  // Función para enviar el formulario de registro
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

      // Limpiar el formulario después del registro
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'cliente',
        claveDeAccion: '',
      });

      // Recargar la lista de usuarios
      fetchUsers();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al Registrar',
        text: error.response?.data?.message || 'Hubo un error al registrar el usuario.',
      });
    }
  };

  const handleDelete = async (userId) => {
    const token = localStorage.getItem('token'); // Obtén el token
  
    if (!token) {
      return Swal.fire('Error', 'No tienes permisos para realizar esta acción', 'error');
    }
  
    // Confirmación antes de eliminar
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
  
    if (result.isConfirmed) {
      try {
        // Realiza la solicitud DELETE con el token
        await axios.delete(`http://localhost:5000/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        Swal.fire('Eliminado', 'El usuario ha sido eliminado', 'success');
        // Aquí puedes actualizar la lista de usuarios
      } catch (error) {
        console.error(error);
        Swal.fire('Error', 'Hubo un problema al eliminar el usuario', 'error');
      }
    }
  };
  

  // Función para manejar la edición de un usuario
  const handleEdit = (user) => {
    setUserToEdit(user); // Guardar el usuario a editar
    setShowEditModal(true); // Mostrar el modal
  };

  // Función para manejar el cambio de datos en el modal de edición
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setUserToEdit({
      ...userToEdit,
      [name]: value,
    });
  };

  //Función de edicion de datos de los usuarios
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    // Obtener el token del localStorage
    const token = localStorage.getItem('token'); 
  
    if (!token) {
      return Swal.fire('Error', 'No tienes permisos para realizar esta acción', 'error');
    }
  
    // Obtener los datos del formulario
    const { name, email, password, role } = userToEdit;
  
    try {
      // Realizar la solicitud PATCH para actualizar el usuario
      const response = await axios.patch(
        `http://localhost:5000/api/users/${userToEdit._id}`,
        { name, email, password, role },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Asegúrate de que el token esté en los encabezados
          },
        }
      );
  
      Swal.fire('Exito', 'Usuario actualizado exitosamente', 'success');
      setShowEditModal(false);
      // Actualiza la lista de usuarios si es necesario
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        Swal.fire('Error', 'No autorizado. El token puede haber expirado', 'error');
      } else {
        Swal.fire('Error', 'Hubo un problema al actualizar el usuario', 'error');
      }
    }
  };

  // Cargar los usuarios cuando el componente se monte
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center text-white mb-4">Registrar Nuevo Usuario</h2>
      <form onSubmit={handleSubmit} className="bg-dark p-4 rounded">
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="name" className="form-label text-white">
                Nombre
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
                minLength="6"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label text-white">
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label text-white">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
              />
            </div>
          </div>

          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="role" className="form-label text-white">
                Rol
              </label>
              <select
                id="role"
                name="role"
                className="form-select"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="cliente">Cliente</option>
                <option value="tatuador">Tatuador</option>
                <option value="recepcionista">Recepcionista</option>
                <option value="administrador">Administrador</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="claveDeAccion" className="form-label text-white">
                Clave de Acción
              </label>
              <input
                type="text"
                id="claveDeAccion"
                name="claveDeAccion"
                className="form-control"
                value={formData.claveDeAccion}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-success w-100 mt-3">
          Registrar
        </button>
      </form>

      {/* Tabla de usuarios */}
      <h3 className="text-white mt-5">Usuarios Registrados</h3>
      <table className="table table-dark mt-4">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button
                  className="btn btn-warning"
                  onClick={() => handleEdit(user)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger ms-2"
                  onClick={() => handleDelete(user._id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de edición */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleEditSubmit}>
            <div className="mb-3">
              <label htmlFor="editName" className="form-label">
                Nombre
              </label>
              <input
                type="text"
                id="editName"
                name="name"
                className="form-control"
                value={userToEdit?.name || ''}
                onChange={handleEditChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="editPassword" className="form-label">
                Contraseña
              </label>
              <input
                type="password"
                id="editPassword"
                name="password"
                className="form-control"
                value={userToEdit?.password || ''}
                onChange={handleEditChange}
                required
              />
            </div>

            <Button variant="primary" type="submit">
              Guardar Cambios
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Usuarios;
