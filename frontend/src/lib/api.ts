import axios from "axios";

const BASE_BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:5500/api/v1";

export const api = axios.create({
  baseURL: BASE_BACKEND_URL,
  withCredentials: true,
});