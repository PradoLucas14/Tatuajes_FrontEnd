import React from 'react'
import imagen from "../../../assets/img/imgHome/imagenBanner.jpg"
import "./About.css"

function About() {
  return (
    <div className='About'>
        <div className='containerAbout'>
            <div className='columna1'>
                <img src={imagen} alt="imagen del about" className="imagenColumna1"/>
            </div>
            <div className='columna2'>
                <div className='textAboutContainer'>
                    <h2 className="tituloAbout">¿Quines somos?</h2>
                    <p className="aboutDescripcion">
                    En Black Magic somos un colectivo de artistas apasionados por el tatuaje, dedicados a transformar la piel en un lienzo de expresión única. 
                    Nos especializamos en diseños que exploran lo místico, lo oscuro y lo simbólico, y creemos en el poder del tatuaje para contar historias, expresar identidad y conectar con lo más profundo de cada persona. 
                    Cada tatuaje que realizamos es una obra de arte creada con meticulosa atención al detalle, donde la creatividad de nuestros artistas se fusiona con tus ideas para dar vida a algo verdaderamente único. 
                    En Black Magic, cada trazo lleva la esencia de lo que eres y lo que deseas transmitir al mundo.
                    </p>
                    <p className="locationAbout">
                        <i className="fas fa-location-dot"></i> Dirección: Rivadavia 800, Alderetes.
                    </p>
                    <p className="horarioAbout">
                        <i className="fas fa-clock"></i> Horarios: Lunes a viernes de 10:00 a 18:00.
                    </p>
                    <button className='bannerButton'>
                        <p>Ver más</p>
                    </button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default About

