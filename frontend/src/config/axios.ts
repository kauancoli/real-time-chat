import axios from "axios";

const baseURL = "http://localhost:3001";

export const api = axios.create({
  baseURL: baseURL,
});
