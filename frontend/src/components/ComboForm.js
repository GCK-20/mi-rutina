import { useState } from 'react';

function ComboForm() {
  const [routineId, setRoutineId] = useState('');
  const [productId, setProductId] = useState('');
  const [occasion, setOccasion] = useState('');
  const [climate, setClimate] = useState('');
  const [timeAvailable, setTimeAvailable] = useState('');

  const createCombo = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:4000/api/combos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        routine_id: routineId,
        product_id: productId,
        occasion,
        climate,
        time_available: timeAvailable
      })
    });
    const data = await res.json();
    alert(data.message || 'Combo creado');
  };

  return (
    <div>
      <h2>Crear combo</h2>
      <input placeholder="ID de rutina" onChange={e => setRoutineId(e.target.value)} />
      <br />
      <input placeholder="ID de producto" onChange={e => setProductId(e.target.value)} />
        <br />
      <input placeholder="Ocasión (ej. fiesta, diario)" onChange={e => setOccasion(e.target.value)} />
      <br />
      <input placeholder="Clima (ej. frío, calor)" onChange={e => setClimate(e.target.value)} />
        <br />
      <input placeholder="Tiempo disponible (ej. rápido, completo)" onChange={e => setTimeAvailable(e.target.value)} />
      <br />
      <button onClick={createCombo}>Guardar combo</button>
    </div>
  );
}

export default ComboForm;