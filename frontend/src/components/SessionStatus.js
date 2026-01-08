import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function SessionStatus() {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  const [greeting, setGreeting] = useState('');
  const [emoji, setEmoji] = useState('');

  // Función para calcular saludo dinámico
  const updateGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) {
      setGreeting('Buenos días');
      setEmoji('☀️');
    } else if (hour >= 12 && hour < 18) {
      setGreeting('Buenas tardes');
      setEmoji('🌇');
    } else {
      setGreeting('Buenas noches');
      setEmoji('🌙');
    }
  };

  // Actualizar saludo al montar y cada minuto
  useEffect(() => {
    updateGreeting();
    const interval = setInterval(updateGreeting, 60000); // cada 60 segundos
    return () => clearInterval(interval); // limpiar al desmontar
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      <button onClick={logout}>Cerrar sesión</button>
    </div>
  );
}

export default SessionStatus;