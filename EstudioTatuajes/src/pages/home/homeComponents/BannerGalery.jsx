// Carousel.js
import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import axios from 'axios';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./BannerGalery.css"
const Carousel = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:3000/proyectos')
            .then(response => {
                // No hay necesidad de acceder a una propiedad específica
                if (Array.isArray(response.data)) {
                    setImages(response.data);
                } else {
                    console.error('Data format error:', response.data);
                }
            })
            .catch(error => {
                console.error('Error fetching images:', error);
                setError('Error fetching images');
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        arrows: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="carousel-container">
          <div className="galeryTituloHome">
            <h4>Nuestros Proyectos</h4>
          </div>
            <Slider {...settings}>
                {images.map(image => (
                    <div key={image.id} className='imgContainerGalery'>
                        <img src={image.image} alt={image.alt} className="carousel-image" />
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default Carousel;
