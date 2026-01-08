import { useState } from 'react';

function ProductForm() {
  // Estados para cada campo del formulario
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [color, setColor] = useState('');
  const [expiration, setExpiration] = useState('');

  // Función para enviar el producto al backend
  const createProduct = async () => {
    const token = localStorage.getItem('token');

    const res = await fetch('http://localhost:4000/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name, type, color, expiration })
    });

    const data = await res.json();
    alert(data.message);
  };

  return (
    <div>
      <h2>Crear producto</h2>
      <input placeholder="Nombre" onChange={e => setName(e.target.value)} />
      <input placeholder="Tipo" onChange={e => setType(e.target.value)} />
      <input placeholder="Color" onChange={e => setColor(e.target.value)} />
      <input type="date" onChange={e => setExpiration(e.target.value)} />
      <button onClick={createProduct}>Guardar</button>
    </div>
  );
}

export default ProductForm;