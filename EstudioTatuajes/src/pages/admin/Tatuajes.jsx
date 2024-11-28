import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import "./Tatuajes.css"

function Tatuajes() {
  const [formData, setFormData] = useState({
    nombre: "",
    especialidad: "",
    imagen: "",
    mail: "",
  });
  const [proyectos, setProyectos] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const [empleados, setEmpleados] = useState([]);

  // Obtener proyectos al cargar el componente
  useEffect(() => {
    axios
      .get("http://localhost:3000/proyectos")
      .then((response) => setProyectos(response.data))
      .catch((error) => console.error("Error al obtener proyectos:", error));

    // Obtener empleados (usuarios) para validar el correo y rol
    axios
      .get("http://localhost:5000/api/users")
      .then((response) => setEmpleados(response.data))
      .catch((error) => console.error("Error al obtener usuarios:", error));
  }, []);

  // Filtrar proyectos por nombre de tatuador al escribir en la barra de búsqueda
  const filteredProyectos = proyectos.filter((proyecto) =>
    proyecto.name && proyecto.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Verificar si ya existe un perfil con el correo proporcionado y que el rol sea tatuador
      const empleadoExistente = empleados.find(
        (empleado) => empleado.mail === formData.mail && empleado.rol === "tatuador"
      );

      if (!empleadoExistente) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "El correo electrónico no está registrado o el rol no es de tatuador.",
        });
        return;
      }

      // Verificar si ya existe un tatuador con el mismo correo en la base de datos de empleados
      const isEmailUsed = empleados.some((empleado) => empleado.mail === formData.mail);

      if (isEmailUsed) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ya existe un perfil registrado con este correo electrónico.",
        });
        return;
      }

      // Registrar el perfil del tatuador
      await axios.post("http://localhost:3000/empleados", formData);

      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: "El perfil del tatuador se ha registrado correctamente.",
      });

      // Limpiar formulario después del éxito
      setFormData({
        nombre: "",
        especialidad: "",
        imagen: "",
        mail: "",
      });
    } catch (error) {
      console.error("Error al registrar el tatuador:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al registrar el perfil del tatuador.",
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/proyectos/${id}`);
      setProyectos(proyectos.filter((proyecto) => proyecto.id !== id));
      Swal.fire({
        icon: "success",
        title: "Proyecto Eliminado",
        text: "El proyecto ha sido eliminado correctamente.",
      });
    } catch (error) {
      console.error("Error al eliminar el proyecto:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al eliminar el proyecto.",
      });
    }
  };

  const handleShowModal = (image) => {
    setModalImage(image);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalImage("");
  };

  return (
    <div className="tatuajes">
      <form onSubmit={handleSubmit} className="reception-form">
      <h2 className="usuar-title mb-4 text-white">Registrar Perfil de Tatuador</h2>
        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="mail" className="form-label">
              Correo Electrónico:
            </label>
            <input
              type="email"
              placeholder="Ingrese el correo electronico"
              className="form-control reception-input"
              id="mail"
              name="mail"
              value={formData.mail}
              autoComplete="off"
              onChange={(e) => setFormData({ ...formData, mail: e.target.value })}
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="nombre" className="form-label">
              Nombre:
            </label>
            <input
              type="text"
              placeholder="Ingrese el nombre del tatuador"
              className="form-control reception-input"
              autoComplete="off"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="especialidad" className="form-label">
              Especialidad:
            </label>
            <input
              type="text"
              className="form-control reception-input"
              placeholder="Ingrese la especialidad del Tatuador"
              autoComplete="off"
              id="especialidad"
              name="especialidad"
              value={formData.especialidad}
              onChange={(e) => setFormData({ ...formData, especialidad: e.target.value })}
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="foto" className="form-label">
              URL de la Foto:
            </label>
            <input
              type="url"
              className="form-control reception-input"
              autoComplete="off"
              placeholder="Ingrese la URL de la foto de perfil del tatuador"
              id="foto"
              name="foto"
              value={formData.foto}
              onChange={(e) => setFormData({ ...formData, foto: e.target.value })}
              required
            />
          </div>
        </div>

        <button type="submit" className="reception-submit">
          Registrar Tatuador
        </button>
      </form>

      <h3 className="usuar-title mb-4 text-white">Buscar Proyectos de Tatuadores</h3>
      <InputGroup className="mb-4">
        <Form.Control
          type="text"
          placeholder="Buscar por nombre del tatuador"
          value={search}
          className="reception-search-input mb-2"
          onChange={handleSearchChange}
        />
      </InputGroup>

      <div className="row">
        {filteredProyectos.length === 0 && search && (
          <p className="text-center">No se encontraron proyectos para el tatuador: "{search}"</p>
        )}
        {filteredProyectos.map((proyecto) => (
          <div className="col-md-3 mb-4 columproyectos" key={proyecto.id}>
            <div className="card" style={{ width: "300px", height: "400px" }}>
              <img
                src={proyecto.image}
                className="card-img-top"
                alt={proyecto.nombre}
                style={{ height: "280px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h5 className="card-title">{proyecto.name}</h5>
                <div className="d-flex justify-content-between">
                  <button
                    className="btn btn-success"
                    onClick={() => handleShowModal(proyecto.image)}
                  >
                    Ver Más
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(proyecto.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal para mostrar la imagen en tamaño original */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        className="dark-modal" // Añadimos una clase personalizada para el estilo oscuro
        >
        <Modal.Header className="dark-modal-header">
            <Modal.Title>Imagen del Proyecto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <img
            src={modalImage}
            alt="Imagen del Proyecto"
            className="img-fluid"
            style={{ maxHeight: "auto", width: "auto" }}
            />
        </Modal.Body>
        <Modal.Footer className="dark-modal-footer">
            <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
            </Button>
        </Modal.Footer>
        </Modal>
    </div>
  );
}

export default Tatuajes;
