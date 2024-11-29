import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Container, Row, Col, Form, Button, Modal, Pagination } from "react-bootstrap";
import "./Galeria.css";

const Galeria = () => {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    // Obtener los proyectos de la API
    const fetchProjects = async () => {
      try {
        const response = await axios.get("http://localhost:3000/proyectos");
        setProjects(response.data);
      } catch (error) {
        console.error("Error al obtener los proyectos:", error);
      }
    };

    fetchProjects();
  }, []);

  // Filtrar los proyectos por término de búsqueda
  const filteredProjects = projects.filter(
    (project) =>
      project.name &&
      project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calcular los proyectos de la página actual
  const totalProjects = searchTerm ? filteredProjects : projects;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProjects = totalProjects.slice(indexOfFirstItem, indexOfLastItem);

  // Número total de páginas
  const totalPages = Math.ceil(totalProjects.length / itemsPerPage);

  // Cambiar de página
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Manejar apertura del modal con la imagen seleccionada
  const handleShowModal = (image) => {
    setModalImage(image);
    setShowModal(true);
  };

  // Cerrar el modal
  const handleCloseModal = () => {
    setShowModal(false);
    setModalImage("");
  };

  return (
    <div className="mt-4 galeria">
      <Form.Group controlId="search" className="mb-4">
        <Form.Control
          className="reception-search-input"
          type="text"
          placeholder="Buscar por nombre del tatuador..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form.Group>

      {/* Mostrar proyectos en formato de tarjetas */}
      <Row className="d-flex justify-content-start">
        {currentProjects.map((project) => (
          <div className="col-md-3 mb-4 columproyectos" key={project.id}>
            <div className="card" style={{ width: "300px", height: "400px" }}>
              <img
                src={project.image}
                className="card-img-top"
                alt={project.name}
                style={{ height: "280px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h5 className="card-title">{project.name}</h5>
                <div className="d-flex justify-content-center">
                  <button
                    className="btn btn-success"
                    onClick={() => handleShowModal(project.image)}
                  >
                    Ver Más
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Row>

      {/* Paginación */}
      {totalPages > 1 && (
        <Pagination className="justify-content-center">
          {[...Array(totalPages).keys()].map((pageNumber) => (
            <Pagination.Item
              key={pageNumber}
              active={pageNumber + 1 === currentPage}
              onClick={() => handlePageChange(pageNumber + 1)}
            >
              {pageNumber + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      )}

      {/* Modal para mostrar la imagen en tamaño original */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header style={{ backgroundColor: "#333", color: "#fff" }}>
          <Modal.Title>Imagen del Proyecto</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center" style={{ backgroundColor: "#222" }}>
          <img
            src={modalImage}
            alt="Imagen del Proyecto"
            className="img-fluid"
            style={{ maxWidth: "100%", maxHeight: "80vh" }}
          />
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: "#222" }}>
          <Button variant="secondary" onClick={handleCloseModal} className="closeModalBtn">
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Galeria;