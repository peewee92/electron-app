// src/renderer/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { generateToken, checkTokenStatus } from '@renderer/api/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 初始化检查登录状态
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // 通请求登录状态
        const authStatus = await checkTokenStatus();
        setIsAuthenticated(authStatus.isLoggedIn);
        setUser(authStatus.user);
      } catch (error) {
        console.error('Failed to check auth status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // 扫码登录逻辑
  const login = async (qrCodeData) => {
    try {
      const result = await generateToken(qrCodeData);
      
      if (result.success) {
        setIsAuthenticated(true);
        setUser(result.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  // 登出逻辑
  const logout = async () => {
    try {
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const value = {
    isAuthenticated,
    user,
    isLoading,
    login,
    logout
  };

  return (
    <AuthContext.Provider>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);