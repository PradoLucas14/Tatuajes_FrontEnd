import React from 'react'
import "./Banner.css"

function Banner() {
  return (
    <div className='Banner'>
      <div className='column column1'>
        <div className='textBanner'>
            <p className="saludo">
                Hola, somos el estudio
            </p>
            <h1>
                Black Magic
            </h1>
            <p className="descripcionBanner">
            Bienvenidos a nuestro estudio de tatuajes, donde la creatividad cobra vida en cada trazo. 
            Transformamos tus ideas en arte permanente, creando diseños únicos que cuentan tu historia a través de la piel. 
            ¡Descubre tu próximo tatuaje!
            </p>
            <button className='bannerButton'>Registrate</button>
            <div className='redesBanner'>
                <button className='RedBanner'>
                    <i className="fab fa-instagram"></i><p>Instagram</p>
                </button>
                <button className='RedBanner'>
                    <i className="fab fa-facebook"></i><p>Facebook</p>
                </button>
            </div>
        </div>
      </div>
      <div className='column column2'>
        <div className="overlayColum2">
        </div>
      </div>
    </div>
  )
}

export default Banner
