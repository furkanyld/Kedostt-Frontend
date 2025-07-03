import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // ✅ ekledik

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          username: decoded.sub,
          role: decoded.roles || decoded.role,
        });
      } catch (err) {
        console.error("Token decode hatası:", err);
        localStorage.removeItem("token");
      }
    }
    setIsLoading(false); 
  }, []);

  const login = (token) => {
    const decoded = jwtDecode(token);
    const username = decoded.sub || decoded.username;
    const role = decoded.roles || decoded.role;

    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    localStorage.setItem("role", role);

    setUser({ username, role });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const isAdmin = !!user && user.role === "ROLE_ADMIN";
  const isUser = user?.role === "ROLE_USER";

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, isUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
