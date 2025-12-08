import { Job } from "../models/job.model.js";

// ADMIN — Create Job
export const postJob = async (req, res) => {
    try {
        const { 
            title,
            description,
            requirements,
            salary,
            location,
            jobType,
            experience,
            position,
            companyId
        } = req.body;

        const userId = req.id;

        // Validate required fields
        if (
            !title ||
            !description ||
            !requirements ||
            salary === undefined ||
            !location ||
            !jobType ||
            experience === undefined ||
            position === undefined ||
            !companyId
        ) {
            return res.status(400).json({
                message: "Missing required fields",
                success: false
            });
        }

        // Validate MongoDB ObjectId
        if (!companyId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                message: "Invalid companyId format",
                success: false
            });
        }

        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(","),
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: Number(experience),
            position: Number(position),
            company: companyId,
            created_by: userId
        });

        return res.status(201).json({
            message: "New job created successfully",
            job,
            success: true
        });

    } catch (error) {
        console.error("POST JOB ERROR:", error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};


// STUDENT — Get All Jobs
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";

        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } }
            ]
        };

        const jobs = await Job.find(query)
            .populate("company")
            .sort({ createdAt: -1 });

        return res.status(200).json({ jobs, success: true });

    } catch (error) {
        console.error("GET ALL JOBS ERROR:", error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};


// STUDENT — Get Job Details
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;

        const job = await Job.findById(jobId)
            .populate("applications")
            .populate("company");

        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            });
        }

        return res.status(200).json({ job, success: true });

    } catch (error) {
        console.error("GET JOB BY ID ERROR:", error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};


// ADMIN — Jobs created by logged-in recruiter
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;

        const jobs = await Job.find({ created_by: adminId })
            .populate("company")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            jobs,
            success: true
        });

    } catch (error) {
        console.error("GET ADMIN JOBS ERROR:", error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};
