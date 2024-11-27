import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './Admin.css';

// Componentes para cada sección
const Dashboard = () => <div>Dashboard</div>;
const Users = () => <div>Gestión de Usuarios</div>;
const Reports = () => <div>Reportes</div>;
const Settings = () => <div>Configuración</div>;

function Admin() {
  return (
    <div className="admin-container">
      {/* Sidebar */}
      <nav className="admin-sidebar">
        <h3>Admin Panel</h3>
        <ul className="admin-sidebar-menu">
          <li>
            <Link to="/">Dashboard</Link>
          </li>
          <li>
            <Link to="/users">Gestión de Usuarios</Link>
          </li>
          <li>
            <Link to="/reports">Reportes</Link>
          </li>
          <li>
            <Link to="/settings">Configuración</Link>
          </li>
        </ul>
      </nav>

      {/* Contenido principal */}
      <div className="admin-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
}

export default Admin;
