import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

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
            const upload = await cloudinary.uploader.upload(fileUri.content);
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



// UPDATE PROFILE
export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
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

        if (req.file) {
            const fileUri = getDataUri(req.file);
            const upload = await cloudinary.uploader.upload(fileUri.content);
            user.profile.resume = upload.secure_url;
            user.profile.resumeOriginalName = req.file.originalname;
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
