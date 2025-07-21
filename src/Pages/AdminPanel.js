import React, { useEffect, useState } from "react";
import axios from "../Api/PrivateAxios";
import { Table, Button, Modal, Badge, Card, Form } from "react-bootstrap";

function AdminPanel() {
  const [adoptions, setAdoptions] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [showAnimalModal, setShowAnimalModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [deleteVideo, setDeleteVideo] = useState(false);


  const [formData, setFormData] = useState({
    name: "",
    species: "",
    breed: "",
    ageYears: 0,
    ageMonths: 0,
    gender: "",
    description: "",
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
    visible: true,
  });

  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [editImages, setEditImages] = useState([]);
  const [editVideo, setEditVideo] = useState(null);

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
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => data.append(key, value));
      for (let i = 0; i < images.length; i++) {
        data.append("images", images[i]);
      }
      if (video) {
        data.append("video", video);
      }

      await axios.post("/api/animals/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

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
        visible: true,
      });
      setImages([]);
      setVideo(null);
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
      const data = new FormData();
      Object.entries(editData).forEach(([key, value]) => {
        if (key !== "id") data.append(key, value);
      });

      // ✅ Yeni satır: mevcut görselleri ekle
      existingImages.forEach(url => {
        data.append("existingImageUrls", url);
      });

      // yeni resimler
      for (let i = 0; i < editImages.length; i++) {
        data.append("images", editImages[i]);
      }

      // yeni video
      if (editVideo) {
        data.append("video", editVideo);
      }

      // silinecekler 
      imagesToDelete.forEach(url => {
        data.append("deleteImages", url);
      });

      // video silinecekse backend'e bildir
      if (deleteVideo) {
        data.append("deleteVideo", "true");
      }

      await axios.put(`/api/animals/upload/${editData.id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      fetchAnimals();
      setShowEditModal(false);
    } catch (error) {
      console.error(error);
    }

    setDeleteVideo(false);
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

  const cleanPath = (url) => {
    if (!url) return "";
    return `${process.env.REACT_APP_BACKEND_URL}${url.startsWith("/") ? "" : "/"}${url}`;
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
              <th>Resim / Video</th>
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
                <td>{a.ageYears} yıl {a.ageMonths} ay</td>
                <td>{a.gender}</td>
                <td>{a.description}</td>
                <td>
                  {a.imageUrls?.length > 0 && (
                    <img
                      src={cleanPath(a.imageUrls[0])}
                      alt={a.name}
                      style={{ width: "80px", height: "80px", borderRadius: "8px", objectFit: "cover" }}
                    />
                  )}
                  {a.videoUrl && (
                    <video
                      controls
                      style={{ width: "80px", height: "80px", borderRadius: "8px", display: "block", marginTop: "8px" }}
                    >
                      <source src={cleanPath(a.videoUrl)} type="video/mp4" />
                      Tarayıcınız video oynatmayı desteklemiyor.
                    </video>
                  )}
                </td>
                <td>
                  {a.adopted ? (
                    <Badge bg="secondary">Sahiplendi</Badge>
                  ) : (
                    <Badge bg="info">Sahip Bekliyor</Badge>
                  )}
                </td>
                <td>
                  <Badge bg={a.visible ? "success" : "secondary"}>
                    {a.visible ? "Yayında" : "Yayında Değil"}
                  </Badge>
                </td>
                <td>
                  <div className="action-buttons d-flex gap-2 flex-wrap">
                    <Button
                      variant="warning"
                      size="sm"
                      style={{ color: "white" }}
                      onClick={() => {
                        setEditData(a);
                        setExistingImages(a.imageUrls || []);
                        setImagesToDelete([]);
                        setEditImages([]);
                        setEditVideo(null);
                        setDeleteVideo(false);
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

      {/* Hayvan Ekle Modal */}
      <Modal show={showAnimalModal} onHide={() => setShowAnimalModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Yeni Hayvan Ekle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Ad</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Tür</Form.Label>
              <Form.Control
                type="text"
                value={formData.species}
                onChange={(e) =>
                  setFormData({ ...formData, species: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Cins</Form.Label>
              <Form.Control
                type="text"
                value={formData.breed}
                onChange={(e) =>
                  setFormData({ ...formData, breed: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Yaş (Yıl)</Form.Label>
              <Form.Control
                type="number"
                value={formData.ageYears}
                onChange={(e) =>
                  setFormData({ ...formData, ageYears: Number(e.target.value) })
                }
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Yaş (Ay)</Form.Label>
              <Form.Control
                type="number"
                value={formData.ageMonths}
                onChange={(e) =>
                  setFormData({ ...formData, ageMonths: Number(e.target.value) })
                }
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Cinsiyet</Form.Label>
              <Form.Control
                type="text"
                value={formData.gender}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Açıklama</Form.Label>
              <Form.Control
                type="text"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Görseller (1-3 adet)</Form.Label>
              <Form.Control type="file" multiple accept="image/*" onChange={(e) => setImages(e.target.files)} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Video (isteğe bağlı)</Form.Label>
              <Form.Control type="file" accept="video/*" onChange={(e) => setVideo(e.target.files[0])} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAnimalModal(false)}>
            İptal
          </Button>
          <Button variant="primary" onClick={handleAddAnimal}>
            Kaydet
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Hayvan Güncelle Modalı */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Hayvanı Güncelle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Ad</Form.Label>
              <Form.Control
                type="text"
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Tür</Form.Label>
              <Form.Control
                type="text"
                value={editData.species}
                onChange={(e) =>
                  setEditData({ ...editData, species: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Cins</Form.Label>
              <Form.Control
                type="text"
                value={editData.breed}
                onChange={(e) =>
                  setEditData({ ...editData, breed: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Yaş (Yıl)</Form.Label>
              <Form.Control
                type="number"
                value={editData.ageYears}
                onChange={(e) =>
                  setEditData({ ...editData, ageYears: Number(e.target.value) })
                }
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Yaş (Ay)</Form.Label>
              <Form.Control
                type="number"
                value={editData.ageMonths}
                onChange={(e) =>
                  setEditData({ ...editData, ageMonths: Number(e.target.value) })
                }
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Cinsiyet</Form.Label>
              <Form.Control
                type="text"
                value={editData.gender}
                onChange={(e) =>
                  setEditData({ ...editData, gender: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Açıklama</Form.Label>
              <Form.Control
                type="text"
                value={editData.description}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
              />
              <Form.Group className="mb-2">
                <Form.Label>Mevcut Görseller</Form.Label>
                <div className="d-flex flex-wrap gap-2">
                  {existingImages.map((imgUrl, index) => (
                    <div key={index} className="position-relative" style={{ display: "inline-block" }}>
                      <img
                        src={cleanPath(imgUrl)}
                        alt={`existing-${index}`}
                        style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px" }}
                      />
                      <Button
                        variant="danger"
                        size="sm"
                        style={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          padding: "2px 6px",
                          borderRadius: "0 8px 0 8px",
                        }}
                        onClick={() => {
                          setImagesToDelete([...imagesToDelete, imgUrl]);
                          setExistingImages(existingImages.filter((_, i) => i !== index));
                        }}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </Form.Group>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Yeni Görseller (varsa)</Form.Label>
              <Form.Control type="file" multiple accept="image/*" onChange={(e) => setEditImages(e.target.files)} />
            </Form.Group>
            {editData.videoUrl && !deleteVideo && (
              <div className="mb-2">
                <Form.Label>Mevcut Video</Form.Label>
                <div style={{ position: "relative", display: "inline-block" }}>
                  <video
                    controls
                    width="100%"
                    style={{ borderRadius: "8px", maxHeight: "250px" }}
                  >
                    <source src={cleanPath(editData.videoUrl)} type="video/mp4" />
                    Tarayıcınız video oynatmayı desteklemiyor.
                  </video>
                  <Button
                    variant="danger"
                    size="sm"
                    style={{
                      position: "absolute",
                      top: "5px",
                      right: "5px",
                      padding: "2px 6px",
                      borderRadius: "6px"
                    }}
                    onClick={() => setDeleteVideo(true)}
                  >
                    ×
                  </Button>
                </div>
              </div>
            )}
            <Form.Group className="mb-2">
              <Form.Label>Yeni Video (varsa)</Form.Label>
              <Form.Control type="file" accept="video/*" onChange={(e) => setEditVideo(e.target.files[0])} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {
            setShowEditModal(false);
            setDeleteVideo(false); 
          }}>
            İptal
          </Button>
          <Button variant="primary" onClick={handleUpdateAnimal}>
            Güncelle
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AdminPanel;
