const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'TU_CONTRASEÑA',
  database: 'mi_rutina'
});

module.exports = pool;