import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/api/v1",
  withCredentials: true, // CRITICAL FOR COOKIE AUTH
});

export default api;
