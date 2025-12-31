import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import connectDB from "./utils/db.js";
import configurePassport from "./utils/passport.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import atsRoute from "./routes/ats.route.js";
import resumeRoute from "./routes/resume.route.js";
import chatbotRoute from "./routes/chatbot.route.js";

dotenv.config({});

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session middleware for Passport
app.use(
    session({
        secret: process.env.SECRET_KEY || "your-secret-key",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false, // Set to true in production with HTTPS
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000
        }
    })
);

// Configure and initialize Passport
const passport = configurePassport();
app.use(passport.initialize());
app.use(passport.session());

const corsOptions = {
    origin: "https://hirehub-liart.vercel.app/",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['set-cookie'],
}

app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;


// api's
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use("/api/v1/ats", atsRoute);
app.use("/api/v1/resume", resumeRoute);
app.use("/api/v1/chatbot", chatbotRoute);



app.listen(PORT, () => {
    connectDB();
    console.log(`Server running at port ${PORT}`);
})