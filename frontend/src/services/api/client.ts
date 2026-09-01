import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_URL ?? "https://json-server-yjdx.onrender.com";

export const apiClient = axios.create({ baseURL });
