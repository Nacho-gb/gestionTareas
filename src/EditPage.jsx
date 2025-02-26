import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from './AuthContext';

function EditPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  
  const { id } = useParams();
  const { currentUser, updateUserInStorage } = useAuth();
  const navigate = useNavigate();

  // Cargar la tarea desde el usuario actual
  useEffect(() => {
    if (currentUser && currentUser.tasks) {
      const task = currentUser.tasks.find(t => t.id === id);
      
      if (task) {
        setTitle(task.title);
        setDescription(task.description || '');
        setDueDate(task.dueDate.split('T')[0]);
        setCompleted(task.completed);
        setLoading(false);
      } else {
        setError('Tarea no encontrada');
        setLoading(false);
      }
    }
  }, [id, currentUser]);

  const updateTask = (e) => {
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
    
    // Actualizar la tarea
    const updatedTasks = currentUser.tasks.map(task => {
      if (task.id === id) {
        return {
          ...task,
          title: title.trim(),
          description: description.trim(),
          dueDate: new Date(dueDate).toISOString(),
          completed: completed
        };
      }
      return task;
    });
    
    // Actualizar en localStorage
    const updatedUser = { ...currentUser, tasks: updatedTasks };
    updateUserInStorage(updatedUser);
    
    // Redirigir a la página principal
    navigate('/');
  };

  const today = new Date().toISOString().split('T')[0];

  if (loading) {
    return <div className="text-center py-10">Cargando...</div>;
  }

  if (error === 'Tarea no encontrada') {
    return (
      <div className="text-center py-10">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 py-2 px-6 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Editar Tarea</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={updateTask}>
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
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Fecha límite *
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="mb-6">
          <label className="flex items-center text-gray-700 font-bold">
            <input
              type="checkbox"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
              className="mr-2 h-5 w-5"
            />
            Marcar como completada
          </label>
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
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditPage;