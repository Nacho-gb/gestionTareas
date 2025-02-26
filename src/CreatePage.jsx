import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { v4 as uuidv4 } from 'uuid';

function CreatePage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');
  
  const { currentUser, updateUserInStorage } = useAuth();
  const navigate = useNavigate();

  const addTask = (e) => {
    e.preventDefault();
    setError('');
    
    // Validaciones
    if (!title.trim()) {
      setError('Por favor ingresa un título para la tarea');
      return;
    }
    
    if (!dueDate) {
      setError('Por favor selecciona una fecha límite');
      return;
    }
    
    // Crear nueva tarea
    const newTask = {
      id: uuidv4(), // Generar ID único
      title: title.trim(),
      description: description.trim(),
      dueDate: new Date(dueDate).toISOString(),
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    // Agregar tarea a la lista del usuario actual
    const updatedTasks = [...(currentUser.tasks || []), newTask];
    const updatedUser = { ...currentUser, tasks: updatedTasks };
    
    // Actualizar en localStorage
    updateUserInStorage(updatedUser);
    
    // Redirigir a la página principal
    navigate('/');
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Nueva Tarea</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={addTask}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Título *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="¿Qué necesitas hacer?"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Descripción
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Añade detalles sobre la tarea (opcional)"
            rows="4"
          ></textarea>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Fecha límite *
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            min={today}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="py-2 px-6 bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-600 transition duration-300"
          >
            Cancelar
          </button>
          
          <button
            type="submit"
            className="py-2 px-6 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300"
          >
            Guardar Tarea
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreatePage;