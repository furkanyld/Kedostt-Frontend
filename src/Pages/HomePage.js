import React, { useEffect, useState } from "react";
import axios from "../Api/PublicAxios";

function HomePage() {
  const [randomAnimal, setRandomAnimal] = useState(null);

  useEffect(() => {
    axios.get("/api/animals")
      .then((res) => {
        const visibleAnimals = res.data.filter((a) => a.visible);
        const random = visibleAnimals[Math.floor(Math.random() * visibleAnimals.length)];
        setRandomAnimal(random);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="page-background">
      <div className="container py-5">
        <div className="row g-4 flex-column-reverse flex-md-row justify-content-between">
          {/* Sol içerik */}
          <div className="col-md-7 d-flex flex-column align-items-center text-center">
            <div style={{ maxWidth: "900px" }}>
              <h1 style={{ color: "#647f9f", fontWeight: "700", fontSize: "2rem" }}>
                Kedostt 🐾
              </h1>
              <p style={{ color: "#4a4a4a", fontSize: "1rem", lineHeight: 1.6 }}>
                Kedostt, tamamen kendi imkanlarımla ve sevgimle yürüttüğüm bir Instagram sayfası.
                Sokakta yardıma muhtaç, hasta ya da yuva bekleyen canları görünür kılmak için bu sayfayı açtım.
                Burada onları sahiplendirmek, tedavi masraflarına destek olmak ve onların sesini duyurmak için uğraşıyorum.
              </p>
              <a
                href="https://www.instagram.com/kedostt"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-danger mt-3 px-4 py-2"
                style={{ borderRadius: "20px", fontWeight: "600", fontSize: "0.95rem" }}
              >
                📸 Instagram Sayfamız
              </a>

              {/* Alt metin */}
              <div className="mt-5">
                <h2 style={{ color: "#647f9f", fontWeight: "600", fontSize: "1.4rem" }}>
                  🐶 🐱 Sahiplen | Bağış Yap | Destek Ol
                </h2>
                <p
                  style={{
                    color: "#4a4a4a",
                    fontSize: "0.95rem",
                    lineHeight: 1.5,
                    marginTop: "12px",
                  }}
                >
                  Sen de bir cana yuva olabilir ya da mama ve tedavi masraflarına katkıda bulunabilirsin.
                  Hep birlikte onların hayatına dokunabiliriz!
                </p>
              </div>
            </div>
          </div>

          {/* Sağ bar */}
          <div className="col-md-4 offset-md-1 d-flex flex-column gap-3">
            <div className="card shadow-sm p-3 soft-card">
              <h5 className="card-title">❤️ Sahiplen, Bir Hayat Kurtar</h5>
              {randomAnimal && (
                <img
                  src={randomAnimal.imageUrl}
                  alt={randomAnimal.name}
                  className="img-fluid rounded my-2"
                  style={{ maxHeight: "250px", objectFit: "cover", width: "100%" }}
                />
              )}
            </div>

            {/* Alt Kart: Bilgilendirme */}
            <div className="card custom-home-card shadow-sm p-3 soft-card">
              <h5 className="card-title">📌 Sahiplendirme Kuralları</h5>
              <ul style={{ fontSize: "0.9rem", color: "#555", lineHeight: 1.6, paddingLeft: "1rem" }}>
                <li>Sahipleneceğiniz hayvanın tüm sorumluluğu size aittir.</li>
                <li>Lütfen geçici heveslerle değil, ömürlük sahiplenin.</li>
                <li>Gerekli durumlarda takip süreci yapılabilir.</li>
                <li>Sahiplendirme sonrası iletişimde kalınması önemlidir.</li>
                <li>Kısır değilse kısırlaştırılması gerekir.</li>
                <li>Evinizin camlarına kedi filesi takılmalıdır.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
