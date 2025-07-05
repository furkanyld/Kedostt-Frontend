import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import SigninPage from "./Pages/SigninPage";
import DonatePage from "./Pages/DonatePage";
import AdminPanel from "./Pages/AdminPanel";
import ProfilePage from "./Pages/ProfilePage";

import MainNavbar from "./Components/MainNavbar";
import LoadingSpinner from "./Components/LoadingSpinner";
import { useAuth } from "./Context/AuthContext";
import ScrollToTop from "./Components/ScrollToTop";

import "./App.css";
import "./Styles/style.css";

// ✅ Admin Route Koruması
const AdminRoute = ({ children }) => {
  const { isAdmin, isLoading } = useAuth();
  if (isLoading) return <LoadingSpinner />;
  return isAdmin ? children : <Navigate to="/" />;
};


function App() {
  
const { user, isLoading } = useAuth();
if (isLoading) return <LoadingSpinner />;

  return (
      <div className="page-background">
        <MainNavbar />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signin" element={<SigninPage />} />
          <Route path="/donate" element={<DonatePage />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            }
          />
          <Route
            path="/profile"
            element={
              user ? <ProfilePage /> : <Navigate to="/login" />
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
  );
}

export default App;
