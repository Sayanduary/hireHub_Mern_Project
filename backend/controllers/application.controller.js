import mongoose from "mongoose";
import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

// APPLY FOR A JOB
export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;

        console.log("Apply Job - User ID:", userId, "Job ID:", jobId);

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({ message: "Invalid Job ID", success: false });
        }

        // Check duplicate application
        const existingApplication = await Application.findOne({
            job: jobId,
            applicant: userId
        });

        if (existingApplication) {
            console.log("Duplicate application found:", existingApplication._id);
            return res.status(400).json({
                message: "You have already applied for this job",
                success: false
            });
        }

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            });
        }

        // Create application
        const newApplication = await Application.create({
            job: jobId,
            applicant: userId
        });

        console.log("New application created:", newApplication._id);

        // Add application to Job
        job.applications.push(newApplication._id);
        await job.save();

        console.log("Application added to job. Total applications:", job.applications.length);

        return res.status(201).json({
            message: "Job applied successfully",
            application: { _id: newApplication._id, applicant: userId, status: "pending" },
            success: true
        });

    } catch (error) {
        console.error("APPLY JOB ERROR:", error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};


// GET ALL JOBS APPLIED BY CURRENT USER (student)
export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id;

        const applications = await Application.find({ applicant: userId })
            .sort({ createdAt: -1 })
            .populate({
                path: "job",
                populate: { path: "company" }
            });

        if (applications.length === 0) {
            return res.status(200).json({
                message: "No applications found",
                applications,
                success: true
            });
        }

        return res.status(200).json({
            applications,
            success: true
        });

    } catch (error) {
        console.error("GET APPLIED JOBS ERROR:", error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};


// GET APPLICANTS FOR A JOB (Recruiter/Admin)
export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({ message: "Invalid job ID", success: false });
        }

        const job = await Job.findById(jobId).populate({
            path: "applications",
            populate: { path: "applicant" }
        });

        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            });
        }

        return res.status(200).json({
            job,
            success: true
        });

    } catch (error) {
        console.error("GET APPLICANTS ERROR:", error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};


// UPDATE APPLICATION STATUS (Recruiter/Admin)
export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;

        if (!["pending", "accepted", "rejected"].includes(status?.toLowerCase())) {
            return res.status(400).json({
                message: "Invalid status. Must be pending, accepted, or rejected",
                success: false
            });
        }

        if (!mongoose.Types.ObjectId.isValid(applicationId)) {
            return res.status(400).json({ message: "Invalid Application ID", success: false });
        }

        const application = await Application.findById(applicationId).populate({
            path: 'job',
            select: 'title company',
            populate: { path: 'company', select: 'name' }
        });

        if (!application) {
            return res.status(404).json({
                message: "Application not found",
                success: false
            });
        }

        application.status = status.toLowerCase();
        await application.save();

        // Create notification for the applicant
        const { User } = await import('../models/user.model.js');
        const applicant = await User.findById(application.applicant);

        if (applicant) {
            const notificationMessage = status.toLowerCase() === 'accepted'
                ? `Congratulations! Your application for ${application.job?.title} at ${application.job?.company?.name} has been accepted.`
                : `Your application for ${application.job?.title} at ${application.job?.company?.name} has been ${status.toLowerCase()}.`;

            applicant.notifications.push({
                message: notificationMessage,
                type: 'application_status',
                jobId: application.job._id,
                applicationId: application._id,
                read: false
            });

            await applicant.save();
        }

        return res.status(200).json({
            message: "Status updated successfully",
            success: true
        });

    } catch (error) {
        console.error("UPDATE STATUS ERROR:", error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};

// DELETE APPLICATION (Student withdraws application)
export const deleteApplication = async (req, res) => {
    try {
        const applicationId = req.params.id;
        const userId = req.id;

        if (!mongoose.Types.ObjectId.isValid(applicationId)) {
            return res.status(400).json({ message: "Invalid Application ID", success: false });
        }

        const application = await Application.findById(applicationId);
        if (!application) {
            return res.status(404).json({
                message: "Application not found",
                success: false
            });
        }

        // Check if the user is the applicant
        if (application.applicant.toString() !== userId) {
            return res.status(403).json({
                message: "Not authorized to delete this application",
                success: false
            });
        }

        // Remove application from job's applications array
        await Job.findByIdAndUpdate(
            application.job,
            { $pull: { applications: applicationId } },
            { new: true }
        );

        // Delete the application
        await Application.findByIdAndDelete(applicationId);

        return res.status(200).json({
            message: "Application withdrawn successfully",
            success: true
        });

    } catch (error) {
        console.error("DELETE APPLICATION ERROR:", error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};
