import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Por favor, ingresa correo y contraseña");
      return;
    }

    try {
      const emailNormalized = email.trim().toLowerCase();
      console.log('Email enviado para login:', `"${emailNormalized}"`);
      const success = await login({ email: emailNormalized, password });
      if (success) {
        console.log('Login exitoso, redirigiendo...');
        navigate("/tareas");
      }
    } catch (err) {
      console.error('Error en handleLogin:', err);
      setError(err.message || "Error al iniciar sesión");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Iniciar Sesión</h2>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Ingresar</button>
        </form>

        <p className="login-hint">
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
