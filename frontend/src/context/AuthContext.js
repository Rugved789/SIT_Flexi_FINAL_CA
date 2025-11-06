import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      // Some code paths or previous runs may have written the string "undefined"
      // which causes JSON.parse to throw. Guard against that and any invalid JSON.
      if (storedUser && storedUser !== "undefined") {
        setUser(JSON.parse(storedUser));
      } else {
        // Clean up bad value if present
        localStorage.removeItem("user");
      }
    } catch (err) {
      console.warn("Failed to parse stored user from localStorage:", err);
      localStorage.removeItem("user");
    }
  }, []);

  const loginUser = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const logoutUser = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
