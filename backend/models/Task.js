const mongoose = require('mongoose');

// Definimos el esquema de las tareas 
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true }, // título de la tarea, obligatorio
  completed: { type: Boolean, default: false }, // si está completada o no, por defecto false
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // referencia al usuario que creó la tarea
});

// Exportamos el modelo para usarlo en otras partes del proyecto
module.exports = mongoose.model('Task', taskSchema);
