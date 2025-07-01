import axios from "axios";

const BASE_URL = import.meta.env.REACT_APP_BACKEND_URL  || "http://localhost:8080";

const publicAxios = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default publicAxios;
