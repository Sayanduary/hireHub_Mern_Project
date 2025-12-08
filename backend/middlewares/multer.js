import multer from "multer";

const storage = multer.memoryStorage();

export const singleUpload = multer({ storage }).single("profilePhoto");
export const resumeUpload = multer({ storage }).single("resume");
