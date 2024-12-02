import React from 'react'
import "./Footer.css"

function Footer() {
  return (
    <footer className="bg-dark text-white text-center py-3">
      <p className="mb-0 footerText">
        © {new Date().getFullYear()} Magia Negra - Estudio de tatuajes. Todos los derechos reservados.
      </p>
    </footer>
  )
}

export default Footer
