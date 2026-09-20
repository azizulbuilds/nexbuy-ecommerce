import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({
  children,
}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] =
    useState(true);

  // ==========================================
  // Check Authentication
  // ==========================================
  const checkAuth = async () => {
    try {
      const response = await api.get(
        "/auth/profile"
      );

      setUser(response.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Initial Authentication Check
  // ==========================================
  useEffect(() => {
    checkAuth();
  }, []);

  // ==========================================
  // Login
  // ==========================================
  const login = async (
    email,
    password
  ) => {
    const response = await api.post(
      "/auth/login",
      {
        email,
        password,
      }
    );

    setUser(response.data.user);

    return response.data;
  };

  // ==========================================
  // Logout
  // ==========================================
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      setUser(null);
    }
  };

  // ==========================================
  // Refresh User
  // ==========================================
  const refreshUser = async () => {
    try {
      const response = await api.get(
        "/auth/profile"
      );

      setUser(response.data.user);

      return response.data.user;
    } catch (error) {
      setUser(null);
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};