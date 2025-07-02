import axios from "axios";

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

const publicAxios = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default publicAxios;
