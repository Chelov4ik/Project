// context/AuthContext.js
import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    // При загрузке проверяем, есть ли данные в localStorage
    const storedAuth = JSON.parse(localStorage.getItem('authData'));
    if (storedAuth) {
      setAuth(storedAuth);
    }
  }, []);

  const login = (authData) => {
    setAuth(authData);
    // Сохраняем данные авторизации в localStorage
    localStorage.setItem('authData', JSON.stringify(authData));
  };

  const logout = () => {
    setAuth(null);
    // Очищаем localStorage при выходе
    localStorage.removeItem('authData');
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
