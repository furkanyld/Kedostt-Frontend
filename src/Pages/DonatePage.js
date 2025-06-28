import React from "react";
import AnimalCard from "../Components/AnimalCard";
import hayvan1 from "../Assets/hayvan1.jpg";
import hayvan2 from "../Assets/hayvan2.jpg";

function DonatePage() {
  const animals = [
    {
      name: "Pamuk",
      description: "Veteriner masrafları için destek bekliyor.",
      image: hayvan1,
    },
    {
      name: "Boncuk",
      description: "Yaralı bulundu, tedavi masrafları için bağış yapılabilir.",
      image: hayvan2,
    },
  ];

  return (
    <div className="container mt-5">
      <h1 className="adopt-donate-heading">Bağış Yapılabilecek Hayvanlar</h1>
      <div className="row">
        {animals.map((animal, index) => (
          <div className="col-md-4" key={index}>
            <AnimalCard
              name={animal.name}
              description={animal.description}
              image={animal.image}
              actionLabel="Bağış Yap"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default DonatePage;
