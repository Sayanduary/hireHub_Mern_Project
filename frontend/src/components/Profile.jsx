import React, { useState, useEffect } from "react";
import Navbar from "./shared/Navbar";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Bell, Contact, Mail, Pen } from "lucide-react";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import AppliedJobTable from "./AppliedJobTable";
import SavedJobsTable from "./SavedJobsTable";
import UpdateProfileDialog from "./UpdateProfileDialog";
import { useSelector } from "react-redux";
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";

const Profile = () => {
  useGetAppliedJobs();
  const [open, setOpen] = useState(false);
  const [savedJobs, setSavedJobs] = useState([]);
  const { user } = useSelector((store) => store.auth);

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
    if (user?.role === "student") fetchSavedJobs();
  }, [user]);

  const handleRemoveSavedJob = (jobId) => {
    setSavedJobs((prev) => prev.filter((job) => job._id !== jobId));
  };

  return (
    <div className="min-h-screen bg-[#F8F7F3] text-neutral-900 transition-colors dark:bg-neutral-950 dark:text-neutral-50">
      <Navbar />

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <div className="rounded-3xl border border-neutral-200/80 bg-white/80 p-8 shadow-none backdrop-blur-sm dark:border-white/10 dark:bg-neutral-900/90">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              <Avatar className="h-20 w-20 border border-neutral-200/80 bg-white/70 dark:border-white/10 dark:bg-white/5">
                <AvatarImage
                  src={
                    user?.profile?.profilePhoto ||
                    "https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg"
                  }
                />
              </Avatar>

              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
                  Student workspace
                </p>
                <h1 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
                  {user?.fullname}
                </h1>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                  {user?.profile?.bio || "No bio added"}
                </p>
              </div>
            </div>

            <Button
              onClick={() => setOpen(true)}
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl border border-neutral-200/80 bg-white text-neutral-900 transition-colors hover:border-neutral-400 hover:bg-neutral-50 dark:border-white/10 dark:bg-white/5 dark:text-neutral-50 dark:hover:border-white/20 dark:hover:bg-white/10"
            >
              <Pen className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-2xl border border-neutral-200/80 bg-white/60 px-4 py-3 text-sm text-neutral-600 dark:border-white/10 dark:bg-white/5 dark:text-neutral-300">
              <Mail className="h-4 w-4" />
              <span>{user?.email}</span>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-neutral-200/80 bg-white/60 px-4 py-3 text-sm text-neutral-600 dark:border-white/10 dark:bg-white/5 dark:text-neutral-300">
              <Contact className="h-4 w-4" />
              <span>{user?.phoneNumber}</span>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
              Skills
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {user?.profile?.skills?.length ? (
                user.profile.skills.map((skill, i) => (
                  <Badge
                    key={i}
                    className="rounded-full border border-neutral-200/80 bg-transparent px-3 py-1 text-xs font-medium text-neutral-600 dark:border-white/15 dark:text-neutral-200"
                  >
                    {skill}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-neutral-500 dark:text-neutral-400">
                  No skills added
                </span>
              )}
            </div>
          </div>

          <div className="mt-10 border-t border-neutral-200/80 pt-6 dark:border-white/10">
            <Label className="mb-2 block text-xs font-medium uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
              Resume
            </Label>
            {user?.profile?.resume ? (
              <a
                href={`${USER_API_END_POINT}/download-resume/${user?._id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-neutral-800 underline-offset-4 hover:underline dark:text-neutral-200"
              >
                {user.profile.resumeOriginalName}
              </a>
            ) : (
              <span className="text-sm text-neutral-500 dark:text-neutral-400">
                No resume uploaded
              </span>
            )}
          </div>
        </div>

        {user?.role === "student" && user?.notifications?.length > 0 && (
          <div className="mt-10 rounded-3xl border border-neutral-200/80 bg-white/70 p-8 shadow-none backdrop-blur-sm dark:border-white/10 dark:bg-neutral-900/90">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200/80 bg-white dark:border-white/10 dark:bg-white/10">
                <Bell className="h-4 w-4 text-neutral-600 dark:text-neutral-200" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
                  Inbox
                </p>
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                  Notifications
                </h2>
              </div>
            </div>

            <div className="space-y-3">
              {user.notifications.slice(0, 10).map((n, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-neutral-200/80 bg-white/60 p-4 text-sm text-neutral-600 dark:border-white/10 dark:bg-white/5 dark:text-neutral-300"
                >
                  <p className="font-medium text-neutral-800 dark:text-neutral-100">
                    {n.message}
                  </p>
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10 rounded-3xl border border-neutral-200/80 bg-white/80 p-8 shadow-none backdrop-blur-sm dark:border-white/10 dark:bg-neutral-900/90">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
              Applied Jobs
            </h2>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500">
              Recent activity
            </p>
          </div>
          <div className="mt-6 overflow-x-auto">
            <AppliedJobTable />
          </div>
        </div>

        {user?.role === "student" && (
          <div className="mt-10 rounded-3xl border border-neutral-200/80 bg-white/80 p-8 shadow-none backdrop-blur-sm dark:border-white/10 dark:bg-neutral-900/90">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                Saved Jobs
              </h2>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500">
                Bookmark queue
              </p>
            </div>
            <SavedJobsTable
              className="mt-6"
              savedJobs={savedJobs}
              onRemove={handleRemoveSavedJob}
            />
          </div>
        )}

        <UpdateProfileDialog open={open} setOpen={setOpen} />
      </section>
    </div>
  );
};

export default Profile;
