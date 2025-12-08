import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  applyJob,
  getApplicants,
  getAppliedJobs,
  updateStatus
} from "../controllers/application.controller.js";

const router = express.Router();

// Student applies for job
router.post("/apply/:id", isAuthenticated, applyJob);

// Student sees list of applied jobs
router.get("/get", isAuthenticated, getAppliedJobs);

// Recruiter sees applicants for 1 job
router.get("/:id/applicants", isAuthenticated, getApplicants);

// Recruiter updates application status
router.patch("/status/:id/update", isAuthenticated, updateStatus);

export default router;
