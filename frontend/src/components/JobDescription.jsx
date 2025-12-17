import React, { useEffect, useState, useMemo } from "react";
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
import Footer from "./shared/Footer";
import { Bookmark } from "lucide-react";
import { addAppliedJobId } from "@/redux/applicationSlice";
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";

const JobDescription = () => {
  useGetAppliedJobs();

  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);

  const [isSaved, setIsSaved] = useState(false);

  const { id: jobId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* ===== Application Status from Backend ===== */
  const applicationStatus = useMemo(() => {
    if (!user || !singleJob?.applications) return "Not Applied";

    const app = singleJob.applications.find((a) => a.applicant === user._id);

    if (!app) return "Not Applied";
    if (app.status === "accepted") return "Accepted";
    if (app.status === "pending") return "Pending";
    return "Not Applied";
  }, [singleJob, user]);

  /* ===== Apply ===== */
  const applyJobHandler = async () => {
    if (!user) {
      toast.error("Please login to apply");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.get(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(
          setSingleJob({
            ...singleJob,
            applications: [
              ...(singleJob.applications || []),
              { applicant: user._id, status: "pending" },
            ],
          })
        );
        dispatch(addAppliedJobId(jobId));
        toast.success("Application submitted");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to apply");
    }
  };

  /* ===== Save ===== */
  const saveJobHandler = async () => {
    if (!user) {
      toast.error("Please login to save job");
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
        setIsSaved((p) => !p);
        toast.success(res.data.message);
      }
    } catch {
      toast.error("Error saving job");
    }
  };

  /* ===== Fetch Job ===== */
  useEffect(() => {
    const fetchJob = async () => {
      const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setSingleJob(res.data.job));
        setIsSaved(user?.savedJobs?.includes(jobId) || false);
      }
    };
    fetchJob();
  }, [jobId, dispatch, user?.savedJobs]);

  return (
    <>
      <Navbar />

      <section className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-10">
          <article className="rounded-xl border border-gray-200 bg-white p-8 dark:border-[#444444] dark:bg-[#0d0d0d]">
            {/* ===== TWO COLUMN LAYOUT INSIDE ARTICLE ===== */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* ===== LEFT: JOB DETAILS ===== */}
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-[#888888]">
                  Job Details
                </p>

                <h1 className="mt-2 text-4xl font-bold text-gray-900 dark:text-white">
                  {singleJob?.title}
                </h1>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge>{singleJob?.jobType}</Badge>
                  <Badge>₹ {singleJob?.salary} LPA</Badge>
                  <Badge>{singleJob?.position} openings</Badge>

                  <Badge
                    className={
                      applicationStatus === "Accepted"
                        ? "bg-green-100 text-green-700"
                        : applicationStatus === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                    }
                  >
                    {applicationStatus}
                  </Badge>
                </div>

                <div className="mt-6 flex gap-3 flex-wrap">
                  <Button
                    onClick={saveJobHandler}
                    variant="outline"
                    className={
                      isSaved
                        ? "bg-gray-900 text-white hover:bg-gray-800 dark:bg-[#E0E0E0] dark:text-[#121212] dark:hover:bg-[#888888]"
                        : "hover:bg-gray-100 dark:hover:bg-[#1a1a1a]"
                    }
                  >
                    <Bookmark className="mr-2 h-4 w-4" />
                    {isSaved ? "Saved" : "Save"}
                  </Button>

                  <Button
                    onClick={applyJobHandler}
                    disabled={applicationStatus !== "Not Applied"}
                  >
                    {applicationStatus === "Not Applied"
                      ? "Apply now"
                      : "Applied"}
                  </Button>
                </div>

                {/* Overview */}
                <div className="mt-10">
                  <h2 className="text-sm font-semibold">Job Overview</h2>
                  <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                    {[
                      ["Location", singleJob?.location],
                      ["Experience", `${singleJob?.experienceLevel} yrs`],
                      ["Applicants", singleJob?.applications?.length],
                      ["Posted", singleJob?.createdAt?.split("T")[0]],
                    ].map(([k, v]) => (
                      <div
                        key={k}
                        className="rounded-md border bg-gray-50 p-4 dark:bg-[#121212]"
                      >
                        <dt className="text-xs text-gray-500">{k}</dt>
                        <dd className="mt-1 font-medium">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>

              {/* ===== RIGHT: JOB DESCRIPTION BLOCK ===== */}
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-[#444444] dark:bg-[#0d0d0d]">
                <h2 className="text-base font-semibold text-gray-900 dark:text-[#E0E0E0]">
                  Job Description
                </h2>

                <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-[#B0B0B0]">
                  {singleJob?.description}
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default JobDescription;
