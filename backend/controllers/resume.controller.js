import { Resume } from "../models/resume.model.js";
import { v2 as cloudinary } from "cloudinary";
import DataUriUpload from "datauri/parser.js";

// Preview Resume (No Auth Required) - Generate PDF in-memory only
export const previewResume = async (req, res) => {
  try {
    const { resumeData, templateType = "ui" } = req.body;

    if (!resumeData) {
      return res.status(400).json({
        success: false,
        message: "Resume data is required",
      });
    }

    // Generate PDF in memory (no database write, no Cloudinary upload)
    // This will be handled by frontend using existing pdfGenerator
    // Backend just validates and confirms receipt
    return res.status(200).json({
      success: true,
      message: "Preview data validated. Frontend will generate local PDF.",
      templateType,
    });
  } catch (error) {
    console.error("Preview error:", error);
    return res.status(500).json({
      success: false,
      message: "Error previewing resume",
      error: error.message,
    });
  }
};

// Save Resume (Auth Required)
export const saveResume = async (req, res) => {
  try {
    console.log("📝 Save Resume Request received");
    console.log("User ID from req:", req.id);
    console.log("Cookies:", req.cookies);

    const userId = req.id;
    const { resumeData, title, templateType = "ui", pdfBase64 } = req.body;

    if (!userId) {
      console.log("❌ No userId - user not authenticated");
      return res.status(401).json({
        success: false,
        message: "User must be logged in to save resume",
      });
    }

    if (!resumeData || !title || !pdfBase64) {
      return res.status(400).json({
        success: false,
        message: "Resume data, title, and PDF are required",
      });
    }

    // Upload PDF to Cloudinary
    const parser = new DataUriUpload();
    const uploadedResponse = await cloudinary.uploader.upload(
      `data:application/pdf;base64,${pdfBase64}`,
      {
        resource_type: "raw",
        format: "pdf",
        folder: `resumes/${userId}`,
        public_id: `resume_${Date.now()}`,
      }
    );

    // Create resume record in database
    const resume = await Resume.create({
      userId,
      title,
      resumeData,
      templateType,
      pdfUrl: uploadedResponse.secure_url,
      pdfPublicId: uploadedResponse.public_id,
    });

    console.log("✅ Resume saved successfully:", resume._id);

    return res.status(201).json({
      success: true,
      message: "Resume saved successfully",
      resume,
    });
  } catch (error) {
    console.error("❌ Save resume error:", error);
    return res.status(500).json({
      success: false,
      message: "Error saving resume",
      error: error.message,
    });
  }
};

// Get All Resumes (Auth Required)
export const getAllResumes = async (req, res) => {
  try {
    const userId = req.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User must be logged in",
      });
    }

    const resumes = await Resume.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      resumes,
    });
  } catch (error) {
    console.error("Get resumes error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching resumes",
      error: error.message,
    });
  }
};

// Get Single Resume (Auth Required)
export const getSingleResume = async (req, res) => {
  try {
    const userId = req.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User must be logged in",
      });
    }

    const resume = await Resume.findById(id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    // Ensure resume belongs to user
    if (resume.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this resume",
      });
    }

    return res.status(200).json({
      success: true,
      resume,
    });
  } catch (error) {
    console.error("Get single resume error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching resume",
      error: error.message,
    });
  }
};

// Update Resume (Auth Required)
export const updateResume = async (req, res) => {
  try {
    const userId = req.id;
    const { id } = req.params;
    const { resumeData, title, templateType = "ui", pdfBase64 } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User must be logged in",
      });
    }

    if (!resumeData || !title || !pdfBase64) {
      return res.status(400).json({
        success: false,
        message: "Resume data, title, and PDF are required",
      });
    }

    const resume = await Resume.findById(id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    // Ensure resume belongs to user
    if (resume.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this resume",
      });
    }

    // Delete old PDF from Cloudinary
    if (resume.pdfPublicId) {
      await cloudinary.uploader.destroy(resume.pdfPublicId, {
        resource_type: "raw",
      });
    }

    // Upload new PDF
    const uploadedResponse = await cloudinary.uploader.upload(
      `data:application/pdf;base64,${pdfBase64}`,
      {
        resource_type: "raw",
        format: "pdf",
        folder: `resumes/${userId}`,
        public_id: `resume_${Date.now()}`,
      }
    );

    // Update resume record
    resume.title = title;
    resume.resumeData = resumeData;
    resume.templateType = templateType;
    resume.pdfUrl = uploadedResponse.secure_url;
    resume.pdfPublicId = uploadedResponse.public_id;

    await resume.save();

    return res.status(200).json({
      success: true,
      message: "Resume updated successfully",
      resume,
    });
  } catch (error) {
    console.error("Update resume error:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating resume",
      error: error.message,
    });
  }
};

// Delete Resume (Auth Required)
export const deleteResume = async (req, res) => {
  try {
    const userId = req.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User must be logged in",
      });
    }

    const resume = await Resume.findById(id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    // Ensure resume belongs to user
    if (resume.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this resume",
      });
    }

    // Delete PDF from Cloudinary
    if (resume.pdfPublicId) {
      await cloudinary.uploader.destroy(resume.pdfPublicId, {
        resource_type: "raw",
      });
    }

    // Delete resume record
    await Resume.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Resume deleted successfully",
    });
  } catch (error) {
    console.error("Delete resume error:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting resume",
      error: error.message,
    });
  }
};
