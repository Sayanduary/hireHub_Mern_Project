import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  APPLICATION_API_END_POINT,
  JOB_API_END_POINT,
  USER_API_END_POINT,
} from "@/utils/constant";
import { setSingleJob } from "@/redux/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import Navbar from "./shared/Navbar";
import { Bookmark } from "lucide-react";

const JobDescription = () => {
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);

  // Check if user has already applied - handle both populated and non-populated applications
  const isIntiallyApplied =
    singleJob?.applications?.some((application) => {
      if (typeof application === "string") {
        // Application is just an ID
        return false; // Can't check without applicant info
      }
      // Application is an object with applicant property
      return application.applicant === user?._id;
    }) || false;

  const [isApplied, setIsApplied] = useState(isIntiallyApplied);
  const [isSaved, setIsSaved] = useState(false);

  const params = useParams();
  const jobId = params.id;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const applyJobHandler = async () => {
    if (!user) {
      toast.error("Please login to apply for this job");
      navigate("/login");
      return;
    }
    try {
      console.log("Applying for job:", jobId, "User ID:", user?._id);
      const res = await axios.get(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        { withCredentials: true }
      );

      console.log("Apply response:", res.data);
      if (res.data.success) {
        setIsApplied(true); // Update the local state

        // Update the singleJob in Redux with the new application
        // We add just the ID for now, but on next fetch it will be fully populated
        const newAppObj = res.data.application || {
          _id: res.data._id,
          applicant: user?._id,
          status: "pending",
        };
        const updatedSingleJob = {
          ...singleJob,
          applications: [...(singleJob.applications || []), newAppObj],
        };
        dispatch(setSingleJob(updatedSingleJob));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error("Apply job error:", error);
      toast.error(error.response?.data?.message || "Failed to apply for job");
    }
  };

  const saveJobHandler = async () => {
    if (!user) {
      toast.error("Please login to save this job");
      navigate("/login");
      return;
    }
    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/save-job/${jobId}`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        setIsSaved(!isSaved);
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Error saving job");
    }
  };

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          console.log("Fetched job applications:", res.data.job.applications);

          // Check if user has applied - applications might be IDs or objects
          const hasApplied = res.data.job.applications.some((application) => {
            if (typeof application === "string") {
              // If it's just an ID, we can't determine if the user applied
              return false;
            }
            // If it's an object with applicant property
            return application.applicant === user?._id;
          });

          setIsApplied(hasApplied);

          // Check if job is saved
          setIsSaved(user?.savedJobs?.includes(jobId) || false);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSingleJob();
  }, [jobId, dispatch, user?._id, user?.savedJobs]);

  return (
    <>
      <Navbar />
      <section className="bg-[#F8F7F3] text-neutral-900 transition-colors dark:bg-[#0a0a0a] dark:text-neutral-50">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <article className="rounded-3xl border border-neutral-200/70 bg-white/80 p-8 shadow-none backdrop-blur-sm transition-colors dark:border-white/10 dark:bg-[#0a0a0a]/90">
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div className="space-y-4">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
                    Opportunity overview
                  </p>
                  <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
                    {singleJob?.title}
                  </h1>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="rounded-full border bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-900 dark:border-white/20 dark:bg-white/10 dark:text-neutral-100">
                      {singleJob?.position} roles
                    </Badge>
                    <Badge className="rounded-full border bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-900 dark:border-white/20 dark:bg-white/10 dark:text-neutral-100">
                      {singleJob?.jobType}
                    </Badge>
                    <Badge className="rounded-full border bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-900 dark:border-white/20 dark:bg-white/10 dark:text-neutral-100">
                      ₹ {singleJob?.salary} LPA
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-col items-stretch gap-3 sm:flex-row md:flex-col md:items-end">
                  <Button
                    onClick={saveJobHandler}
                    variant="ghost"
                    className={`h-11 rounded-xl border text-sm font-medium transition-colors sm:w-40 md:w-48 ${
                      isSaved
                        ? "border-neutral-900 bg-neutral-900 text-neutral-100 hover:bg-neutral-800 dark:border-transparent dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100"
                        : "border-neutral-200/70 bg-white/70 text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50 dark:border-white/15 dark:bg-transparent dark:text-neutral-200 dark:hover:border-white/25 dark:hover:bg-white/10"
                    }`}
                  >
                    <Bookmark className="mr-2 h-4 w-4" />
                    {isSaved ? "Saved" : "Save for later"}
                  </Button>
                  <Button
                    onClick={isApplied ? undefined : applyJobHandler}
                    disabled={isApplied}
                    className="h-11 rounded-xl border border-neutral-900 bg-neutral-900 text-sm font-medium text-neutral-100 transition-colors hover:bg-neutral-800 disabled:border-neutral-200 disabled:bg-neutral-200 disabled:text-neutral-500 disabled:opacity-100 dark:border-transparent dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 dark:disabled:bg-white/10 dark:disabled:text-neutral-500"
                  >
                    {isApplied ? "Already applied" : "Apply now"}
                  </Button>
                </div>
              </div>

              <div className="mt-10 space-y-8">
                <section>
                  <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
                    Description
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                    {singleJob?.description}
                  </p>
                </section>

                <section>
                  <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
                    Role snapshot
                  </h2>
                  <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-neutral-200/70 bg-white/70 px-4 py-3 text-sm text-neutral-600 dark:border-white/10 dark:bg-white/5 dark:text-neutral-300">
                      <dt className="text-xs uppercase tracking-[0.18em] text-neutral-400 dark:text-neutral-500">
                        Title
                      </dt>
                      <dd className="mt-1 text-neutral-800 dark:text-neutral-100">
                        {singleJob?.title}
                      </dd>
                    </div>
                    <div className="rounded-2xl border border-neutral-200/70 bg-white/70 px-4 py-3 text-sm text-neutral-600 dark:border-white/10 dark:bg-white/5 dark:text-neutral-300">
                      <dt className="text-xs uppercase tracking-[0.18em] text-neutral-400 dark:text-neutral-500">
                        Location
                      </dt>
                      <dd className="mt-1 text-neutral-800 dark:text-neutral-100">
                        {singleJob?.location}
                      </dd>
                    </div>
                    <div className="rounded-2xl border border-neutral-200/70 bg-white/70 px-4 py-3 text-sm text-neutral-600 dark:border-white/10 dark:bg-white/5 dark:text-neutral-300">
                      <dt className="text-xs uppercase tracking-[0.18em] text-neutral-400 dark:text-neutral-500">
                        Experience
                      </dt>
                      <dd className="mt-1 text-neutral-800 dark:text-neutral-100">
                        {singleJob?.experienceLevel} yrs
                      </dd>
                    </div>
                    <div className="rounded-2xl border border-neutral-200/70 bg-white/70 px-4 py-3 text-sm text-neutral-600 dark:border-white/10 dark:bg-white/5 dark:text-neutral-300">
                      <dt className="text-xs uppercase tracking-[0.18em] text-neutral-400 dark:text-neutral-500">
                        Total applicants
                      </dt>
                      <dd className="mt-1 text-neutral-800 dark:text-neutral-100">
                        {singleJob?.applications?.length}
                      </dd>
                    </div>
                    <div className="rounded-2xl border border-neutral-200/70 bg-white/70 px-4 py-3 text-sm text-neutral-600 dark:border-white/10 dark:bg-white/5 dark:text-neutral-300">
                      <dt className="text-xs uppercase tracking-[0.18em] text-neutral-400 dark:text-neutral-500">
                        Salary
                      </dt>
                      <dd className="mt-1 text-neutral-800 dark:text-neutral-100">
                        {singleJob?.salary} LPA
                      </dd>
                    </div>
                    <div className="rounded-2xl border border-neutral-200/70 bg-white/70 px-4 py-3 text-sm text-neutral-600 dark:border-white/10 dark:bg-white/5 dark:text-neutral-300">
                      <dt className="text-xs uppercase tracking-[0.18em] text-neutral-400 dark:text-neutral-500">
                        Posted
                      </dt>
                      <dd className="mt-1 text-neutral-800 dark:text-neutral-100">
                        {singleJob?.createdAt.split("T")[0]}
                      </dd>
                    </div>
                  </dl>
                </section>
              </div>
            </article>

            <aside className="flex flex-col gap-6">
              <div className="rounded-3xl border border-neutral-200/70 bg-white/80 p-6 text-sm text-neutral-600 shadow-none backdrop-blur-sm transition-colors dark:border-white/10 dark:bg-[#0a0a0a]/90 dark:text-neutral-300">
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
                  Application status
                </h3>
                <p className="mt-3 text-neutral-600 dark:text-neutral-300">
                  {isApplied
                    ? "You have already submitted your application for this role."
                    : "Complete your profile and apply to share your portfolio with the hiring team."}
                </p>
              </div>

              <div className="rounded-3xl border border-neutral-200/70 bg-white/80 p-6 text-sm text-neutral-600 shadow-none backdrop-blur-sm transition-colors dark:border-white/10 dark:bg-[#0a0a0a]/90 dark:text-neutral-300">
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
                  Why this role
                </h3>
                <ul className="mt-3 space-y-2 text-neutral-600 dark:text-neutral-300">
                  <li>• Collaborate with teams operating at global scale.</li>
                  <li>• Build within a product-first organization.</li>
                  <li>• Access a streamlined hiring workflow.</li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
};

export default JobDescription;
