import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const AdminRoute = ({ children }) => {
  const { isAdmin, isLoading } = useAuth();
  if (isLoading) return null;
  return isAdmin ? children : <Navigate to="/" />;
};

export default AdminRoute;
