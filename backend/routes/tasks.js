const express = require('express');
const jwt = require('jsonwebtoken');
const Task = require('../models/Task');
const router = express.Router();

// Middleware para verificar que el usuario esté autenticado
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // sacar token del header
  if (!token) return res.status(401).json({ msg: 'Token requerido' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // verificar token
    req.userId = decoded.id; // guardar id del usuario en la request
    next(); // seguir con la siguiente función
  } catch {
    res.status(401).json({ msg: 'Token inválido' });
  }
};

router.use(authMiddleware); // aplicar middleware a todas las rutas de tareas

// Obtener todas las tareas del usuario logueado
router.get('/', async (req, res) => {
  try {
    console.log('GET /api/tasks usuario:', req.userId);
    const tasks = await Task.find({ user: req.userId }); // buscar solo tareas de este usuario
    res.json(tasks);
  } catch (error) {
    console.error('Error obteniendo tareas:', error);
    res.status(500).json({ msg: 'Error al obtener tareas' });
  }
});

// Crear una nueva tarea para el usuario logueado
router.post('/', async (req, res) => {
  try {
    console.log('POST /api/tasks body:', req.body, 'usuario:', req.userId);
    const task = new Task({ ...req.body, user: req.userId }); // asociar tarea al usuario
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error('Error guardando tarea:', error);
    res.status(500).json({ msg: 'Error al guardar tarea' });
  }
});

// Actualizar una tarea específica del usuario
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.userId }, // solo actualizar si es del usuario
      req.body,
      { new: true } // devolver la tarea actualizada
    );
    if (!task) return res.status(404).json({ msg: 'Tarea no encontrada' });
    res.json(task);
  } catch (error) {
    console.error('Error actualizando tarea:', error);
    res.status(500).json({ msg: 'Error al actualizar tarea' });
  }
});

// Eliminar una tarea específica del usuario
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!task) return res.status(404).json({ msg: 'Tarea no encontrada' });
    res.json({ msg: 'Tarea eliminada' });
  } catch (error) {
    console.error('Error eliminando tarea:', error);
    res.status(500).json({ msg: 'Error al eliminar tarea' });
  }
});

module.exports = router;
