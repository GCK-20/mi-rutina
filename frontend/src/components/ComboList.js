import { useEffect, useState } from 'react';

function ComboList() {
  const [combos, setCombos] = useState([]);
  const [error, setError] = useState('');
  const [occasion, setOccasion] = useState('');
  const [climate, setClimate] = useState('');
  const [timeAvailable, setTimeAvailable] = useState('');

  // Estados para edición
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    routine_id: '',
    product_id: '',
    occasion: '',
    climate: '',
    time_available: ''
  });
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

  const fetchCombos = async () => {
    if (!token) {
      setError('No has iniciado sesión.');
      return;
    }

    try {
      const query = new URLSearchParams();
      if (occasion) query.append('occasion', occasion);
      if (climate) query.append('climate', climate);
      if (timeAvailable) query.append('time_available', timeAvailable);

      const res = await fetch(`${API_URL}/combos?${query.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) {
        setError(`Error ${res.status}: No se pudo obtener combos.`);
        setCombos([]);
        return;
      }

      const data = await res.json();
      setCombos(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      console.error('Error de red:', err.message);
      setError('Error de conexión con el servidor.');
      setCombos([]);
    }
  };

  useEffect(() => {
    fetchCombos();
  }, []);

  // Funciones de edición
  function startEdit(combo) {
    setEditingId(combo.id);
    setFormData({
      routine_id: combo.routine_id,
      product_id: combo.product_id,
      occasion: combo.occasion,
      climate: combo.climate,
      time_available: combo.time_available
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

  async function updateCombo(id) {
    setLoading(true);
    setFeedback('');
    try {
      const res = await fetch(`${API_URL}/combos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al actualizar');
      setFeedback('Combo actualizado correctamente.');
      setEditingId(null);
      fetchCombos();
    } catch (err) {
      setFeedback(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function deleteCombo(id) {
    const ok = window.confirm('¿Seguro que deseas eliminar este combo?');
    if (!ok) return;
    setLoading(true);
    setFeedback('');
    try {
      const res = await fetch(`${API_URL}/combos/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al eliminar');
      setFeedback('Combo eliminado correctamente.');
      fetchCombos();
    } catch (err) {
      setFeedback(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>Mis combos</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {feedback && <p style={{ color: 'green' }}>{feedback}</p>}

      <div style={{ marginBottom: '1rem' }}>
        <input placeholder="Filtrar por ocasión" onChange={e => setOccasion(e.target.value)} />
        <input placeholder="Filtrar por clima" onChange={e => setClimate(e.target.value)} />
        <input placeholder="Filtrar por tiempo disponible" onChange={e => setTimeAvailable(e.target.value)} />
        <button onClick={fetchCombos}>Aplicar filtros</button>
      </div>

      {combos.length === 0 && !error ? (
        <p>No hay combos registrados.</p>
      ) : (
        <ul>
          {combos.map(c => (
            <li key={c.id} style={{ marginBottom: '12px' }}>
              {editingId === c.id ? (
                <div>
                  <input name="routine_id" value={formData.routine_id} onChange={handleChange} placeholder="Routine ID" />
                  <input name="product_id" value={formData.product_id} onChange={handleChange} placeholder="Product ID" />
                  <input name="occasion" value={formData.occasion} onChange={handleChange} placeholder="Ocasión" />
                  <input name="climate" value={formData.climate} onChange={handleChange} placeholder="Clima" />
                  <input name="time_available" value={formData.time_available} onChange={handleChange} placeholder="Tiempo disponible" />
                  <div style={{ marginTop: '8px' }}>
                    <button onClick={() => updateCombo(c.id)} disabled={loading}>Guardar</button>
                    <button onClick={cancelEdit} disabled={loading} style={{ marginLeft: '8px' }}>Cancelar</button>
                  </div>
                </div>
              ) : (
                <div>
                  <strong>Ocasión:</strong> {c.occasion || 'N/A'} — 
                  <strong> Clima:</strong> {c.climate || 'N/A'} — 
                  <strong> Tiempo:</strong> {c.time_available || 'N/A'}  
                  <br />
                  Rutina: {c.routine_name} ({c.routine_type}) — Producto: {c.product_name} ({c.product_type})
                  <div style={{ marginTop: '6px' }}>
                    <button onClick={() => startEdit(c)}>Editar</button>
                    <button onClick={() => deleteCombo(c.id)} style={{ marginLeft: '8px' }}>Eliminar</button>
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

export default ComboList;