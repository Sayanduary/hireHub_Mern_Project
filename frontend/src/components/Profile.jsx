import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./shared/Navbar";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Bell, Contact, Mail, Pen } from "lucide-react";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import AppliedJobTable from "./AppliedJobTable";
import SavedJobsTable from "./SavedJobsTable";
import { useSelector } from "react-redux";
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";

const Profile = () => {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const isStudent = user?.role === "student";
  useGetAppliedJobs(isStudent);
  const [savedJobs, setSavedJobs] = useState([]);
  const workspaceLabel = isStudent
    ? "Student workspace"
    : "Recruiter workspace";

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
        toast.error("Failed to fetch saved jobs");
      }
    };
    if (isStudent) fetchSavedJobs();
  }, [isStudent]);

  const handleRemoveSavedJob = (jobId) => {
    setSavedJobs((prev) => prev.filter((job) => job._id !== jobId));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <section className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8 py-8">
        <div className="rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-950">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              <Avatar className="h-20 w-20 rounded-full border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
                <AvatarImage
                  src={
                    user?.profile?.profilePhoto ||
                    "https://www.istockphoto.com/photos/placeholder-image"
                  }
                />
              </Avatar>

              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {workspaceLabel}
                </p>
                <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                  {user?.fullname}
                </h1>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  {user?.profile?.bio || "No bio added"}
                </p>
              </div>
            </div>

            <Button
              onClick={() => navigate("/profile/edit")}
              variant="ghost"
              className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100 dark:hover:bg-gray-900 transition-colors"
            >
              <Pen className="h-4 w-4" />
              <span className="hidden sm:inline">Edit profile</span>
            </Button>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
              <Mail className="h-4 w-4" />
              <span>{user?.email}</span>
            </div>
            <div className="flex items-center gap-3 rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
              <Contact className="h-4 w-4" />
              <span>{user?.phoneNumber}</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
              </svg>
              {user?.profile?.linkedinUrl ? (
                <a
                  href={user.profile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  LinkedIn Profile
                </a>
              ) : (
                <span className="text-gray-500 dark:text-gray-400">Not added</span>
              )}
            </div>
            <div className="flex items-center gap-3 rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
              </svg>
              {user?.profile?.githubUrl ? (
                <a
                  href={user.profile.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  GitHub Profile
                </a>
              ) : (
                <span className="text-gray-500 dark:text-gray-400">Not added</span>
              )}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Skills
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {user?.profile?.skills?.length ? (
                user.profile.skills.map((skill, i) => (
                  <Badge
                    key={i}
                    className="rounded-md border border-gray-200 bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
                  >
                    {skill}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  No skills added
                </span>
              )}
            </div>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-800">
            <Label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-gray-100">
              Resume
            </Label>
            {user?.profile?.resume ? (
              <a
                href={`${USER_API_END_POINT}/download-resume/${user?._id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-900 hover:underline dark:text-gray-100"
              >
                {user.profile.resumeOriginalName}
              </a>
            ) : (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                No resume uploaded
              </span>
            )}
          </div>
        </div>

        {isStudent && user?.notifications?.length > 0 && (
          <div className="mt-8 rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-950">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
                <Bell className="h-4 w-4 text-gray-700 dark:text-gray-300" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Inbox
                </p>
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  Notifications
                </h2>
              </div>
            </div>

            <div className="space-y-3">
              {user.notifications.slice(0, 10).map((n, i) => (
                <div
                  key={i}
                  className="rounded-md border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
                >
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {n.message}
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {isStudent ? (
          <div className="mt-8 rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-950">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Applied Jobs
              </h2>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Recent activity
              </p>
            </div>
            <div className="mt-6 overflow-x-auto">
              <AppliedJobTable />
            </div>
          </div>
        ) : (
          <div className="mt-8 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-sm leading-6 text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
            <p className="font-semibold text-gray-900 dark:text-gray-100">
              Manage openings from your admin dashboard
            </p>
            <p className="mt-2">
              Recruiter actions like posting jobs, reviewing applicants, and
              editing company details live inside the admin workspace. Use the
              navigation above to jump back when needed.
            </p>
          </div>
        )}

        {isStudent && (
          <div className="mt-8 rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-950">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Saved Jobs
              </h2>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
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
      </section>
    </div>
  );
};

export default Profile;
