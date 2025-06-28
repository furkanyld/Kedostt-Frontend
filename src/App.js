import React from "react";
import { Route, Routes, Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import HomePage from "./Pages/HomePage"; 
import LoginPage from "./Pages/LoginPage"; 
import SigninPage from "./Pages/SigninPage";
import DonatePage from "./Pages/DonatePage";
import AdoptPage from "./Pages/AdoptPage";
import MainNavbar from "./Components/MainNavbar";
import './App.css';
import './Styles/style.css';

function App() {
  return (
    <>
      <div className="page-background">
      <MainNavbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signin" element={<SigninPage />} />
          <Route path="/donate" element={<DonatePage />} />
          <Route path="/adopt" element={<AdoptPage />} />
        </Routes>
      </div>
    </>  
  );
}

export default App;
