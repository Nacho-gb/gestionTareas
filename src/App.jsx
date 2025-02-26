import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import HomePage from './HomePage';
import CreatePage from './CreatePage';
import EditPage from './EditPage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import { useAuth } from './AuthContext';

// Componente de protección de rutas
function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
}

// Envoltorio para rutas autenticadas
function AuthenticatedRoutes({ children }) {
  const { currentUser, logout } = useAuth();
  
  return (
    <div className="max-w-2xl mx-auto p-6 mt-10 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Lista de Tareas</h1>
        {currentUser && (
          <div className="flex items-center">
            <span className="text-gray-600 mr-4">Hola, {currentUser.username}</span>
            <button 
              onClick={logout}
              className="py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

// Componente principal
function AppContent() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={
            <PrivateRoute>
              <AuthenticatedRoutes>
                <HomePage />
              </AuthenticatedRoutes>
            </PrivateRoute>
          } />
          <Route path="/create" element={
            <PrivateRoute>
              <AuthenticatedRoutes>
                <CreatePage />
              </AuthenticatedRoutes>
            </PrivateRoute>
          } />
          <Route path="/edit/:id" element={
            <PrivateRoute>
              <AuthenticatedRoutes>
                <EditPage />
              </AuthenticatedRoutes>
            </PrivateRoute>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default AppContent;