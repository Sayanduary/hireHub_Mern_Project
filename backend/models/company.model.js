import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: { type: String },
        website: { type: String },
        location: { type: String },
        logo: { type: String }, // Cloudinary URL
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    { timestamps: true }
);

// Create compound unique index on name and userId
companySchema.index({ name: 1, userId: 1 }, { unique: true });

export const Company = mongoose.model("Company", companySchema);
