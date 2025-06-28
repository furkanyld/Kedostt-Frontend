import axios from "axios";

const instance = axios.create({
  baseURL: "https://localhost:8080", // kendi backend adresine göre düzenle
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
