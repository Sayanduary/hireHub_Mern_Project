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
import { addAppliedJobId } from "@/redux/applicationSlice";
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";

const JobDescription = () => {
  useGetAppliedJobs(); // Fetch applied jobs to sync state

  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const { appliedJobIds } = useSelector((store) => store.application);

  const [isSaved, setIsSaved] = useState(false);

  const params = useParams();
  const jobId = params.id;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Check if user has already applied using centralized Redux state
  const isApplied = appliedJobIds.includes(jobId);

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
        // Update centralized Redux state immediately
        dispatch(addAppliedJobId(jobId));

        // Update the singleJob in Redux with the new application
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
      const errorData = error.response?.data;
      
      // Check if profile is incomplete
      if (errorData?.profileIncomplete) {
        toast.error(errorData.message || "Complete your profile to apply for jobs");
        
        // Show missing fields
        if (errorData.missingFields && errorData.missingFields.length > 0) {
          setTimeout(() => {
            toast.info(`Missing: ${errorData.missingFields.join(", ")}`);
          }, 500);
        }
        
        // Redirect to profile page after a short delay
        setTimeout(() => {
          navigate("/profile");
        }, 1500);
      } else {
        toast.error(errorData?.message || "Failed to apply for job");
      }
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
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-8">
          <div className="grid gap-6 lg:grid-cols-3">
            <article className="lg:col-span-2 rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-950">
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div className="space-y-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Job Details
                  </p>
                  <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                    {singleJob?.title}
                  </h1>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="rounded-md border border-gray-200 bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
                      {singleJob?.position} roles
                    </Badge>
                    <Badge className="rounded-md border border-gray-200 bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
                      {singleJob?.jobType}
                    </Badge>
                    <Badge className="rounded-md border border-gray-200 bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
                      ₹ {singleJob?.salary} LPA
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-col items-stretch gap-3 sm:flex-row md:flex-col md:items-end">
                  <Button
                    onClick={saveJobHandler}
                    variant="ghost"
                    className={`h-10 rounded-md border text-sm font-medium transition-colors sm:w-40 md:w-48 ${
                      isSaved
                        ? "border-gray-900 bg-gray-900 text-white hover:bg-gray-800 dark:border-gray-100 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300 dark:hover:bg-gray-900"
                    }`}
                  >
                    <Bookmark className="mr-2 h-4 w-4" />
                    {isSaved ? "Saved" : "Save for later"}
                  </Button>
                  <Button
                    onClick={isApplied ? undefined : applyJobHandler}
                    disabled={isApplied}
                    className="h-10 rounded-md bg-gray-900 text-sm font-medium text-white hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-500 disabled:opacity-100 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200 dark:disabled:bg-gray-800 dark:disabled:text-gray-500"
                  >
                    {isApplied ? "Already applied" : "Apply now"}
                  </Button>
                </div>
              </div>

              <div className="mt-8 space-y-8">
                <section>
                  <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Description
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                    {singleJob?.description}
                  </p>
                </section>

                <section>
                  <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Job Overview
                  </h2>
                  <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
                      <dt className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Title
                      </dt>
                      <dd className="mt-1 font-medium text-gray-900 dark:text-gray-100">
                        {singleJob?.title}
                      </dd>
                    </div>
                    <div className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
                      <dt className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Location
                      </dt>
                      <dd className="mt-1 font-medium text-gray-900 dark:text-gray-100">
                        {singleJob?.location}
                      </dd>
                    </div>
                    <div className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
                      <dt className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Experience
                      </dt>
                      <dd className="mt-1 font-medium text-gray-900 dark:text-gray-100">
                        {singleJob?.experienceLevel} yrs
                      </dd>
                    </div>
                    <div className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
                      <dt className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Total applicants
                      </dt>
                      <dd className="mt-1 font-medium text-gray-900 dark:text-gray-100">
                        {singleJob?.applications?.length}
                      </dd>
                    </div>
                    <div className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
                      <dt className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Salary
                      </dt>
                      <dd className="mt-1 font-medium text-gray-900 dark:text-gray-100">
                        {singleJob?.salary} LPA
                      </dd>
                    </div>
                    <div className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
                      <dt className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Posted
                      </dt>
                      <dd className="mt-1 font-medium text-gray-900 dark:text-gray-100">
                        {singleJob?.createdAt.split("T")[0]}
                      </dd>
                    </div>
                  </dl>
                </section>
              </div>
            </article>

            <aside className="flex flex-col gap-6">
              <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Application status
                </h3>
                <p className="mt-3 text-gray-600 dark:text-gray-400">
                  {isApplied
                    ? "You have already submitted your application for this role."
                    : "Complete your profile and apply to share your portfolio with the hiring team."}
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Why this role
                </h3>
                <ul className="mt-3 space-y-2 text-gray-600 dark:text-gray-400">
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
