import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import publicAxios from "../Api/PublicAxios";
import { useAuth } from "../Context/AuthContext";
import "../Styles/style.css";

function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await publicAxios.post("/api/auth/login", {
        username: username,
        password: password,
      });

      const token = response.data.token;
      login(token);

      alert("Giriş başarılı!");
      navigate("/");
      window.location.reload();
    } catch (error) {
      alert("Giriş başarısız! Bilgileri kontrol edin.");
      console.error("Login error:", error);
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="login-card p-4 shadow">
        <h2 className="text-center mb-4">Giriş Yap</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Kullanıcı Adı</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Şifre</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="btn btn-primary w-100" type="submit">
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
