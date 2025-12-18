import jwt from "jsonwebtoken";

const isAuthenticated = (req, res, next) => {
    try {
        const token = req.cookies.token;

        console.log("🔐 Authentication Middleware");
        console.log("Cookies received:", Object.keys(req.cookies));
        console.log("Token value:", token ? "✅ Present" : "❌ Missing");

        if (!token) {
            console.log("❌ No token cookie found");
            return res.status(401).json({ message: "Not authenticated", success: false });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.id = decoded.userId;

        console.log("✅ Token verified, userId:", req.id);

        next();
    } catch (error) {
        console.log("❌ Token verification failed:", error.message);
        return res.status(401).json({ message: "Invalid token", success: false });
    }
};

export default isAuthenticated;
