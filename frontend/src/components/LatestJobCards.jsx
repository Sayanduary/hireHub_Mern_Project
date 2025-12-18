import React, { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Bookmark } from "lucide-react";
import { USER_API_END_POINT } from "@/utils/constant";
import { addSavedJobId, removeSavedJobId } from "@/redux/savedJobSlice";

const LatestJobCards = ({ job }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const { savedJobIds } = useSelector((store) => store.savedJob);
  const [isSavingLoading, setIsSavingLoading] = useState(false);

  const isSaved = savedJobIds.includes(job?._id);

  const formattedDate = job?.createdAt
    ? new Date(job.createdAt).toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
    : "Recently";

  const handleSaveJob = async (e) => {
    e.stopPropagation();

    if (!user) {
      toast.error("Please login to save jobs", { duration: 1000 });
      navigate("/login");
      return;
    }

    setIsSavingLoading(true);
    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/save-job/${job._id}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        if (isSaved) {
          dispatch(removeSavedJobId(job._id));
          toast.success("Job removed from saved", { duration: 1000 });
        } else {
          dispatch(addSavedJobId(job._id));
          toast.success("Job saved successfully", { duration: 1000 });
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save job", {
        duration: 1000,
      });
    } finally {
      setIsSavingLoading(false);
    }
  };

  return (
    <article
      onClick={() => navigate(`/description/${job._id}`)}
      tabIndex={0}
      className="
        group relative
        bg-white dark:bg-[#0d0d0d]
        rounded-2xl
        border border-gray-200 dark:border-[#2a2a2a]
        p-6
        flex flex-col h-full
        cursor-pointer

        transition-all duration-200 ease-out
        hover:-translate-y-1
        hover:border-gray-900/80 dark:hover:border-[#666]
        hover:shadow-sm

        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-gray-900/10 dark:focus-visible:ring-[#888]/20
      "
    >
      {/* ===== Header ===== */}
      <header className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-11 w-11 border border-black/10 dark:border-[#333] bg-gray-50 dark:bg-[#1a1a1a]">
            <AvatarImage
              src={job?.company?.logo || "https://via.placeholder.com/40"}
              alt={job?.company?.name || "Company logo"}
              className="object-contain"
            />
          </Avatar>

          <div className="leading-tight">
            <p className="text-sm font-medium text-gray-900 dark:text-[#E0E0E0]">
              {job?.company?.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-[#9a9a9a]">
              Posted {formattedDate}
            </p>
          </div>
        </div>

        <button
          onClick={handleSaveJob}
          disabled={isSavingLoading}
          aria-label="Save job"
          className="
            inline-flex items-center justify-center
            h-8 w-8 rounded-md
            border border-gray-200 dark:border-[#333]
            text-gray-500 dark:text-[#aaa]

            transition-colors
            hover:text-gray-900 dark:hover:text-white
            hover:bg-gray-50 dark:hover:bg-[#1a1a1a]
            disabled:opacity-50
          "
        >
          <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
        </button>
      </header>

      {/* ===== Title ===== */}
      <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-[#f1f1f1] leading-snug">
        {job?.title}
      </h3>

      {/* ===== Tags ===== */}
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 dark:bg-[#1a1a1a] dark:text-[#b0b0b0]">
          {job?.jobType}
        </span>
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 dark:bg-[#1a1a1a] dark:text-[#b0b0b0]">
          {job?.experienceLevel || "Senior"}
        </span>
      </div>

      {/* ===== Spacer ===== */}
      <div className="my-5 h-px bg-gray-100 dark:bg-[#2a2a2a]" />

      {/* ===== Footer ===== */}
      <footer className="mt-auto flex items-center justify-between">
        <div>
          <p className="text-base font-semibold text-gray-900 dark:text-[#f1f1f1]">
            ₹ {job?.salary} LPA
          </p>
          <p className="text-sm text-gray-500 dark:text-[#9a9a9a]">
            {job?.location || "India"}
          </p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/description/${job._id}`);
          }}
          className="
            inline-flex items-center
            rounded-lg px-4 py-2
            text-sm font-medium

            bg-gray-900 text-white
            dark:bg-[#eaeaea] dark:text-[#121212]

            transition-all duration-150
            hover:opacity-90
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-gray-900/20 dark:focus-visible:ring-[#888]/30
          "
        >
          View
        </button>
      </footer>
    </article>
  );
};

LatestJobCards.propTypes = {
  job: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    salary: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    location: PropTypes.string,
    jobType: PropTypes.string,
    experienceLevel: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    createdAt: PropTypes.string,
    company: PropTypes.shape({
      name: PropTypes.string,
      logo: PropTypes.string,
    }),
  }),
};

export default LatestJobCards;
