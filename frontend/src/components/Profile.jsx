import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Bell,
  Contact,
  Mail,
  Pen,
  Lock,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import AppliedJobTable from "./AppliedJobTable";
import SavedJobsTable from "./SavedJobsTable";
import MyResumesTable from "./MyResumesTable";
import { useSelector } from "react-redux";
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";

const Profile = () => {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const isStudent = user?.role === "student";
  const isGoogleUser = user?.authProvider === "google";
  useGetAppliedJobs(isStudent);
  const [savedJobs, setSavedJobs] = useState([]);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showSetPassword, setShowSetPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const workspaceLabel = isStudent
    ? "Student workspace"
    : "Recruiter workspace";

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  // Set password for Google users
  const handleSetPassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match", { duration: 2000 });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters", { duration: 2000 });
      return;
    }

    try {
      setPasswordLoading(true);
      const res = await axios.post(
        `${USER_API_END_POINT}/set-password`,
        {
          newPassword: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword,
        },
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message, { duration: 2000 });
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setShowSetPassword(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to set password", {
        duration: 2000,
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match", { duration: 2000 });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters", { duration: 2000 });
      return;
    }

    try {
      setPasswordLoading(true);
      const res = await axios.post(
        `${USER_API_END_POINT}/change-password`,
        passwordData,
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message, { duration: 1500 });
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setShowChangePassword(false);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to change password",
        { duration: 2000 }
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const res = await axios.get(`${USER_API_END_POINT}/saved-jobs`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setSavedJobs(res.data.savedJobs || []);
        }
      } catch {
        toast.error("Failed to fetch saved jobs", { duration: 1000 });
      }
    };
    if (isStudent) fetchSavedJobs();
  }, [isStudent]);

  const handleRemoveSavedJob = (jobId) => {
    setSavedJobs((prev) => prev.filter((job) => job._id !== jobId));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#121212]">
      <Navbar />

      <section className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] mx-auto max-w-6xl px-4 md:px-6 lg:px-8 py-8">
        <div className="rounded-lg border border-gray-200 bg-white p-8 dark:border-[#444444] dark:bg-[#0d0d0d]">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              <Avatar className="h-20 w-20 rounded-full border border-gray-200 bg-gray-50 dark:border-[#444444] dark:bg-[#1a1a1a]">
                <AvatarImage
                  src={
                    user?.profile?.profilePhoto ||
                    "https://www.istockphoto.com/photos/placeholder-image"
                  }
                />
              </Avatar>

              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-[#888888]">
                  {workspaceLabel}
                </p>
                <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-[#E0E0E0]">
                  {user?.fullname}
                </h1>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-600 dark:text-[#B0B0B0]">
                  {user?.profile?.bio || "No bio added"}
                </p>
              </div>
            </div>

            <Button
              onClick={() => navigate("/profile/edit")}
              variant="ghost"
              className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 dark:border-[#444444] dark:bg-[#121212] dark:text-[#E0E0E0] dark:hover:bg-[#1a1a1a] transition-colors"
            >
              <Pen className="h-4 w-4" />
              <span className="hidden sm:inline">Edit profile</span>
            </Button>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 dark:border-[#444444] dark:bg-[#1a1a1a] dark:text-[#B0B0B0]">
              <Mail className="h-4 w-4" />
              <span>{user?.email}</span>
            </div>
            <div className="flex items-center gap-3 rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 dark:border-[#444444] dark:bg-[#1a1a1a] dark:text-[#B0B0B0]">
              <Contact className="h-4 w-4" />
              <span>{user?.phoneNumber}</span>
            </div>
          </div>
          {/* Password Section - Set Password for Google users, Change Password for others */}
          <div className="mt-6 border-t border-gray-200 pt-6 dark:border-[#444444]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-gray-500 dark:text-[#888888]" />
                <h3 className="text-sm font-semibold text-gray-900 dark:text-[#E0E0E0]">
                  Password & Security
                </h3>
                {isGoogleUser && (
                  <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    Google Account
                  </span>
                )}
              </div>
              {isGoogleUser ? (
                <Button
                  onClick={() => setShowSetPassword(!showSetPassword)}
                  variant="ghost"
                  size="sm"
                  className="text-sm text-gray-600 hover:text-gray-900 dark:text-[#888888] dark:hover:text-[#E0E0E0]"
                >
                  {showSetPassword ? "Cancel" : "Set Password"}
                </Button>
              ) : (
                <Button
                  onClick={() => setShowChangePassword(!showChangePassword)}
                  variant="ghost"
                  size="sm"
                  className="text-sm text-gray-600 hover:text-gray-900 dark:text-[#888888] dark:hover:text-[#E0E0E0]"
                >
                  {showChangePassword ? "Cancel" : "Change Password"}
                </Button>
              )}
            </div>

            {/* Set Password Form for Google Users */}
            {isGoogleUser && showSetPassword && (
              <form onSubmit={handleSetPassword} className="mt-4 space-y-4">
                <p className="text-sm text-gray-600 dark:text-[#888888]">
                  Set a password to also login with your email and password in
                  addition to Google.
                </p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-700 dark:text-[#B0B0B0]">
                      New Password
                    </Label>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter password (min 6 characters)"
                        className="h-10 pr-10 rounded-md border border-gray-200 bg-white text-sm dark:border-[#444444] dark:bg-[#1a1a1a] dark:text-[#E0E0E0]"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-[#888888] dark:hover:text-[#B0B0B0]"
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-700 dark:text-[#B0B0B0]">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="Confirm password"
                        className="h-10 pr-10 rounded-md border border-gray-200 bg-white text-sm dark:border-[#444444] dark:bg-[#1a1a1a] dark:text-[#E0E0E0]"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-[#888888] dark:hover:text-[#B0B0B0]"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={passwordLoading}
                    className="h-10 rounded-md bg-gray-900 px-6 text-sm text-white hover:bg-gray-800 dark:bg-[#E0E0E0] dark:text-[#121212] dark:hover:bg-[#B0B0B0]"
                  >
                    {passwordLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Setting...
                      </>
                    ) : (
                      "Set Password"
                    )}
                  </Button>
                </div>
              </form>
            )}

            {/* Change Password Form for Regular Users */}
            {!isGoogleUser && showChangePassword && (
              <form onSubmit={handleChangePassword} className="mt-4 space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-700 dark:text-[#B0B0B0]">
                      Current Password
                    </Label>
                    <div className="relative">
                      <Input
                        type={showCurrentPassword ? "text" : "password"}
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter current password"
                        className="h-10 pr-10 rounded-md border border-gray-200 bg-white text-sm dark:border-[#444444] dark:bg-[#1a1a1a] dark:text-[#E0E0E0]"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-[#888888] dark:hover:text-[#B0B0B0]"
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-700 dark:text-[#B0B0B0]">
                      New Password
                    </Label>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter new password"
                        className="h-10 pr-10 rounded-md border border-gray-200 bg-white text-sm dark:border-[#444444] dark:bg-[#1a1a1a] dark:text-[#E0E0E0]"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-[#888888] dark:hover:text-[#B0B0B0]"
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-700 dark:text-[#B0B0B0]">
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="Confirm new password"
                        className="h-10 pr-10 rounded-md border border-gray-200 bg-white text-sm dark:border-[#444444] dark:bg-[#1a1a1a] dark:text-[#E0E0E0]"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-[#888888] dark:hover:text-[#B0B0B0]"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={passwordLoading}
                    className="h-10 rounded-md bg-gray-900 px-6 text-sm text-white hover:bg-gray-800 dark:bg-[#E0E0E0] dark:text-[#121212] dark:hover:bg-[#B0B0B0]"
                  >
                    {passwordLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Password"
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>

          {user?.role !== "recruiter" && user?.profile?.location && (
            <div className="mt-4">
              <div className="flex items-center gap-3 rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 dark:border-[#444444] dark:bg-[#1a1a1a] dark:text-[#B0B0B0]">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>{user.profile.location}</span>
              </div>
            </div>
          )}
          {/* Recruiter-specific information */}
          {user?.role === "recruiter" && (
            <div className="mt-6 space-y-4">
              <div className="border-t border-gray-200 pt-6 dark:border-[#444444]">
                <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-[#E0E0E0]">
                  Professional Information
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {user?.profile?.designation && (
                    <div className="flex items-center gap-3 rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm dark:border-[#444444] dark:bg-[#1a1a1a]">
                      <span className="font-medium text-gray-500 dark:text-[#888888]">
                        Designation:
                      </span>
                      <span className="text-gray-700 dark:text-[#B0B0B0]">
                        {user.profile.designation}
                      </span>
                    </div>
                  )}
                  {user?.profile?.yearsOfExperience && (
                    <div className="flex items-center gap-3 rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm dark:border-[#444444] dark:bg-[#1a1a1a]">
                      <span className="font-medium text-gray-500 dark:text-[#888888]">
                        Experience:
                      </span>
                      <span className="text-gray-700 dark:text-[#B0B0B0]">
                        {user.profile.yearsOfExperience} years
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {(user?.profile?.companyName ||
                user?.profile?.companyWebsite ||
                user?.profile?.companyEmail ||
                user?.profile?.companyLocation) && (
                <div className="border-t border-gray-200 pt-6 dark:border-[#444444]">
                  <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-[#E0E0E0]">
                    Company Information
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {user?.profile?.companyName && (
                      <div className="flex items-center gap-3 rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm dark:border-[#444444] dark:bg-[#1a1a1a]">
                        <span className="font-medium text-gray-500 dark:text-[#888888]">
                          Company:
                        </span>
                        <span className="text-gray-700 dark:text-[#B0B0B0]">
                          {user.profile.companyName}
                        </span>
                      </div>
                    )}
                    {user?.profile?.companyLocation && (
                      <div className="flex items-center gap-3 rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm dark:border-[#444444] dark:bg-[#1a1a1a]">
                        <span className="font-medium text-gray-500 dark:text-[#888888]">
                          Location:
                        </span>
                        <span className="text-gray-700 dark:text-[#B0B0B0]">
                          {user.profile.companyLocation}
                        </span>
                      </div>
                    )}
                    {user?.profile?.companyEmail && (
                      <div className="flex items-center gap-3 rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm dark:border-[#444444] dark:bg-[#1a1a1a]">
                        <Mail className="h-4 w-4 text-gray-500 dark:text-[#888888]" />
                        <span className="text-gray-700 dark:text-[#B0B0B0]">
                          {user.profile.companyEmail}
                        </span>
                      </div>
                    )}
                    {user?.profile?.companyWebsite && (
                      <div className="flex items-center gap-3 rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm dark:border-[#444444] dark:bg-[#1a1a1a]">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                          />
                        </svg>
                        <a
                          href={user.profile.companyWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-900 hover:underline dark:text-gray-400"
                        >
                          Company Website
                        </a>
                      </div>
                    )}
                  </div>
                  {user?.profile?.companyDescription && (
                    <div className="mt-4 rounded-md border border-gray-200 bg-gray-50 px-4 py-3 dark:border-[#444444] dark:bg-[#1a1a1a]">
                      <p className="text-sm font-medium text-gray-500 dark:text-[#888888]">
                        About Company
                      </p>
                      <p className="mt-2 text-sm text-gray-700 dark:text-[#B0B0B0]">
                        {user.profile.companyDescription}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 dark:border-[#444444] dark:bg-[#1a1a1a] dark:text-[#B0B0B0]">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
              </svg>
              {user?.profile?.linkedinUrl ? (
                <a
                  href={user.profile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 hover:underline dark:text-gray-400"
                >
                  LinkedIn Profile
                </a>
              ) : (
                <span className="text-gray-500 dark:text-[#888888]">
                  Not added
                </span>
              )}
            </div>
            {user?.role !== "recruiter" && (
              <div className="flex items-center gap-3 rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 dark:border-[#444444] dark:bg-[#1a1a1a] dark:text-[#B0B0B0]">
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
                </svg>
                {user?.profile?.githubUrl ? (
                  <a
                    href={user.profile.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-900 hover:underline dark:text-gray-400"
                  >
                    GitHub Profile
                  </a>
                ) : (
                  <span className="text-gray-500 dark:text-[#888888]">
                    Not added
                  </span>
                )}
              </div>
            )}
          </div>
          {user?.role !== "recruiter" && (
            <div className="mt-8">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-[#E0E0E0]">
                Skills
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {user?.profile?.skills?.length ? (
                  user.profile.skills.map((skill, i) => (
                    <Badge
                      key={i}
                      className="rounded-md border border-gray-200 bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:border-[#444444] dark:bg-[#1a1a1a] dark:text-[#B0B0B0]"
                    >
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-gray-500 dark:text-[#888888]">
                    No skills added
                  </span>
                )}
              </div>
            </div>
          )}
          {user?.role !== "recruiter" && (
            <div className="mt-8 border-t border-gray-200 pt-6 dark:border-[#444444]">
              <Label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-[#E0E0E0]">
                Resume
              </Label>
              {user?.profile?.resume ? (
                <a
                  href={`${USER_API_END_POINT}/download-resume/${user?._id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-gray-900 hover:underline dark:text-[#E0E0E0]"
                >
                  {user.profile.resumeOriginalName}
                </a>
              ) : (
                <span className="text-sm text-gray-500 dark:text-[#888888]">
                  No resume uploaded
                </span>
              )}
            </div>
          )}
        </div>

        {isStudent && user?.notifications?.length > 0 && (
          <div className="mt-8 rounded-lg border border-gray-200 bg-white p-8 dark:border-[#444444] dark:bg-[#121212]">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 bg-gray-50 dark:border-[#444444] dark:bg-[#121212]">
                <Bell className="h-4 w-4 text-gray-700 dark:text-[#B0B0B0]" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-[#888888]">
                  Inbox
                </p>
                <h2 className="text-lg font-bold text-gray-900 dark:text-[#E0E0E0]">
                  Notifications
                </h2>
              </div>
            </div>

            <div className="space-y-3">
              {user.notifications.slice(0, 10).map((n, i) => (
                <div
                  key={i}
                  className="rounded-md border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700 dark:border-[#444444] dark:bg-[#121212] dark:text-[#B0B0B0]"
                >
                  <p className="font-semibold text-gray-900 dark:text-[#E0E0E0]">
                    {n.message}
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-[#888888]">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {isStudent && (
          <div className="mt-8 rounded-lg border border-gray-200 bg-white p-8 dark:border-[#444444] dark:bg-[#121212]">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-[#E0E0E0]">
                Applied Jobs
              </h2>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-[#888888]">
                Recent activity
              </p>
            </div>
            <div className="mt-6 overflow-x-auto">
              <AppliedJobTable />
            </div>
          </div>
        )}

        {isStudent && (
          <div className="mt-8 rounded-lg border border-gray-200 bg-white p-8 dark:border-[#444444] dark:bg-[#121212]">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-[#E0E0E0]">
                Saved Jobs
              </h2>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-[#888888]">
                Bookmarked
              </p>
            </div>
            <SavedJobsTable
              className="mt-6"
              savedJobs={savedJobs}
              onRemove={handleRemoveSavedJob}
            />
          </div>
        )}

        {isStudent && (
          <div className="mt-8 rounded-lg border border-gray-200 bg-white p-8 dark:border-[#444444] dark:bg-[#121212]">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-[#E0E0E0]">
                My Resumes
              </h2>
              <Button
                onClick={() => navigate("/resume-builder")}
                variant="default"
                size="sm"
              >
                Create Resume
              </Button>
            </div>
            <div className="mt-6 overflow-x-auto">
              <MyResumesTable />
            </div>
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default Profile;
