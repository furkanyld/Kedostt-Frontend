import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "../Api/PrivateAxios"; // ✅ token doğrulama için eklendi

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // ✅ ekledik

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // 1. Token sunucu tarafından geçerli mi kontrol et
          await axios.get("/api/auth/validate"); // ✅ backend'e token kontrolü
          
          // 2. Sunucu geçerli diyorsa decode et ve user'ı ayarla
          const decoded = jwtDecode(token);
          setUser({
            username: decoded.sub,
            role: decoded.roles || decoded.role,
          });
        } catch (err) {
          console.error("Token geçersiz:", err);
          localStorage.removeItem("token");
          localStorage.removeItem("username");
          localStorage.removeItem("role");
          setUser(null);
        }
      }
      setIsLoading(false); 
    };

    validateToken();
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
    localStorage.removeItem("username");
    localStorage.removeItem("role");
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
