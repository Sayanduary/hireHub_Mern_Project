import express from "express";
import { login, logout, register, updateProfile, saveJob, getSavedJobs, downloadResume, googleCallback, googleLogin, changePassword, setPassword, getProfile } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload, multipleUpload } from "../middlewares/multer.js";
import passport from "passport";

const router = express.Router();

router.route("/register").post(singleUpload, register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile").get(isAuthenticated, getProfile);
router.route("/profile/update").post(isAuthenticated, multipleUpload, updateProfile);
router.route("/change-password").post(isAuthenticated, changePassword);
router.route("/set-password").post(isAuthenticated, setPassword);
router.route("/save-job/:id").post(isAuthenticated, saveJob);
router.route("/saved-jobs").get(isAuthenticated, getSavedJobs);
router.route("/download-resume/:userId").get(isAuthenticated, downloadResume);

// Google OAuth routes - pass role in state parameter
router.route("/auth/google").get((req, res, next) => {
  const role = req.query.role || 'student';
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: role
  })(req, res, next);
});
router.route("/auth/google/callback").get(passport.authenticate("google", { failureRedirect: "/login" }), googleCallback);
router.route("/google/login").get(googleLogin);

export default router;

