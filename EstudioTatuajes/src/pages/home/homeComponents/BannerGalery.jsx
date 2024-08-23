import React from 'react'
import img1 from "../../../assets/img/imgHome/BannerGalery.jpg"
import "./BannerGalery.css"

function BannerGalery() {
  return (
    <div className='BannerGalery'>
        <div className="tituloGaleryT">
            <h4>Nuestros Proyectos</h4>
        </div>

        <img src={img1} alt="Banner de galeria" />
        
        <div className="btnContainer">
            <button className='bannerButton'>
                <p>Ver más</p>
            </button>
        </div>
    </div>
  )
}

export default BannerGalery
