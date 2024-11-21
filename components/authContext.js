import React, { createContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("guest");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedRole = await SecureStore.getItemAsync("userRole");
        if (storedRole) {
          setRole(storedRole);
          setUser({ role: storedRole });
        }
      } catch (error) {
        console.error("Error al cargar los datos del usuario:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, setRole, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
