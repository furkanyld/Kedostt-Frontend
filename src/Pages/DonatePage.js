import React, { useEffect, useState } from "react";
import axios from "../Api/PublicAxios";
import AnimalCard from "../Components/AnimalCard";

function DonatePage() {
  const [animals, setAnimals] = useState([]);

  useEffect(() => {
    axios.get("/api/animals")
      .then(res => {
        const visibleAnimals = res.data.filter(animal => animal.visible);
        setAnimals(visibleAnimals);
      })
      .catch(err => console.error("Hayvanlar alınamadı", err));
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="adopt-donate-heading">🐾 Patili Dostlarımız</h1>
      <div className="row">
        {animals.length === 0 ? (
          <div className="col-12">
            <p className="text-center">Şu anda bağışa açık hayvan bulunmamaktadır.</p>
          </div>
        ) : (
          animals.map((animal) => (
            <div className="col-md-4" key={animal.id}>
              <AnimalCard
                id={animal.id}
                name={animal.name}
                description={animal.description}
                image={animal.imageUrl}
                species={animal.species}
                breed={animal.breed}
                gender={animal.gender}
                ageYears={animal.ageYears}
                ageMonths={animal.ageMonths}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DonatePage;
