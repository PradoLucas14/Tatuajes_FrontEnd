import React, { useState, useEffect } from 'react';
import Carousel from 'react-multi-carousel';
import axios from 'axios';
import 'react-multi-carousel/lib/styles.css';

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3
  },
  tablet: {
    breakpoint: { max: 1024, min: 768 },
    items: 2
  },
  mobile: {
    breakpoint: { max: 768, min: 0 },
    items: 1
  }
};

const CarouselComponent = () => {
  const [empleados, setEmpleados] = useState([]);

  useEffect(() => {
    // Hacer la solicitud a json-server
    axios.get('http://localhost:3000/empleados')
      .then(response => {
        setEmpleados(response.data);
      })
      .catch(error => {
        console.error("Error al obtener los empleados: ", error);
      });
  }, []);

  return (
    <Carousel responsive={responsive}>
      {empleados.map((empleado) => (
        <div className="card" key={empleado.id}>
          <img src={empleado.imagen} alt={empleado.nombre} className="card-img" />
          <h3>{empleado.nombre}</h3>
          <p>{empleado.especialidad}</p>
        </div>
      ))}
    </Carousel>
  );
};

export default CarouselComponent;
