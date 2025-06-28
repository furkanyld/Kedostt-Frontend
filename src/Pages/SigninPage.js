import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SigninPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Burada basit bir kontrol yapıyoruz: doğru email ve şifre ile giriş başarılı kabul ediyoruz.
    if (email === "test@test.com" && password === "12345") {
      alert("Giriş başarılı!");
      navigate("/"); // Anasayfaya yönlendiriyoruz
    } else {
      alert("Hatalı giriş! Lütfen tekrar deneyin.");
    }
  };

  return (
    <div style={{ textAlign: "center", paddingTop: "50px" }}>
      <h2 className="adopt-donate-heading">Kayıt Ol</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">E-posta: </label>
          <input
            type="email"
            id="email"
            placeholder="E-posta adresiniz"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div style={{ marginTop: "10px" }}>
          <label htmlFor="password">Şifre: </label>
          <input
            type="password"
            id="password"
            placeholder="Şifreniz"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div style={{ marginTop: "20px" }}>
          <button type="submit">Kayıt Ol</button>
        </div>
      </form>
    </div>
  );
}

export default SigninPage;
