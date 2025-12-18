import jwt from "jsonwebtoken";

/**
 * Optional Authentication Middleware
 * 
 * Unlike isAuthenticated, this middleware:
 * - Does NOT block unauthenticated requests
 * - Sets req.id if user is authenticated
 * - Sets req.id to null if not authenticated
 * - Allows the chatbot to work for both logged-in and guest users
 */
const optionalAuth = (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            // No token - user is not logged in, but that's OK
            req.id = null;
            return next();
        }

        // Try to verify token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.id = decoded.userId;
        next();
    } catch (error) {
        // Invalid token - treat as not logged in
        req.id = null;
        next();
    }
};

export default optionalAuth;
