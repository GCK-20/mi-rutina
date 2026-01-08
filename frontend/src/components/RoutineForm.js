// Importamos el hook useState de React para manejar estados locales
import { useState } from 'react';

function RoutineForm() {
  // Estados para cada campo del formulario
  const [name, setName] = useState('');                // Nombre de la rutina
  const [type, setType] = useState('');                // Tipo de rutina (ej. ejercicio, maquillaje)
  const [steps, setSteps] = useState('');              // Pasos detallados de la rutina
  const [duration, setDuration] = useState('');        // Duración en minutos
  const [goal, setGoal] = useState('');                // Objetivo de la rutina (ej. fuerza, hidratación)
  const [context, setContext] = useState('');          // Contexto donde se realiza (ej. gimnasio, casa)
  const [climateSuitability, setClimateSuitability] = useState(''); // Clima recomendado
  const [timeRequired, setTimeRequired] = useState(''); // Tiempo requerido (rápido, completo)

  // Función para enviar la rutina al backend
  const createRoutine = async () => {
    // Obtenemos el token guardado en localStorage (se generó en el login)
    const token = localStorage.getItem('token');

    // Realizamos una petición POST al backend para crear la rutina
    const res = await fetch('http://localhost:4000/api/routines', {
      method: 'POST', // Método HTTP
      headers: {
        'Content-Type': 'application/json',           // Indicamos que enviamos JSON
        'Authorization': `Bearer ${token}`            // Incluimos el token en el header para autenticación
      },
      body: JSON.stringify({                          // Convertimos los datos del formulario a JSON
        name,
        type,
        steps,
        duration,
        goal,
        context,
        climate_suitability: climateSuitability,      // El backend espera este nombre exacto
        time_required: timeRequired                   // Igual aquí
      })
    });

    // Convertimos la respuesta en JSON
    const data = await res.json();
    // Mostramos un mensaje al usuario (del backend o por defecto)
    alert(data.message || 'Rutina creada');
  };

  // Renderizamos el formulario
  return (
    <div>
      <h2>Crear rutina</h2>
      {/* Campo para el nombre */}
      <input placeholder="Nombre" onChange={e => setName(e.target.value)} />
      <br />
      {/* Campo para el tipo */}
      <input placeholder="Tipo (ej. ejercicio, maquillaje)" onChange={e => setType(e.target.value)} />
      <br />
      {/* Campo para los pasos (textarea porque puede ser texto largo) */}
      <textarea placeholder="Pasos de la rutina" onChange={e => setSteps(e.target.value)} />
      <br />
      {/* Campo para duración en minutos */}
      <input type="number" placeholder="Duración (minutos)" onChange={e => setDuration(e.target.value)} />
      <br />
      {/* Campo para objetivo */}
      <input placeholder="Objetivo (ej. fuerza, hidratación)" onChange={e => setGoal(e.target.value)} />
      <br />
      {/* Campo para contexto */}
      <input placeholder="Contexto (ej. gimnasio, casa)" onChange={e => setContext(e.target.value)} />
      <br />
      {/* Campo para clima recomendado */}
      <input placeholder="Clima recomendado (ej. frío, calor)" onChange={e => setClimateSuitability(e.target.value)} />
      <br />
      {/* Campo para tiempo requerido */}
      <input placeholder="Tiempo requerido (ej. rápido, completo)" onChange={e => setTimeRequired(e.target.value)} />
      <br />
      {/* Botón que ejecuta la función createRoutine */}
      <button onClick={createRoutine}>Guardar rutina</button>
    </div>
  );
}

// Exportamos el componente para usarlo en otras partes de la app
export default RoutineForm;