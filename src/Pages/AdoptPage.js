import React, { useEffect, useState } from "react";
import axios from "../Api/axios";
import AnimalCard from "../Components/AnimalCard";
import hayvan3 from "../Assets/hayvan3.jpg";
import hayvan4 from "../Assets/hayvan4.jpg";

function AdoptPage() {
  const [animals, setAnimals] = useState([]);
  
  useEffect(() => {
    axios.get("/api/animals")
      .then(response => {
        setAnimals(response.data);
      })
      .catch(error => {
        console.error("Hayvanlar alınamadı: ", error);
      });
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="adopt-donate-heading">Sahiplenilebilecek Hayvanlar</h1>
      <div className="row">
        {animals.map((animal, index) => (
          <div className="col-md-4" key={index}>
            <AnimalCard
              name={animal.name}
              description={animal.description}
              image={animal.imageUrl}
              actionLabel="Sahiplen"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdoptPage;
