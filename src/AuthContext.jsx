import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Cargar el usuario actual al iniciar
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const user = users.find(u => u.username === savedUser);
      if (user) {
        setCurrentUser(user);
      }
    }
    setLoading(false);
  }, []);

  const register = (username, password) => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Verificar si el usuario ya existe
    if (users.some(user => user.username === username)) {
      return { success: false, message: 'El nombre de usuario ya existe' };
    }
    
    const newUser = {
      username,
      password,
      tasks: []
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', username);
    setCurrentUser(newUser);
    
    return { success: true };
  };

  const login = (username, password) => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(
      u => u.username === username && u.password === password
    );
    
    if (user) {
      localStorage.setItem('currentUser', username);
      setCurrentUser(user);
      return { success: true };
    }
    
    return { success: false, message: 'Nombre de usuario o contraseña incorrectos' };
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    navigate('/login');
  };

  // Actualizar el usuario en localStorage
  const updateUserInStorage = (updatedUser) => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const index = users.findIndex(u => u.username === updatedUser.username);
    
    if (index !== -1) {
      users[index] = updatedUser;
      localStorage.setItem('users', JSON.stringify(users));
      setCurrentUser(updatedUser);
    }
  };

  const value = {
    currentUser,
    register,
    login,
    logout,
    updateUserInStorage
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}