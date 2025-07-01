import React from "react";
import catDogPhoto from "../Assets/louis-philippe-poitras-sJgucUmcaKE-unsplash.jpg";

function HomePage() {
  return (
    <div className="page-background">
      <div className="container pt-5">
        <div className="row align-items-center">
          {/* Sol → Görsel */}
          <div className="col-md-6 text-center">
            <img
              src={catDogPhoto}
              alt="Kedostt"
              className="img-fluid rounded shadow"
              style={{
                maxHeight: "400px",
                objectFit: "cover",
              }}
            />
          </div>

          {/* Sağ → Yazı */}
          <div className="col-md-6">
            <h1 style={{ color: "#647f9f", fontWeight: "700" }}>
              Kedostt 🐾
            </h1>
            <p className="fs-5" style={{ color: "#4a4a4a" }}>
              Kedostt, tamamen kendi imkanlarımla ve sevgimle yürüttüğüm bir Instagram sayfası.
              Sokakta yardıma muhtaç, hasta ya da yuva bekleyen canları görünür kılmak için bu sayfayı açtım.
              Burada onları sahiplendirmek, tedavi masraflarına destek olmak ve onların sesi olmak için uğraşıyorum.
            </p>
            <div className="mt-3"style={{ display: "flex", justifyContent: "center" }}>
              <a
                href="https://www.instagram.com/kedostt"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textDecoration: "none",
                  backgroundColor: "#E1306C",
                  color: "white",
                  padding: "10px 25px",
                  borderRadius: "30px",
                  fontWeight: "600",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                  transition: "all 0.3s ease",
                  textAlign: "center",
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#c2245d";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "#E1306C";
                }}
              >
              📸 Instagram Sayfamız
              </a>
            </div>
          </div>
        </div>

        {/* Alt kısım */}
        <div className="mt-5 text-center">
          <h2 style={{ color: "#647f9f", fontWeight: "700" }}>
            🐶 🐱 Sahiplen | Bağış Yap | Destek Ol
          </h2>
          <p className="fs-5" style={{ color: "#4a4a4a", maxWidth: "900px", margin: "auto" }}>
            Ben tek başıma elimden geleni yapmaya çalışıyorum. Sen de bir cana yuva açabilir veya 
            mama, tedavi ve veteriner destekleri için katkıda bulunabilirsin. 
            Hep birlikte onların hayatına dokunalım!
          </p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
