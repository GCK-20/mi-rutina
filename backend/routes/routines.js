// Importamos Express para crear rutas
const express = require('express');
// Creamos un router de Express (agrupa las rutas relacionadas)
const router = express.Router();
// Importamos la conexión a la base de datos
const db = require('../db');
// Importamos el middleware de autenticación que valida el token JWT
const auth = require('../middleware/auth'); // Middleware que valida el token

// Obtener todas las rutinas del usuario logueado
router.get('/', auth, async (req, res) => {
  try {
    // Consultamos todas las rutinas que pertenecen al usuario autenticado
    const [rows] = await db.query(
      'SELECT * FROM routines WHERE user_id = ?',
      [req.user.id] // req.user viene del token decodificado en el middleware
    );
    // Respondemos con las rutinas en formato JSON
    res.json(rows);
  } catch (err) {
    // Si ocurre un error, lo mostramos en consola y devolvemos un 500
    console.error(err);
    res.status(500).json({ message: 'Error al obtener rutinas' });
  }
});

// Crear una nueva rutina
router.post('/', auth, async (req, res) => {
  try {
    // Extraemos los campos enviados en el body de la petición
    const {
      name,
      type,
      steps,
      duration,
      goal,
      context,
      climate_suitability,
      time_required
    } = req.body;

    // Validación: todos los campos son obligatorios
    if (
      !name || !type || !steps || !duration ||
      !goal || !context || !climate_suitability || !time_required
    ) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    // Insertamos la nueva rutina en la base de datos
    await db.query(
      'INSERT INTO routines (name, type, steps, duration, goal, context, climate_suitability, time_required, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, type, steps, duration, goal, context, climate_suitability, time_required, req.user.id]
    );

    // Respondemos confirmando la creación
    res.json({ message: 'Rutina creada' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al crear rutina' });
  }
});

// Actualizar rutina
router.put('/:id', auth, async (req, res) => {
  try {
    // Obtenemos el id de la rutina desde los parámetros de la URL
    const { id } = req.params;
    // Extraemos los campos enviados en el body
    const {
      name,
      type,
      steps,
      duration,
      goal,
      context,
      climate_suitability,
      time_required
    } = req.body;

    // Validación de campos obligatorios
    if (
      !name || !type || !steps || !duration ||
      !goal || !context || !climate_suitability || !time_required
    ) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    // Actualizamos la rutina en la base de datos
    const [result] = await db.query(
      'UPDATE routines SET name = ?, type = ?, steps = ?, duration = ?, goal = ?, context = ?, climate_suitability = ?, time_required = ? WHERE id = ? AND user_id = ?',
      [name, type, steps, duration, goal, context, climate_suitability, time_required, id, req.user.id]
    );

    // Si no se afectó ninguna fila, significa que la rutina no existe o no pertenece al usuario
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Rutina no encontrada o no autorizada' });
    }

    // Respondemos confirmando la actualización
    res.json({ message: 'Rutina actualizada' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar rutina' });
  }
});

// Eliminar rutina
router.delete('/:id', auth, async (req, res) => {
  try {
    // Obtenemos el id de la rutina desde los parámetros de la URL
    const { id } = req.params;

    // Eliminamos la rutina que coincida con el id y el user_id
    const [result] = await db.query(
      'DELETE FROM routines WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    // Si no se eliminó ninguna fila, la rutina no existe o no pertenece al usuario
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Rutina no encontrada o no autorizada' });
    }

    // Respondemos confirmando la eliminación
    res.json({ message: 'Rutina eliminada' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al eliminar rutina' });
  }
});

// Exportamos el router para usarlo en app.js o index.js
module.exports = router;