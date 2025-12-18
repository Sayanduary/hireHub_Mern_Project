import express from "express";
import {
  previewResume,
  saveResume,
  getAllResumes,
  getSingleResume,
  updateResume,
  deleteResume,
} from "../controllers/resume.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

// Public routes (no auth required)
router.post("/preview", previewResume);

// Protected routes (auth required)
router.post("/save", isAuthenticated, saveResume);
router.get("/", isAuthenticated, getAllResumes);
router.get("/:id", isAuthenticated, getSingleResume);
router.put("/:id", isAuthenticated, updateResume);
router.delete("/:id", isAuthenticated, deleteResume);

export default router;
