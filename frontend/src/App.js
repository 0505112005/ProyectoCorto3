import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Tareas from "./pages/Tareas";
import { AuthProvider, useAuth } from "./context/AuthContext";

function AppRoutes() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={<Navigate to="/login" replace />} 
      />
      
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/tareas" replace /> : <Login />} 
      />
      
      <Route 
        path="/register" 
        element={<Register />} 
      />
      
      <Route 
        path="/tareas" 
        element={isAuthenticated ? <Tareas /> : <Navigate to="/login" replace />} 
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
