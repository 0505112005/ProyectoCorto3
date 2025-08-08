const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Esquema para usuarios
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }, // email obligatorio y único
  password: { type: String, required: true } // contraseña obligatoria
});

// Middleware que se ejecuta antes de guardar un usuario
// Si la contraseña cambió, la encripta con bcrypt para seguridad
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // si no cambió la contraseña, sigue
  this.password = await bcrypt.hash(this.password, 10); // encripta la contraseña
  next();
});

// Exportamos el modelo User para usar en el backend
module.exports = mongoose.model('User', userSchema);
