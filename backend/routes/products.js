const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth'); // Middleware que valida el token

// 📌 Obtener todos los productos del usuario logueado
router.get('/', auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM products WHERE user_id = ?',
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener productos' });
  }
});

// 📌 Crear un nuevo producto
router.post('/', auth, async (req, res) => {
  try {
    const { name, type, color, expiration } = req.body;

    // Validación simple
    if (!name || !type || !color || !expiration) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    // Inserta el producto en la base de datos
    await db.query(
      'INSERT INTO products (name, type, color, expiration, user_id) VALUES (?, ?, ?, ?, ?)',
      [name, type, color, expiration, req.user.id]
    );

    res.json({ message: 'Producto creado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al crear producto' });
  }
});

// 📌 Actualizar un producto existente
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, color, expiration } = req.body;

    if (!name || !type || !color || !expiration) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    const [result] = await db.query(
      'UPDATE products SET name = ?, type = ?, color = ?, expiration = ? WHERE id = ? AND user_id = ?',
      [name, type, color, expiration, id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Producto no encontrado o no autorizado' });
    }

    res.json({ message: 'Producto actualizado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar producto' });
  }
});

// 📌 Eliminar un producto
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      'DELETE FROM products WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Producto no encontrado o no autorizado' });
    }

    res.json({ message: 'Producto eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al eliminar producto' });
  }
});

module.exports = router;