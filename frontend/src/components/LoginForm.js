import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        // Guardamos token y nombre en localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('name', data.name);

        // Redirigir al dashboard
        navigate('/dashboard');
      } else {
        setMessage(data.message || 'Error al iniciar sesión');
      }
    } catch (err) {
      setMessage('Error de conexión con el servidor');
    }
  };

  return (
    <div className="login-form">
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Entrar</button>
      </form>

      {message && <p>{message}</p>}

      {/* Botón para ir a la página de registro */}
      <button
        type="button"
        onClick={() => navigate('/register')}
        style={{ marginTop: '1rem', backgroundColor: '#6a0dad', color: '#fff' }}
      >
        ¿No tienes cuenta? Regístrate aquí
      </button>
    </div>
  );
}

export default LoginForm;