import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1/resume`,
  withCredentials: true,
});

export const resumeAPI = {
  // Preview resume (no auth)
  preview: (resumeData) =>
    api.post("/preview", { resumeData }),

  // Save resume (auth required)
  save: (data) =>
    api.post("/save", data),

  // Get all resumes (auth required)
  getAll: () =>
    api.get("/"),

  // Get single resume (auth required)
  getOne: (id) =>
    api.get(`/${id}`),

  // Update resume (auth required)
  update: (id, data) =>
    api.put(`/${id}`, data),

  // Delete resume (auth required)
  delete: (id) =>
    api.delete(`/${id}`),
};

export default resumeAPI;
