import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if admin is already logged in
    const authStatus = sessionStorage.getItem('admin-authenticated');
    setIsAuthenticated(authStatus === 'true');
  }, []);

  const login = () => {
    sessionStorage.setItem('admin-authenticated', 'true');
    setIsAuthenticated(true);
  };

  const logout = () => {
    sessionStorage.removeItem('admin-authenticated');
    setIsAuthenticated(false);
  };

  return { isAuthenticated, login, logout };
};