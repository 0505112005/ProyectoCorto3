const mongoose = require('mongoose');

// Esquema para las tareas
const taskSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  completed: { 
    type: Boolean, 
    default: false 
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  }
});

// Exportar modelo Task
module.exports = mongoose.model('Task', taskSchema);
