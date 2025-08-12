const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ajusta ruta si es necesario

// Registro de usuario
router.post('/register', async (req, res) => {
  console.log("Datos recibidos en /register:", req.body);
  try {
    const { nombre, email, password, direccion } = req.body;

    if (!nombre || !email || !password || !direccion) {
      return res.status(400).json({ msg: 'Todos los campos son obligatorios' });
    }

    const emailNormalized = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: emailNormalized });
    if (existingUser) {
      return res.status(400).json({ msg: 'El usuario ya existe' });
    }

    const newUser = new User({
      nombre,
      email: emailNormalized,
      password,
      direccion
    });

    try {
      const savedUser = await newUser.save();
      console.log("Usuario guardado en BD:", savedUser);
    } catch (saveError) {
      console.error("Error guardando usuario en BD:", saveError);
      return res.status(500).json({ msg: "Error guardando usuario" });
    }

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({ token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
});

// Login usuario
router.post('/login', async (req, res) => {
  console.log('Login request body:', req.body);
  try {
    const { email, password } = req.body;

    const emailNormalized = email.trim().toLowerCase();

    const user = await User.findOne({ email: emailNormalized });
    console.log('Usuario encontrado:', user);

    if (!user) {
      return res.status(401).json({ msg: 'Credenciales inválidas' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    console.log('Password válido:', isValid);

    if (!isValid) {
      return res.status(401).json({ msg: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const usuario = {
      id: user._id,
      nombre: user.nombre,
      email: user.email,
      direccion: user.direccion,
    };

    res.json({ token, usuario });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
});

module.exports = router;
