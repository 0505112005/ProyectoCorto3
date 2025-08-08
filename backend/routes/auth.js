const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Registro de usuario
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Verificamos si ya existe un usuario con ese email
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'Usuario ya existe' });

    // Creamos un nuevo usuario y lo guardamos
    const user = new User({ email, password });
    await user.save();
    res.status(201).json({ msg: 'Usuario registrado' });
  } catch (err) {
    res.status(500).json({ msg: 'Error del servidor' });
  }
});

// Login de usuario
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Buscamos el usuario por email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Credenciales inválidas' });

    // Comparamos la contraseña enviada con la que está guardada (hasheada)
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: 'Credenciales inválidas' });

    // Generamos un token JWT con el id del usuario
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ token }); // enviamos el token al cliente
  } catch (err) {
    res.status(500).json({ msg: 'Error del servidor' });
  }
});

module.exports = router;
