import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Swal from 'sweetalert2';

function PrivateRoute({ allowedRoles }) {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  if (!token) {
    Swal.fire({
      title: 'No autenticado',
      text: 'Por favor, inicia sesión para continuar.',
      icon: 'warning',
      confirmButtonText: 'Aceptar',
      customClass: {
        popup: 'swal2-dark',
      },
    }).then(() => {
      window.location.href = '/login'; // Redirigir a la página de inicio de sesión
    });
    return null; // No renderiza nada mientras se redirige
  }

  if (!allowedRoles.includes(userRole)) {
    Swal.fire({
      title: 'Acceso Denegado',
      text: 'No tienes permisos para acceder a esta página.',
      icon: 'error',
      confirmButtonText: 'Volver',
      customClass: {
        popup: 'swal2-dark',
      },
    }).then(() => {
      window.location.href = '/'; // Redirigir a la página principal
    });
    return null; // No renderiza nada mientras se redirige
  }

  return <Outlet />; // Si el usuario está autenticado y tiene el rol adecuado, renderiza el contenido
}

export default PrivateRoute;
