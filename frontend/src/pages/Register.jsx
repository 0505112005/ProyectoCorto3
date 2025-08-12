import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../estilos/Login.css"; // reutilizamos estilos del login

function Register() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    direccion: "",
  }); // guardamos los datos del formulario

  const [error, setError] = useState(null); // para mostrar errores
  const navigate = useNavigate(); // para redirigir después del registro

  // actualiza el estado cuando el usuario escribe en inputs
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // enviar datos al backend para registrar usuario
  const handleRegister = async (e) => {
    e.preventDefault();

    // validar que no haya campos vacíos
    if (!form.nombre || !form.email || !form.password || !form.direccion) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    try {
      // petición POST al backend para crear usuario
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.msg || "Error al registrarse"); // mostrar error si falla
        return;
      }

      // si todo salió bien, redirigir a login
      navigate("/login");
    } catch (err) {
      setError("Error al conectar con el servidor.");
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Registrarse</h2>

        {error && <div className="login-error">{error}</div>} {/* mostrar errores */}

        <form onSubmit={handleRegister}>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre completo"
            value={form.nombre}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
          />
          <input
            type="text"
            name="direccion"
            placeholder="Dirección"
            value={form.direccion}
            onChange={handleChange}
          />

          <button type="submit">Registrarse</button>
        </form>

        <p className="login-hint">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
