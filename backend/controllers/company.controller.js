import { Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

// REGISTER COMPANY
export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;

        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required.",
                success: false
            });
        }

        // Check duplicate by name
        let company = await Company.findOne({ name: companyName });
        if (company) {
            return res.status(400).json({
                message: "A company with this name already exists.",
                success: false
            });
        }

        // Create company
        company = await Company.create({
            name: companyName,
            userId: req.id
        });

        return res.status(201).json({
            message: "Company registered successfully.",
            company,
            success: true
        });

    } catch (error) {
        console.error("COMPANY REGISTER ERROR:", error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};


// GET ALL COMPANIES FOR LOGGED-IN USER
export const getCompany = async (req, res) => {
    try {
        const userId = req.id;

        const companies = await Company.find({ userId });

        return res.status(200).json({
            companies,
            success: true
        });

    } catch (error) {
        console.error("GET COMPANY ERROR:", error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};


// GET COMPANY BY ID
export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;

        const company = await Company.findById(companyId);

        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }

        return res.status(200).json({
            company,
            success: true
        });

    } catch (error) {
        console.error("GET COMPANY BY ID ERROR:", error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};


// UPDATE COMPANY
export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location } = req.body;

        let updateData = { name, description, website, location };

        // If logo file provided, upload to Cloudinary
        if (req.file) {
            const fileUri = getDataUri(req.file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            updateData.logo = cloudResponse.secure_url;
        }

        const company = await Company.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }

        return res.status(200).json({
            message: "Company information updated.",
            company,
            success: true
        });

    } catch (error) {
        console.error("UPDATE COMPANY ERROR:", error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};
