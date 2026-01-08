const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth'); // Middleware que valida el token

// 📌 Obtener combos del usuario logueado con filtros opcionales y JOIN
router.get('/', auth, async (req, res) => {
  try {
    const { occasion, climate, time_available } = req.query;

    // Consulta base con JOIN para obtener nombres de rutina y producto
    let query = `
      SELECT 
        combos.*, 
        routines.name AS routine_name, 
        routines.type AS routine_type,
        products.name AS product_name, 
        products.type AS product_type
      FROM combos
      JOIN routines ON combos.routine_id = routines.id
      JOIN products ON combos.product_id = products.id
      WHERE combos.user_id = ?
    `;
    const params = [req.user.id];

    // Agregamos filtros dinámicamente si existen
    if (occasion) {
      query += ' AND combos.occasion = ?';
      params.push(occasion);
    }
    if (climate) {
      query += ' AND combos.climate = ?';
      params.push(climate);
    }
    if (time_available) {
      query += ' AND combos.time_available = ?';
      params.push(time_available);
    }

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener combos' });
  }
});

// 📌 Crear combo
router.post('/', auth, async (req, res) => {
  try {
    const { routine_id, product_id, occasion, climate, time_available } = req.body;

    if (!routine_id || !product_id || !occasion || !climate || !time_available) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    await db.query(
      'INSERT INTO combos (routine_id, product_id, occasion, climate, time_available, user_id) VALUES (?, ?, ?, ?, ?, ?)',
      [routine_id, product_id, occasion, climate, time_available, req.user.id]
    );

    res.json({ message: 'Combo creado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al crear combo' });
  }
});

// 📌 Actualizar combo
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { routine_id, product_id, occasion, climate, time_available } = req.body;

    if (!routine_id || !product_id || !occasion || !climate || !time_available) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    const [result] = await db.query(
      'UPDATE combos SET routine_id = ?, product_id = ?, occasion = ?, climate = ?, time_available = ? WHERE id = ? AND user_id = ?',
      [routine_id, product_id, occasion, climate, time_available, id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Combo no encontrado o no autorizado' });
    }

    res.json({ message: 'Combo actualizado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar combo' });
  }
});

// 📌 Eliminar combo
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      'DELETE FROM combos WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Combo no encontrado o no autorizado' });
    }

    res.json({ message: 'Combo eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al eliminar combo' });
  }
});

module.exports = router;