const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Task = require('../models/Task'); // Importar el modelo Task
const authMiddleware = require('../middleware/authMiddleware');

// Proteger todas las rutas con el middleware de autenticación
router.use(authMiddleware);

// Crear nueva tarea
router.post('/', async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    
    const task = new Task({
      title: req.body.title,
      user: userId,
      completed: false
    });

    const savedTask = await task.save();
    res.json(savedTask);
  } catch (error) {
    console.error('Error al crear tarea:', error);
    res.status(500).json({ 
      msg: 'Error al crear tarea', 
      error: error.message 
    });
  }
});

// Obtener tareas solo del usuario autenticado
router.get('/', async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const tasks = await Task.find({ user: userId });
    res.json(tasks);
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    res.status(500).json({ msg: 'Error al obtener tareas' });
  }
});

// Actualizar tarea (título y completado) solo si es del usuario
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ msg: 'Tarea no encontrada' });

    if (task.user.toString() !== req.userId) {
      return res.status(403).json({ msg: 'No autorizado para modificar esta tarea' });
    }

    if (title !== undefined) task.title = title;
    if (completed !== undefined) task.completed = completed;

    await task.save();
    res.json(task);
  } catch (error) {
    console.error('Error al actualizar tarea:', error);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
});

// Eliminar tarea solo si es del usuario
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ msg: 'Tarea no encontrada' });

    if (task.user.toString() !== req.userId) {
      return res.status(403).json({ msg: 'No autorizado para eliminar esta tarea' });
    }

    await task.deleteOne();
    res.json({ msg: 'Tarea eliminada' });
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
});

module.exports = router;
