import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../Api/PublicAxios";
import "../Styles/style.css";

function SigninPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/auth/register", {
        username,
        email,
        password,
      });

      alert("Kayıt başarılı! Giriş yapabilirsiniz.");
      navigate("/login");
    } catch (error) {
      console.error("Kayıt başarısız:", error);
      alert("Kayıt başarısız! Lütfen bilgileri kontrol edin.");
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="login-card p-4 shadow">
        <h2 className="text-center mb-4">Kayıt Ol</h2>
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label className="form-label">Kullanıcı Adı:</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">E-posta:</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Şifre:</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="btn btn-success w-100" type="submit">
            Kayıt Ol
          </button>
        </form>
      </div>
    </div>
  );
}

export default SigninPage;
