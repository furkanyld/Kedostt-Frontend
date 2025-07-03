import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import LoadingSpinner from "../Components/LoadingSpinner";

const AdminRoute = ({ children }) => {
  const { isAdmin, isLoading } = useAuth();
  if (isLoading) return <LoadingSpinner />;
  return isAdmin ? children : <Navigate to="/" />;
};

export default AdminRoute;
