import React, { useEffect, useState } from "react";
import axios from "../Api/PrivateAxios";
import { Table, Button, Modal, Badge, Card, Form } from "react-bootstrap";

function AdminPanel() {
  const [adoptions, setAdoptions] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [showAnimalModal, setShowAnimalModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    species: "",
    breed: "",
    ageYears: 0,
    ageMonths: 0,
    gender: "",
    description: "",
    imageUrl: "",
    visible: true,
  });

  const [editData, setEditData] = useState({
    id: null,
    name: "",
    species: "",
    breed: "",
    ageYears: 0,
    ageMonths: 0,
    gender: "",
    description: "",
    imageUrl: "",
    visible: true,
  });

  const fetchAdoptions = async () => {
    try {
      const res = await axios.get("/api/adoption");
      setAdoptions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAnimals = async () => {
    try {
      const res = await axios.get("/api/animals");
      setAnimals(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAdoptions();
    fetchAnimals();
  }, []);

  const handleAddAnimal = async () => {
    try {
      await axios.post("/api/animals", formData);
      fetchAnimals();
      setShowAnimalModal(false);
      setFormData({
        name: "",
        species: "",
        breed: "",
        ageYears: 0,
        ageMonths: 0,
        gender: "",
        description: "",
        imageUrl: "",
        visible: true,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteAnimal = async (id) => {
    try {
      await axios.delete(`/api/animals/${id}`);
      fetchAnimals();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateAnimal = async () => {
    try {
      await axios.put(`/api/animals/${editData.id}`, editData);
      fetchAnimals();
      setShowEditModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteAdoption = async (id) => {
    try {
      await axios.delete(`/api/adoption/${id}`);
      fetchAdoptions();
    } catch (error) {
      console.error(error);
    }
  };

  const handleApproveAdoption = async (id) => {
    try {
      await axios.post(`/api/adoption/adoptions/${id}/accept`);
      fetchAnimals();
      fetchAdoptions();
    } catch (error) {
      console.error(error);
    }
  };

  const handleRejectAdoption = async (id) => {
    try {
      await axios.post(`/api/adoption/adoptions/${id}/reject`);
      fetchAdoptions();
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleVisibility = async (id) => {
    try {
      await axios.put(`/api/animals/${id}/toggle-visibility`);
      fetchAnimals();
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageToBase64 = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setFormData({ ...formData, imageUrl: reader.result });
    };
  };

  const handleEditImageToBase64 = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setEditData({ ...editData, imageUrl: reader.result });
    };
  };

  return (
    <div className="container mt-5">
      <h2>Admin Paneli</h2>

      {/* Sahiplenme Başvuruları */}
      <Card className="mb-4 p-3 shadow-sm">
        <Card.Title>Sahiplenme Başvuruları</Card.Title>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Ad Soyad</th>
              <th>Yaş</th>
              <th>Meslek</th>
              <th>Telefon</th>
              <th>Email</th>
              <th>Not</th>
              <th>Hayvan ID</th>
              <th>Durum</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {adoptions.map((a) => (
              <tr key={a.id}>
                <td>{a.fullName}</td>
                <td>{a.age}</td>
                <td>{a.occupation}</td>
                <td>{a.phoneNumber}</td>
                <td>{a.email}</td>
                <td>{a.note}</td>
                <td>{a.animalId}</td>
                <td>
                  <Badge
                    bg={
                      a.status === "ACCEPTED"
                        ? "success"
                        : a.status === "REJECTED"
                        ? "danger"
                        : "warning"
                    }
                    text="light"
                  >
                    {a.status === "ACCEPTED"
                      ? "Kabul Edildi"
                      : a.status === "REJECTED"
                      ? "Reddedildi"
                      : "Beklemede"}
                  </Badge>
                </td>
                <td>
                  <div className="action-buttons d-flex gap-2">
                    {a.status === "PENDING" && (
                      <>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleApproveAdoption(a.id)}
                        >
                          Onayla
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleRejectAdoption(a.id)}
                        >
                          Reddet
                        </Button>
                      </>
                    )}
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleDeleteAdoption(a.id)}
                    >
                      Sil
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      {/* Hayvanlar */}
      <Card className="p-3 shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Card.Title>Hayvanlar</Card.Title>
          <div className="action-buttons">
            <Button
              variant="success"
              className="add-animal-btn"
              onClick={() => setShowAnimalModal(true)}
            >
              Yeni Hayvan Ekle
            </Button>
          </div>
        </div>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Ad</th>
              <th>Tür</th>
              <th>Cins</th>
              <th>Yaş</th>
              <th>Cinsiyet</th>
              <th>Açıklama</th>
              <th>Resim</th>
              <th>Sahiplik Durumu</th>
              <th>Yayın Durumu</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {animals.map((a) => (
              <tr key={a.id}>
                <td>{a.name}</td>
                <td>{a.species}</td>
                <td>{a.breed}</td>
                <td>
                  {a.ageYears} yıl {a.ageMonths} ay
                </td>
                <td>{a.gender}</td>
                <td>{a.description}</td>
                <td>
                  {a.imageUrl && (
                    <img
                      src={a.imageUrl}
                      alt={a.name}
                      style={{ width: "80px", borderRadius: "8px" }}
                    />
                  )}
                </td>
                <td>
                  {a.adopted ? (
                    <Badge bg="success">Sahiplenildi</Badge>
                  ) : (
                    <Badge bg="secondary">Bekliyor</Badge>
                  )}
                </td>
                <td>
                  {a.visible ? (
                    <Badge bg="success">Yayında</Badge>
                  ) : (
                    <Badge bg="secondary">Yayında Değil</Badge>
                  )}
                </td>
                <td>
                  <div className="action-buttons d-flex gap-2">
                    <Button
                      variant="warning"
                      size="sm"
                      style={{ color: "white" }}
                      onClick={() => {
                        setEditData(a);
                        setShowEditModal(true);
                      }}
                    >
                      Güncelle
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteAnimal(a.id)}
                    >
                      Sil
                    </Button>
                    <Button
                      variant={a.visible ? "secondary" : "success"}
                      size="sm"
                      onClick={() => handleToggleVisibility(a.id)}
                    >
                      {a.visible ? "Yayından Kaldır" : "Yayına Al"}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}

export default AdminPanel;
