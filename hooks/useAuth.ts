import { useState } from 'react';
import { authAPI, LoginRequest } from '@/lib/api';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  const login = async (credentials: LoginRequest) => {
    try {
      setLoading(true);
      setError(null);
      setIsExpired(false); // Reset on login

      const response = await authAPI.login(credentials);

      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response));
      }

      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setIsExpired(false); // Reset on logout
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const isTokenExpired = () => {
    const token = localStorage.getItem('token');
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000; // Convert to milliseconds
      return Date.now() > exp;
    } catch {
      return true;
    }
  };

  const handleExpiration = () => {
    if (isTokenExpired()) {
      setIsExpired(true);
    }
  };

  return {
    login,
    logout,
    isTokenExpired,
    handleExpiration,
    isExpired,
    loading,
    error,
  };
};
