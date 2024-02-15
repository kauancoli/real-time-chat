import axios from "axios";

const baseURL = "https://json-server-yjdx.onrender.com";

export const api = axios.create({
  baseURL: baseURL,
});
