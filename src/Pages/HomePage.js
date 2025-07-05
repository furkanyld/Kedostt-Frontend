import React from "react";
import catDogPhoto from "../Assets/louis-philippe-poitras-sJgucUmcaKE-unsplash.jpg";

function HomePage() {
  return (
    <div className="page-background">
      <div className="container py-5">
        {/* Ana grid: resim + açıklama */}
        <div className="row g-4 align-items-center flex-column-reverse flex-md-row">
          {/* Sağ: Yazı */}
          <div className="col-md-6 text-center text-md-start">
            <h1 style={{ color: "#647f9f", fontWeight: "700", fontSize: "2rem" }}>
              Kedostt 🐾
            </h1>
            <p style={{ color: "#4a4a4a", fontSize: "1rem", lineHeight: 1.6 }}>
              Kedostt, tamamen kendi imkanlarımla ve sevgimle yürüttüğüm bir Instagram sayfası.
              Sokakta yardıma muhtaç, hasta ya da yuva bekleyen canları görünür kılmak için bu sayfayı açtım.
              Burada onları sahiplendirmek, tedavi masraflarına destek olmak ve onların sesini duyurmak için uğraşıyorum.
            </p>
            <div className="mt-3">
              <a
                href="https://www.instagram.com/kedostt"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-danger px-4 py-2"
                style={{ borderRadius: "20px", fontWeight: "600", fontSize: "0.95rem" }}
              >
                📸 Instagram Sayfamız
              </a>
            </div>
          </div>

          {/* Sol: Görsel */}
          <div className="col-md-6 text-center">
            <img
              src={catDogPhoto}
              alt="Kedostt"
              className="img-fluid rounded shadow-sm"
              style={{ maxHeight: "380px", objectFit: "cover" }}
            />
          </div>
        </div>

        {/* Alt kısım */}
        <div className="mt-5 text-center">
          <h2 style={{ color: "#647f9f", fontWeight: "600", fontSize: "1.4rem" }}>
            🐶 🐱 Sahiplen | Bağış Yap | Destek Ol
          </h2>
          <p
            style={{
              color: "#4a4a4a",
              fontSize: "0.95rem",
              maxWidth: "750px",
              margin: "12px auto 0",
              lineHeight: 1.5,
            }}
          >
            Sen de bir cana yuva olabilir ya da mama ve tedavi masraflarına katkıda bulunabilirsin. 
            Hep birlikte onların hayatına dokunabiliriz!
          </p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
