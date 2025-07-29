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
  const [isUploading, setIsUploading] = useState(false);

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

  const uploadToImageKit = async (file) => {
    const form = new FormData();
    form.append("file", file);
    form.append("fileName", file.name);
    form.append("useUniqueFileName", "false");
    setIsUploading(true);
    try {
      const res = await axios.post("/images/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } finally {
      setIsUploading(false);
    }
  };

  const uploadToImageKitVideo = async (file) => {
    const form = new FormData();
    form.append("file", file);
    setIsUploading(true);
    try {
      const res = await axios.post("/videos/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddAnimal = async () => {
    try {
      const uploadedImages = [];
      for (let i = 0; i < images.length; i++) {
        const res = await uploadToImageKit(images[i]);
        uploadedImages.push(res);
      }

      let uploadedVideo = null;
      if (video) {
        uploadedVideo = await uploadToImageKitVideo(video);
      }

      const payload = {
        ...formData,
        imageUrls: uploadedImages.map((img) => img.url),
        imageFileIds: uploadedImages.map((img) => img.fileId),
        videoUrl: uploadedVideo?.url || null,
        videoFileId: uploadedVideo?.fileId || null,
      };

      await axios.post("/api/animals", payload);
      fetchAnimals();
      setShowAnimalModal(false);
      setFormData({ name: "", species: "", breed: "", ageYears: 0, ageMonths: 0, gender: "", description: "", visible: true });
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
      const uploadedImages = [];
      for (let i = 0; i < editImages.length; i++) {
        const res = await uploadToImageKit(editImages[i]);
        uploadedImages.push(res); // {url, fileId}
      }

      let uploadedVideo = null;
      if (editVideo?.url && editVideo?.fileId) {
        uploadedVideo = editVideo;
      }

      const data = new FormData();

      // Animal bilgileri
      Object.entries(editData).forEach(([key, value]) => {
        if (key !== "id") data.append(key, value);
      });

      // 1. Kalan mevcut görselleri gönder (silinenleri gönderme)
      existingImages
        .filter((img) => !imagesToDelete.some((del) => del.fileId === img.fileId))
        .forEach((img) => {
          data.append("existingImageUrls", img.url);
          data.append("existingImageFileIds", img.fileId);
        });

      // 2. Yeni yüklenen görselleri (duplicate ve silinenle çakışanları filtrele)
      if (uploadedImages.length > 0) {
        uploadedImages
          .filter((img) => {
            const alreadyExists = existingImages.some((exist) => exist.fileId === img.fileId);
            const markedForDelete = imagesToDelete.some((del) => del.fileId === img.fileId);
            return !alreadyExists && !markedForDelete;
          })
          .forEach((img) => {
            data.append("imageUrls", img.url);
            data.append("imageFileIds", img.fileId);
          });
      }

      // Yeni video varsa
      if (uploadedVideo) {
        data.append("videoUrl", uploadedVideo.url);
        data.append("videoFileId", uploadedVideo.fileId);
      }

      // Silinmesi istenen eski resimler
      imagesToDelete.forEach((img) => {
        data.append("deleteImageFileIds", img.fileId);
      });

      if (deleteVideo) {
        data.append("deleteVideo", "true");
      }

      // Yeni yapılandırılmış endpoint
      await axios.put(`/api/animals/${editData.id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      fetchAnimals();
      setShowEditModal(false);
      setEditImages([]);
      setEditVideo(null);
      setDeleteVideo(false);
      setImagesToDelete([]);
      setExistingImages([]);
    } catch (error) {
      console.error("Update error:", error.response?.data || error.message);
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

  const handleEditImageSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);

    const uniqueFiles = selectedFiles.filter((file) =>
      !existingImages.some(img => img.url.includes(file.name)) &&
      !editImages.some(existing =>
        existing.name === file.name &&
        existing.size === file.size &&
        existing.lastModified === file.lastModified
      ));

    setEditImages((prev) => [...prev, ...uniqueFiles]);
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
    return url;
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
                        setExistingImages([]);
                        setEditVideo(null);
                        setImagesToDelete([]);
                        setDeleteVideo(false);

                        const cleanedVideoUrl = Array.isArray(a.videoUrl)
                          ? a.videoUrl[0]
                          : a.videoUrl?.split(",").pop();

                        setEditData(a);

                        setExistingImages(
                          a.imageUrls?.map((url, i) => ({
                            url,
                            fileId: a.imageFileIds?.[i] || null,
                          })) || []
                        );

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
          {isUploading && (
            <div className="text-center text-info mb-3">
              Dosyalar yükleniyor, lütfen bekleyin...
            </div>
          )}
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
              <Form.Control
                type="file"
                accept="video/*"
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (!file) return;

                  const uploaded = await uploadToImageKitVideo(file);
                  setEditVideo({
                    url: uploaded.url,
                    fileId: uploaded.fileId,
                  });
                }}
              />
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
          {isUploading && (
            <div className="text-center text-info mb-3">
              Dosyalar yükleniyor, lütfen bekleyin...
            </div>
          )}
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
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Mevcut Görseller</Form.Label>
              <div className="d-flex flex-wrap gap-2">
                {existingImages.map((imgObj, index) => (
                  <div key={index} className="position-relative" style={{ display: "inline-block" }}>
                    <img
                      src={cleanPath(imgObj.url)}
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
                        setImagesToDelete([...imagesToDelete, imgObj]); // 🔥 hem url hem fileId ile
                        setExistingImages(existingImages.filter((_, i) => i !== index));
                      }}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Yeni Görseller (varsa)</Form.Label>
              <Form.Control type="file" multiple accept="image/*" onChange={handleEditImageSelect} />
            </Form.Group>
            {editData.videoUrl && !deleteVideo && (() => {
              const cleanedVideoUrl = Array.isArray(editData.videoUrl)
                ? editData.videoUrl[0]
                : editData.videoUrl?.split(",").pop();
              return (
                <div className="mb-2">
                  <Form.Label>Mevcut Video</Form.Label>
                  <div style={{ position: "relative", display: "inline-block" }}>
                    <video
                      controls
                      width="100%"
                      style={{ borderRadius: "8px", maxHeight: "250px" }}
                    >
                      <source src={cleanPath(cleanedVideoUrl)} type="video/mp4" />
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
                      onClick={() => {
                        setDeleteVideo(true);
                        setEditData(prev => ({ ...prev, videoUrl: null }));
                      }}
                    >
                      ×
                    </Button>
                  </div>
                </div>
              )
            })()}
            <Form.Group className="mb-2">
              <Form.Label>Yeni Video (varsa)</Form.Label>
              <Form.Control
                type="file"
                accept="video/*"
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (!file) return;

                  const uploaded = await uploadToImageKitVideo(file);
                  setEditVideo({
                    url: uploaded.url,
                    fileId: uploaded.fileId,
                  });
                }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {
            setShowEditModal(false);
            setDeleteVideo(false);
            setEditImages([]);
            setEditVideo(null);
            setImagesToDelete([]);
            setExistingImages([]);
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
