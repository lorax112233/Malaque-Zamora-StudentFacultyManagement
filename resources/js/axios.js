import axios from "axios";

const instance = axios.create({
  baseURL: "http://127.0.0.1:8000", // Laravel backend
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  // include credentials in case the API uses cookie-based auth (Sanctum)
  withCredentials: true,
});

export default instance; // ✅ Make sure this line exists
