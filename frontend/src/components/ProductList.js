import { useEffect, useState } from 'react';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', type: '', color: '', expiration: '' });
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

  const fetchProducts = async () => {
    if (!token) {
      setError('No has iniciado sesión.');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/products`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) {
        if (res.status === 401) {
          setError('Token inválido o expirado. Por favor inicia sesión de nuevo.');
        } else {
          setError(`Error ${res.status}: No se pudo obtener productos.`);
        }
        setProducts([]);
        return;
      }

      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      console.error('Error de red:', err.message);
      setError('Error de conexión con el servidor.');
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Funciones de edición
  function startEdit(product) {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      type: product.type,
      color: product.color,
      expiration: product.expiration ? product.expiration.split('T')[0] : ''
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

  async function updateProduct(id) {
    setLoading(true);
    setFeedback('');
    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al actualizar');
      setFeedback('Producto actualizado correctamente.');
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      setFeedback(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function deleteProduct(id) {
    const ok = window.confirm('¿Seguro que deseas eliminar este producto?');
    if (!ok) return;
    setLoading(true);
    setFeedback('');
    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al eliminar');
      setFeedback('Producto eliminado correctamente.');
      fetchProducts();
    } catch (err) {
      setFeedback(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>Mis productos</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {feedback && <p style={{ color: 'green' }}>{feedback}</p>}
      {products.length === 0 && !error ? (
        <p>No hay productos registrados.</p>
      ) : (
        <ul>
          {products.map(p => (
            <li key={p.id} style={{ marginBottom: '12px' }}>
              {editingId === p.id ? (
                <div>
                  <input name="name" value={formData.name} onChange={handleChange} placeholder="Nombre" />
                  <input name="type" value={formData.type} onChange={handleChange} placeholder="Tipo" />
                  <input name="color" value={formData.color} onChange={handleChange} placeholder="Color" />
                  <input
                    name="expiration"
                    type="date"
                    value={formData.expiration}
                    onChange={handleChange}
                    placeholder="Fecha de expiración"
                  />
                  <div style={{ marginTop: '8px' }}>
                    <button onClick={() => updateProduct(p.id)} disabled={loading}>Guardar</button>
                    <button onClick={cancelEdit} disabled={loading} style={{ marginLeft: '8px' }}>Cancelar</button>
                  </div>
                </div>
              ) : (
                <div>
                  <strong>{p.name}</strong> — {p.type}, {p.color}, expira: {new Date(p.expiration).toLocaleDateString()}
                  <div style={{ marginTop: '6px' }}>
                    <button onClick={() => startEdit(p)}>Editar</button>
                    <button onClick={() => deleteProduct(p.id)} style={{ marginLeft: '8px' }}>Eliminar</button>
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

export default ProductList;