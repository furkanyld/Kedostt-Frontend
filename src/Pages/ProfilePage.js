import React, { useEffect, useState } from "react";
import axios from "../Api/PrivateAxios";
import { useAuth } from "../Context/AuthContext";
import { Card, Table, Badge, Button, Modal, Form } from "react-bootstrap";

function ProfilePage() {
  const { user, logout } = useAuth();
  const [adoptions, setAdoptions] = useState([]);
  const [userInfo, setUserInfo] = useState({ username: "", email: "" });

  const [showEditModal, setShowEditModal] = useState(false);
  const handleClose = () => setShowEditModal(false);
  const handleShow = () => setShowEditModal(true);

  // ✅ Bilgileri Çek
  const fetchUserInfo = () => {
    axios
      .get("/api/users/me")
      .then((res) => setUserInfo(res.data))
      .catch((err) => console.error("Bilgiler alınamadı:", err));
  };

  // ✅ Başvuruları Çek
  const fetchAdoptions = () => {
    axios
      .get("/api/adoption/me")
      .then((res) => setAdoptions(res.data))
      .catch((err) => console.error("Başvurular alınamadı:", err));
  };

  useEffect(() => {
    fetchUserInfo();
    fetchAdoptions();
  }, []);

  // ✅ Bilgileri Güncelle
  const handleUpdate = async () => {
    try {
      await axios.put("/api/users/me", {
        username: userInfo.username,
        email: userInfo.email,
      });
      alert("Bilgiler güncellendi.");
      handleClose();
      fetchUserInfo();
    } catch (err) {
      console.error("Güncelleme hatası:", err);
      alert("Güncelleme sırasında hata oluştu.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Profilim</h2>

      {/* Kullanıcı Bilgileri */}
      <Card className="mb-4 p-4 shadow-sm">
        <h5 className="card-title mb-3">Kullanıcı Bilgileri</h5>
        <p>
          <strong>Kullanıcı Adı:</strong> {userInfo.username}
        </p>
        <p>
          <strong>Email:</strong> {userInfo.email}
        </p>
        <div className="d-flex gap-2 mt-3">
          <Button variant="primary" onClick={handleShow}>
            Bilgilerimi Güncelle
          </Button>
          <Button variant="outline-danger" onClick={logout}>
            Çıkış Yap
          </Button>
        </div>
      </Card>

      {/* Sahiplenme Başvuruları */}
      <Card className="p-4 shadow-sm">
        <h5 className="card-title mb-3">Sahiplenme Başvurularım</h5>

        {adoptions.length === 0 ? (
          <p>Hiç sahiplenme başvurunuz bulunmamaktadır.</p>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Ad Soyad</th>
                <th>Yaş</th>
                <th>Meslek</th>
                <th>Telefon</th>
                <th>Email</th>
                <th>Not</th>
                <th>Durum</th>
                <th>Hayvan ID</th>
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
                  <td>{a.animalId}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>

      {/* Güncelleme Modalı */}
      <Modal show={showEditModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Bilgilerini Güncelle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="username">
              <Form.Label>Kullanıcı Adı</Form.Label>
              <Form.Control
                type="text"
                value={userInfo.username}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, username: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="email" className="mt-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={userInfo.email}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, email: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            İptal
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Kaydet
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ProfilePage;
