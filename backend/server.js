const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Importar rutas
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const routineRoutes = require('./routes/routines');
const comboRoutes = require('./routes/combos');

// Usar rutas
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/routines', routineRoutes);
app.use('/api/combos', comboRoutes);

app.listen(4000, () => console.log('Servidor en http://localhost:4000'));