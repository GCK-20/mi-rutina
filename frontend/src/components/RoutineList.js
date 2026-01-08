import { useEffect, useState } from 'react';

function RoutineList() {
  const [routines, setRoutines] = useState([]);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', type: '', duration: '', goal: '' });
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

  const fetchRoutines = async () => {
    if (!token) {
      setError('No has iniciado sesión.');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/routines`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) {
        if (res.status === 401) {
          setError('Token inválido o expirado. Por favor inicia sesión de nuevo.');
        } else {
          setError(`Error ${res.status}: No se pudo obtener rutinas.`);
        }
        setRoutines([]);
        return;
      }

      const data = await res.json();
      setRoutines(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      console.error('Error de red:', err.message);
      setError('Error de conexión con el servidor.');
      setRoutines([]);
    }
  };

  useEffect(() => {
    fetchRoutines();
  }, []);

  // Funciones de edición
  function startEdit(routine) {
    setEditingId(routine.id);
    setFormData({
      name: routine.name,
      type: routine.type,
      duration: routine.duration,
      goal: routine.goal
    });
    setFeedback('');
  }

  function cancelEdit() {
    setEditingId(null);
    setFeedback('');
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function updateRoutine(id) {
    setLoading(true);
    setFeedback('');
    try {
      const res = await fetch(`${API_URL}/routines/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al actualizar');
      setFeedback('Rutina actualizada correctamente.');
      setEditingId(null);
      fetchRoutines();
    } catch (err) {
      setFeedback(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function deleteRoutine(id) {
    const ok = window.confirm('¿Seguro que deseas eliminar esta rutina?');
    if (!ok) return;
    setLoading(true);
    setFeedback('');
    try {
      const res = await fetch(`${API_URL}/routines/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al eliminar');
      setFeedback('Rutina eliminada correctamente.');
      fetchRoutines();
    } catch (err) {
      setFeedback(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>Mis rutinas</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {feedback && <p style={{ color: 'green' }}>{feedback}</p>}
      {routines.length === 0 && !error ? (
        <p>No hay rutinas registradas.</p>
      ) : (
        <ul>
          {routines.map(r => (
            <li key={r.id} style={{ marginBottom: '12px' }}>
              {editingId === r.id ? (
                <div>
                  <input name="name" value={formData.name} onChange={handleChange} placeholder="Nombre" />
                  <input name="type" value={formData.type} onChange={handleChange} placeholder="Tipo" />
                  <input name="duration" type="number" value={formData.duration} onChange={handleChange} placeholder="Duración (min)" />
                  <input name="goal" value={formData.goal} onChange={handleChange} placeholder="Objetivo" />
                  <div style={{ marginTop: '8px' }}>
                    <button onClick={() => updateRoutine(r.id)} disabled={loading}>Guardar</button>
                    <button onClick={cancelEdit} disabled={loading} style={{ marginLeft: '8px' }}>Cancelar</button>
                  </div>
                </div>
              ) : (
                <div>
                  <strong>{r.name}</strong> — {r.type}, duración: {r.duration} min, objetivo: {r.goal}
                  <div style={{ marginTop: '6px' }}>
                    <button onClick={() => startEdit(r)}>Editar</button>
                    <button onClick={() => deleteRoutine(r.id)} style={{ marginLeft: '8px' }}>Eliminar</button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RoutineList;