import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { v4 as uuidv4 } from 'uuid';

// Inicializar la aplicación con algunos datos de ejemplo si no existen
function initializeAppData() {
  const users = localStorage.getItem('users');
  if (!users) {
    const exampleUsers = [
      {
        username: 'demo',
        password: 'demo123',
        tasks: [
          {
            id: uuidv4(),
            title: 'Completar proyecto React',
            description: 'Finalizar la implementación de la aplicación de tareas con autenticación y funcionalidades avanzadas.',
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            completed: false,
            createdAt: new Date().toISOString()
          },
          {
            id: uuidv4(),
            title: 'Reunión de equipo',
            description: 'Discutir próximos proyectos y asignar tareas.',
            dueDate: new Date().toISOString(), // Hoy
            completed: false,
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]
      }
    ];
    
    localStorage.setItem('users', JSON.stringify(exampleUsers));
  }
}

// Inicializar datos de ejemplo
initializeAppData();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);