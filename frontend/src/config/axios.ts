import axios from "axios";

const baseURL = "https://json-server-tau-six.vercel.app/";

export const api = axios.create({
  baseURL: baseURL,
});
