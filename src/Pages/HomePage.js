import React from "react";
import catDogPhoto from "../Assets/louis-philippe-poitras-sJgucUmcaKE-unsplash.jpg";

function HomePage() {
  return (
    <div className="page-background">
      {/* Resim alanı */}
      <div style={{ 
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        paddingTop: '10vh',
        paddingLeft: '3vw',
        height: '80vh'
      }}>
        <img src={catDogPhoto} 
        alt="Kedostt" 
        className="img-fluid rounded shadow" 
        style={{ 
          maxHeight: '250px', 
          objectFit: 'cover' 
        }} />
      </div>

      <div style={{ 
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        paddingTop: '80vh',
        paddingLeft: '3vw',
        height: '80vh'
      }}>
        <img src={catDogPhoto} 
        alt="Kedostt" 
        className="img-fluid rounded shadow" 
        style={{ 
          maxHeight: '250px', 
          objectFit: 'cover' 
        }} />
      </div>
    </div>
  );
}

export default HomePage;
