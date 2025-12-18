import { User } from "../models/user.model.js";
import { Job } from "../models/job.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import mongoose from "mongoose";
import https from "https";
import axios from "axios";


// REGISTER USER
export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;

        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({ message: "Missing fields", success: false });
        }

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "User already exists", success: false });
        }

        let profilePhotoUrl = null;
        if (req.file) {
            const fileUri = getDataUri(req.file);
            const upload = await cloudinary.uploader.upload(fileUri.content, {
                resource_type: "auto",
                type: "upload",
                flags: ["keep_iptc"]
            });
            profilePhotoUrl = upload.secure_url;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile: { profilePhoto: profilePhotoUrl }
        });

        res.status(201).json({ message: "Account created successfully", success: true });
    } catch (error) {
        console.error("REGISTER ERROR:", error);
        res.status(500).json({ message: "Server error", success: false });
    }
};



// LOGIN USER (Fixed Cookie Issue)
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({ message: "Missing fields", success: false });
        }

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials", success: false });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ message: "Invalid credentials", success: false });
        }

        if (user.role !== role) {
            return res.status(400).json({ message: "Role mismatch", success: false });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.SECRET_KEY,
            { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
        );

        const userData = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        return res
            .status(200)
            .cookie("token", token, {
                httpOnly: true,
                secure: false,            // IMPORTANT for localhost/Postman
                sameSite: "lax",          // prevents cookie blocking
                path: "/",                // ensure cookie is sent for all routes
                maxAge: 24 * 60 * 60 * 1000
            })
            .json({
                message: `Welcome back ${user.fullname}`,
                user: userData,
                success: true
            });

    } catch (error) {
        console.error("LOGIN ERROR:", error);
        res.status(500).json({ message: "Server error", success: false });
    }
};



// LOGOUT USER
export const logout = async (req, res) => {
    return res
        .status(200)
        .cookie("token", "", {
            maxAge: 0,
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/"
        })
        .json({ message: "Logged out successfully", success: true });
};

// CHANGE PASSWORD
export const changePassword = async (req, res) => {
    try {
        const userId = req.id;
        const { currentPassword, newPassword, confirmPassword } = req.body;

        // Validate input
        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                message: "New passwords do not match",
                success: false
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters",
                success: false
            });
        }

        // Find user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        // Check if user signed up with Google (no password)
        if (user.authProvider === 'google' && !user.password) {
            return res.status(400).json({
                message: "Cannot change password for Google sign-in accounts. Please set a password first.",
                success: false
            });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Current password is incorrect",
                success: false
            });
        }

        // Hash new password and save
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({
            message: "Password changed successfully",
            success: true
        });

    } catch (error) {
        console.error("CHANGE PASSWORD ERROR:", error);
        res.status(500).json({ message: "Server error", success: false });
    }
};

// SET PASSWORD (for Google sign-in users who don't have a password)
export const setPassword = async (req, res) => {
    try {
        const userId = req.id;
        const { newPassword, confirmPassword } = req.body;

        // Validate input
        if (!newPassword || !confirmPassword) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                message: "Passwords do not match",
                success: false
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters",
                success: false
            });
        }

        // Find user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        // Check if user already has a password
        if (user.password) {
            return res.status(400).json({
                message: "You already have a password. Use change password instead.",
                success: false
            });
        }

        // Hash and set password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({
            message: "Password set successfully! You can now login with email and password.",
            success: true
        });

    } catch (error) {
        console.error("SET PASSWORD ERROR:", error);
        res.status(500).json({ message: "Server error", success: false });
    }
};

// GET USER PROFILE
export const getProfile = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        return res.status(200).json({
            user,
            success: true
        });
    } catch (error) {
        console.error("GET PROFILE ERROR:", error);
        res.status(500).json({ message: "Server error", success: false });
    }
};



// UPDATE PROFILE
export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills, location, linkedinUrl, githubUrl, designation, companyName, companyWebsite, companyEmail, companyLocation, companyDescription, yearsOfExperience } = req.body;
        const userId = req.id;

        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;
        if (skills) user.profile.skills = skills.split(",");
        if (location !== undefined) user.profile.location = location;
        if (linkedinUrl !== undefined) user.profile.linkedinUrl = linkedinUrl;
        if (githubUrl !== undefined) user.profile.githubUrl = githubUrl;

        // Recruiter-specific fields
        if (user.role === "recruiter") {
            if (designation !== undefined) user.profile.designation = designation;
            if (companyName !== undefined) user.profile.companyName = companyName;
            if (companyWebsite !== undefined) user.profile.companyWebsite = companyWebsite;
            if (companyEmail !== undefined) user.profile.companyEmail = companyEmail;
            if (companyLocation !== undefined) user.profile.companyLocation = companyLocation;
            if (companyDescription !== undefined) user.profile.companyDescription = companyDescription;
            if (yearsOfExperience !== undefined) user.profile.yearsOfExperience = yearsOfExperience;
        }

        // Handle profile photo upload
        if (req.files && req.files.profilePhoto) {
            const fileUri = getDataUri(req.files.profilePhoto[0]);
            const upload = await cloudinary.uploader.upload(fileUri.content, {
                resource_type: "auto",
                type: "upload",
                flags: ["keep_iptc"]
            });
            user.profile.profilePhoto = upload.secure_url;
        }

        // Handle resume upload
        if (req.files && req.files.file) {
            const fileUri = getDataUri(req.files.file[0]);
            const upload = await cloudinary.uploader.upload(fileUri.content, {
                resource_type: "auto",
                type: "upload",
                folder: "resumes",
                invalidate: true
            });
            user.profile.resume = upload.secure_url;
            user.profile.resumeOriginalName = req.files.file[0].originalname;
        }

        await user.save();

        res.status(200).json({
            message: "Profile updated successfully",
            user,
            success: true
        });

    } catch (error) {
        console.error("PROFILE UPDATE ERROR:", error);
        res.status(500).json({ message: "Server error", success: false });
    }
};

// SAVE JOB (Toggle save/unsave)
export const saveJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({ message: "Invalid job ID", success: false });
        }

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found", success: false });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        // Check if job is already saved
        const isAlreadySaved = user.savedJobs.includes(jobId);

        if (isAlreadySaved) {
            // Remove from saved jobs
            user.savedJobs = user.savedJobs.filter(id => id.toString() !== jobId);
            await user.save();
            return res.status(200).json({
                message: "Job removed from saved jobs",
                success: true
            });
        } else {
            // Add to saved jobs
            user.savedJobs.push(jobId);
            await user.save();
            return res.status(200).json({
                message: "Job saved successfully",
                success: true
            });
        }

    } catch (error) {
        console.error("SAVE JOB ERROR:", error);
        res.status(500).json({ message: "Server error", success: false });
    }
};

// GET SAVED JOBS
export const getSavedJobs = async (req, res) => {
    try {
        const userId = req.id;

        const user = await User.findById(userId)
            .populate({
                path: "savedJobs",
                populate: { path: "company" }
            });

        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        return res.status(200).json({
            savedJobs: user.savedJobs || [],
            success: true
        });

    } catch (error) {
        console.error("GET SAVED JOBS ERROR:", error);
        res.status(500).json({ message: "Server error", success: false });
    }
};

// DOWNLOAD RESUME (Proxy endpoint to serve resume with proper headers)
export const downloadResume = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);

        if (!user || !user.profile.resume) {
            return res.status(404).json({ message: "Resume not found", success: false });
        }

        const resumeUrl = user.profile.resume;

        try {
            // First try: Direct fetch (for public files)
            const response = await axios.get(resumeUrl, {
                responseType: 'arraybuffer',
                timeout: 15000
            });

            res.setHeader('Content-Type', response.headers['content-type'] || 'application/pdf');
            res.setHeader('Content-Length', response.data.length);
            res.setHeader('Content-Disposition', `attachment; filename="${user.profile.resumeOriginalName || 'resume.pdf'}"`);
            res.send(response.data);

        } catch (error) {
            // Second try: If 401, try with Cloudinary API authentication
            if (error.response && error.response.status === 401) {
                console.log("File requires authentication, using Cloudinary API...");

                try {
                    // Extract public_id from secure_url
                    const publicIdMatch = resumeUrl.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);

                    if (publicIdMatch) {
                        const publicId = publicIdMatch[1];

                        // Use Cloudinary's private download URL with API key
                        const timestamp = Math.floor(Date.now() / 1000);
                        const signature = cloudinary.utils.api_sign_request(
                            { timestamp },
                            process.env.CLOUDINARY_API_SECRET
                        );

                        const authUrl = `${resumeUrl}?timestamp=${timestamp}&signature=${signature}&api_key=${process.env.CLOUDINARY_API_KEY}`;

                        const authResponse = await axios.get(authUrl, {
                            responseType: 'arraybuffer',
                            timeout: 15000
                        });

                        res.setHeader('Content-Type', authResponse.headers['content-type'] || 'application/pdf');
                        res.setHeader('Content-Length', authResponse.data.length);
                        res.setHeader('Content-Disposition', `attachment; filename="${user.profile.resumeOriginalName || 'resume.pdf'}"`);
                        res.send(authResponse.data);
                    } else {
                        throw error;
                    }
                } catch (authError) {
                    console.error("Auth download failed:", authError.message);
                    throw error;
                }
            } else {
                throw error;
            }
        }

    } catch (error) {
        console.error("DOWNLOAD RESUME ERROR:", error.message);
        res.status(500).json({ message: "Failed to download resume", success: false });
    }
};

// GOOGLE CALLBACK - After successful Google authentication
export const googleCallback = async (req, res) => {
    try {
        const user = req.user;

        const token = jwt.sign(
            { userId: user._id },
            process.env.SECRET_KEY,
            { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
        );

        const userData = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
            authProvider: user.authProvider
        };

        // Redirect to frontend with token in query param
        const frontendUrl = process.env.CLIENT_URL || "http://localhost:3000";
        return res.redirect(
            `${frontendUrl}/auth/google/callback?token=${token}&userId=${user._id}&role=${user.role}`
        );

    } catch (error) {
        console.error("GOOGLE CALLBACK ERROR:", error);
        res.status(500).json({ message: "Authentication failed", success: false });
    }
};

// GOOGLE LOGIN - Get user data after successful authentication
export const googleLogin = async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(401).json({ message: "Not authenticated", success: false });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.SECRET_KEY,
            { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
        );

        const userData = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
            authProvider: user.authProvider
        };

        return res
            .status(200)
            .cookie("token", token, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                path: "/",
                maxAge: 24 * 60 * 60 * 1000
            })
            .json({
                message: `Welcome ${user.fullname}`,
                user: userData,
                success: true
            });

    } catch (error) {
        console.error("GOOGLE LOGIN ERROR:", error);
        res.status(500).json({ message: "Server error", success: false });
    }
};