import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

function HomePage() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all'); // all, pending, completed
  const { currentUser, updateUserInStorage } = useAuth();

  // Cargar tareas del usuario actual
  useEffect(() => {
    if (currentUser) {
      setTasks(currentUser.tasks || []);
    }
  }, [currentUser]);

  // Eliminar tarea
  const removeTask = (taskId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      
      // Actualizar el estado y el localStorage
      setTasks(updatedTasks);
      const updatedUser = { ...currentUser, tasks: updatedTasks };
      updateUserInStorage(updatedUser);
    }
  };

  // Marcar tarea como completada/pendiente
  const toggleTaskStatus = (taskId) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    
    // Actualizar el estado y el localStorage
    setTasks(updatedTasks);
    const updatedUser = { ...currentUser, tasks: updatedTasks };
    updateUserInStorage(updatedUser);
  };

  // Filtrar tareas según el estado seleccionado
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  // Ordenar tareas por fecha de vencimiento (las más cercanas primero)
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  // Formatear fecha
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "d 'de' MMMM, yyyy", { locale: es });
    } catch (e) {
      return "Fecha no válida";
    }
  };

  // Verificar si una tarea está vencida
  const isOverdue = (dueDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(dueDate) < today && !isToday(dueDate);
  };

  // Verificar si es para hoy
  const isToday = (dueDate) => {
    const today = new Date();
    const taskDate = new Date(dueDate);
    return today.getDate() === taskDate.getDate() && 
           today.getMonth() === taskDate.getMonth() && 
           today.getFullYear() === taskDate.getFullYear();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Link 
          to="/create" 
          className="py-2 px-6 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300"
        >
          Nueva tarea
        </Link>
        
        <div className="flex space-x-2">
          <button 
            className={`px-3 py-1 rounded-md ${filter === 'all' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}
            onClick={() => setFilter('all')}
          >
            Todas
          </button>
          <button 
            className={`px-3 py-1 rounded-md ${filter === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100'}`}
            onClick={() => setFilter('pending')}
          >
            Pendientes
          </button>
          <button 
            className={`px-3 py-1 rounded-md ${filter === 'completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}
            onClick={() => setFilter('completed')}
          >
            Completadas
          </button>
        </div>
      </div>
      
      {tasks.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <p>No hay tareas creadas aún.</p>
          <p>¡Crea tu primera tarea haciendo clic en "Nueva tarea"!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedTasks.map((task) => (
            <div 
              key={task.id} 
              className={`p-4 rounded-lg ${
                task.completed 
                  ? 'bg-green-50 border-l-4 border-green-500' 
                  : isOverdue(task.dueDate)
                    ? 'bg-red-50 border-l-4 border-red-500'
                    : isToday(task.dueDate)
                      ? 'bg-yellow-50 border-l-4 border-yellow-500'
                      : 'bg-white border border-gray-200'
              }`}
            >
              <div className="flex justify-between">
                <div className="flex-1">
                  <h3 className={`text-lg font-semibold ${task.completed ? 'line-through text-gray-500' : ''}`}>
                    {task.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {task.description}
                  </p>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm ${
                      isOverdue(task.dueDate) && !task.completed
                        ? 'text-red-600 font-medium'
                        : isToday(task.dueDate) && !task.completed
                          ? 'text-yellow-600 font-medium'
                          : 'text-gray-500'
                    }`}>
                      {isOverdue(task.dueDate) && !task.completed ? '¡Vencida! ' : ''}
                      {isToday(task.dueDate) && !task.completed ? '¡Hoy! ' : ''}
                      Fecha límite: {formatDate(task.dueDate)}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => toggleTaskStatus(task.id)}
                    className={`px-2 py-1 rounded-md text-xs ${
                      task.completed
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        : 'bg-green-200 text-green-700 hover:bg-green-300'
                    }`}
                  >
                    {task.completed ? 'Reabrir' : 'Completar'}
                  </button>
                  
                  <Link
                    to={`/edit/${task.id}`}
                    className="px-2 py-1 bg-blue-200 text-blue-700 rounded-md text-xs hover:bg-blue-300 text-center"
                  >
                    Editar
                  </Link>
                  
                  <button
                    onClick={() => removeTask(task.id)}
                    className="px-2 py-1 bg-red-200 text-red-700 rounded-md text-xs hover:bg-red-300"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;