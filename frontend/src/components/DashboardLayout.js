import { NavLink, Outlet } from 'react-router-dom';
import SessionStatus from './SessionStatus';

function DashboardLayout() {
  // Recuperamos el nombre del usuario desde localStorage
  const userName = localStorage.getItem('name');

  // Obtenemos la hora actual
  const currentHour = new Date().getHours();

  // Determinamos saludo + emoji según la hora
  let greeting = 'Hola';
  let emoji = '👋';

  if (currentHour < 12) {
    greeting = 'Buenos días';
    emoji = '☀️';
  } else if (currentHour < 18) {
    greeting = 'Buenas tardes';
    emoji = '🌆';
  } else {
    greeting = 'Buenas noches';
    emoji = '🌙';
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Mi Rutina</h1>

        {/* Saludo único y dinámico */}
        {userName && (
          <p className="welcome-message">
            {emoji} {greeting}, {userName} ✅
          </p>
        )}

        <SessionStatus />
      </header>

      <nav className="dashboard-nav">
        <NavLink
          to="/dashboard/products"
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          Productos
        </NavLink>
        <NavLink
          to="/dashboard/routines"
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          Rutinas
        </NavLink>
        <NavLink
          to="/dashboard/combos"
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          Combos
        </NavLink>
      </nav>

      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;