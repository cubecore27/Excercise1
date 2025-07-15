// src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: 'https://workflowservice-production.up.railway.app/',
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
