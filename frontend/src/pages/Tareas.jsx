import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../estilos/Tareas.css";

const API_URL = "http://localhost:5000/api/tasks";

const Tareas = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Estados para tareas, nuevo título, edición, errores
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [error, setError] = useState(null);

  // Función para obtener headers con token
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    console.log("Token actual:", token);
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    console.log("Headers enviados:", headers);
    return headers;
  };

  // Cerrar sesión y redirigir a login
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Cargar tareas
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        console.log('Iniciando fetch de tareas...');
        const headers = getAuthHeaders();
        const response = await fetch(API_URL, {
          headers: headers
        });
        
        if (!response.ok) {
          console.error('Error response:', response.status, response.statusText);
          throw new Error("Error al cargar tareas");
        }
        
        const data = await response.json();
        console.log("Tareas recibidas del servidor:", data);
        
        // Verificar que las tareas tienen user_id
        data.forEach(task => {
          console.log(`Tarea ${task._id} - Usuario: ${task.user}`);
        });
        
        setTasks(data);
      } catch (error) {
        console.error("Error detallado:", error);
        setError("Error al cargar las tareas");
      }
    };

    fetchTasks();
  }, []);

  // Agregar tarea
  const addTask = async () => {
    if (!newTitle.trim()) {
      setError("El título no puede estar vacío.");
      return;
    }
    const headers = getAuthHeaders();
    if (!headers) {
      setError("No hay token, por favor inicia sesión.");
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers,
        body: JSON.stringify({ title: newTitle }),
      });
      const task = await res.json();

      if (res.status === 401 || res.status === 403) {
        setError("Token inválido o expirado. Por favor inicia sesión de nuevo.");
        localStorage.removeItem("token");
        return;
      }

      if (!res.ok) {
        setError(task.msg || "Error al agregar tarea.");
        return;
      }

      if (task._id) {
        setTasks((prev) => [...prev, task]);
        setNewTitle("");
        setError(null);
      }
    } catch (error) {
      setError("Error al agregar tarea.");
      console.error("Error al agregar tarea:", error);
    }
  };

  // Guardar edición de tarea
  const saveEdit = async (id) => {
    if (!editTitle.trim()) {
      setError("El título no puede estar vacío.");
      return;
    }

    const headers = getAuthHeaders();
    if (!headers) {
      setError("No hay token, por favor inicia sesión.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ title: editTitle }),
      });
      const updated = await res.json();

      if (res.status === 401 || res.status === 403) {
        setError("Token inválido o expirado. Por favor inicia sesión de nuevo.");
        localStorage.removeItem("token");
        return;
      }

      if (!res.ok) {
        setError(updated.msg || "Error al editar tarea.");
        return;
      }

      if (updated._id) {
        setTasks((prev) =>
          prev.map((t) => (t._id === updated._id ? updated : t))
        );
        setEditId(null);
        setEditTitle("");
        setError(null);
      }
    } catch (error) {
      setError("Error al editar tarea.");
      console.error("Error al editar tarea:", error);
    }
  };

  // Eliminar tarea
  const deleteTask = async (id) => {
    const headers = getAuthHeaders();
    if (!headers) {
      setError("No hay token, por favor inicia sesión.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers,
      });

      if (res.status === 401 || res.status === 403) {
        setError("Token inválido o expirado. Por favor inicia sesión de nuevo.");
        localStorage.removeItem("token");
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        setError(data.msg || "Error al eliminar tarea.");
        return;
      }

      setTasks((prev) => prev.filter((t) => t._id !== id));
      setError(null);
    } catch (error) {
      setError("Error al eliminar tarea.");
      console.error("Error al eliminar tarea:", error);
    }
  };

  // Cambiar completado (modificado para enviar también el título)
  const toggleCompleted = async (task) => {
    const headers = getAuthHeaders();
    if (!headers) {
      setError("No hay token, por favor inicia sesión.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/${task._id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ title: task.title, completed: !task.completed }),
      });
      const updated = await res.json();

      if (res.status === 401 || res.status === 403) {
        setError("Token inválido o expirado. Por favor inicia sesión de nuevo.");
        localStorage.removeItem("token");
        return;
      }

      if (!res.ok) {
        setError(updated.msg || "Error al actualizar estado.");
        return;
      }

      if (updated._id) {
        setTasks((prev) =>
          prev.map((t) => (t._id === updated._id ? updated : t))
        );
        setError(null);
      }
    } catch (error) {
      setError("Error al actualizar completada.");
      console.error("Error al actualizar completada:", error);
    }
  };

  return (
    <div className="tareas-container">
      <button className="btn-logout" onClick={handleLogout}>
        Cerrar Sesión
      </button>
      <h1 className="tareas-title">Gestión de Tareas</h1>

      {error && <div className="tareas-error">{error}</div>}

      <div className="tareas-newtask">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Nueva tarea..."
          onKeyDown={(e) => {
            if (e.key === "Enter") addTask();
          }}
        />
        <button onClick={addTask}>Agregar</button>
      </div>

      <ul className="tareas-list">
        {tasks.length === 0 && <p className="tareas-empty">No hay tareas aún.</p>}

        {tasks.map((task) => (
          <li
            key={task._id}
            className={`tarea-item ${task.completed ? "completed" : ""}`}
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleCompleted(task)}
              className="tarea-checkbox"
            />

            {editId === task._id ? (
              <>
                <input
                  type="text"
                  className="tarea-editinput"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEdit(task._id);
                    if (e.key === "Escape") setEditId(null);
                  }}
                  autoFocus
                />
                <button
                  className="btn btn-save"
                  onClick={() => saveEdit(task._id)}
                >
                  Guardar
                </button>
                <button
                  className="btn btn-cancel"
                  onClick={() => setEditId(null)}
                >
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <span className="tarea-title">{task.title}</span>
                <button
                  className="btn btn-edit"
                  onClick={() => {
                    setEditId(task._id);
                    setEditTitle(task.title);
                    setError(null);
                  }}
                >
                  Editar
                </button>
                <button
                  className="btn btn-delete"
                  onClick={() => deleteTask(task._id)}
                >
                  Eliminar
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tareas;
