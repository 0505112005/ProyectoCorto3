const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors()); // habilitar CORS para que el frontend pueda hacer peticiones
app.use(express.json()); // para que Express entienda JSON en las peticiones

const authRoutes = require('./routes/auth'); // rutas de autenticación
const taskRoutes = require('./routes/tasks'); // rutas para tareas

// Conectar a MongoDB usando la URL que está en .env
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error(err));

// Usar las rutas para autenticación y tareas
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Levantar el servidor en el puerto definido o 5000 si no hay
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
