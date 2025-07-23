import React, { useState } from "react";
import { Card, Button, Modal, Form, Carousel } from "react-bootstrap";
import "../Styles/style.css";
import axios from "../Api/PublicAxios";

function AnimalCard({ name, description, imageUrls, videoUrl, id, species, breed, gender, ageYears, ageMonths }) {
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [showAdoptModal, setShowAdoptModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    occupation: "",
    phoneNumber: "",
    email: "",
    note: "",
  });

  const handleAdopt = () => setShowAdoptModal(true);
  const handleDonate = () => setShowDonateModal(true);
  const handleCloseDonate = () => setShowDonateModal(false);
  const handleCloseAdopt = () => setShowAdoptModal(false);
  const handleOpenVideo = () => setShowVideoModal(true);
  const handleCloseVideo = () => setShowVideoModal(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/adoption", {
        ...formData,
        age: parseInt(formData.age),
        animalId: id,
      });
      alert("Başvurunuz başarıyla gönderildi!");
      setFormData({
        fullName: "",
        age: "",
        occupation: "",
        phoneNumber: "",
        email: "",
        note: "",
      });
      handleCloseAdopt();
    } catch (error) {
      console.error("Başvuru gönderilemedi:", error);
      alert("Bir hata oluştu. Lütfen bilgilerinizi kontrol edip tekrar deneyiniz.");
    }
  };

  const cleanPath = (url) => {
    if (!url) return "";
    return url; 
  };

  const hasValidVideo = videoUrl && videoUrl.trim() !== "";

  return (
    <>
      <Card className="mb-4 shadow animal-card">
        <div className="card-image-wrapper">
          {Array.isArray(imageUrls) && imageUrls.length > 0 ? (
            <Carousel controls={imageUrls.length > 1}>
              {imageUrls.map((imgSrc, i) => (
                <Carousel.Item key={i}>
                  <Card.Img
                    variant="top"
                    src={imgSrc.startsWith("http") || imgSrc.startsWith("data:")
                      ? imgSrc
                      : cleanPath(imgSrc)}
                    alt={`${name}-${i}`}
                    className="card-image"
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          ) : (
            <Card.Img
              variant="top"
              src="/placeholder.jpg"
              alt="Görsel Yok"
              className="card-image"
            />
          )}

          <div className="card-overlay">
            <h5>{name}</h5>
            <p>{gender} / {breed} / {species}</p>
            <p>Yaş: {ageYears} yıl {ageMonths} ay</p>
            <p className="card-description">{description}</p>
          </div>
        </div>
        <Card.Body>
          <Card.Title className="text-center">{name}</Card.Title>
          <div className="d-flex gap-2 mb-2">
            <Button variant="primary" onClick={handleAdopt} className="w-100">
              Sahiplen
            </Button>
            <Button variant="success" onClick={handleDonate} className="w-100">
              Bağış Yap
            </Button>
          </div>

          {hasValidVideo && (
            <Button variant="dark" onClick={handleOpenVideo} className="w-100">
              Videoyu İzle
            </Button>
          )}
        </Card.Body>
      </Card>

      {/* Video Modal (sadece video varsa göster) */}
      {hasValidVideo && (
        <Modal show={showVideoModal} onHide={handleCloseVideo} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{name} - Tanıtım Videosu</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <video controls style={{ width: "100%", borderRadius: "12px" }}>
              <source
                src={videoUrl.startsWith("http") ? videoUrl : cleanPath(videoUrl)}
                type="video/mp4"
              />
              Tarayıcınız video oynatmayı desteklemiyor.
            </video>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseVideo}>
              Kapat
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Bağış Modal */}
      <Modal show={showDonateModal} onHide={handleCloseDonate} centered>
        <Modal.Header closeButton>
          <Modal.Title>Bağış Yap</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Bağış yapmak için Kedostt Instagram sayfamızı ziyaret edebilirsiniz.</p>
          <a
            href="https://www.instagram.com/kedostt"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#E1306C",
              textDecoration: "none",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/174/174855.png"
              alt="Instagram"
              style={{ width: "20px", height: "20px" }}
            />
            Kedostt
          </a>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDonate}>
            Kapat
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Adopt Modal */}
      <Modal show={showAdoptModal} onHide={handleCloseAdopt} centered>
        <Modal.Header closeButton>
          <Modal.Title>{name} için Sahiplenme Başvurusu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Ad Soyad</Form.Label>
              <Form.Control
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Yaş</Form.Label>
              <Form.Control
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                min={18}
                max={100}
              />
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Meslek</Form.Label>
              <Form.Control
                type="text"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Telefon</Form.Label>
              <Form.Control
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Açıklama / Not</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="note"
                value={formData.note}
                onChange={handleChange}
              />
            </Form.Group>

            <div className="d-flex justify-content-end mt-4">
              <Button variant="secondary" onClick={handleCloseAdopt} className="me-2">
                Kapat
              </Button>
              <Button type="submit" variant="primary">
                Gönder
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AnimalCard;
