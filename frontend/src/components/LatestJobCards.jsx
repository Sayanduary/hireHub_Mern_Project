import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Bookmark } from "lucide-react";

const LatestJobCards = ({ job }) => {
  const navigate = useNavigate();

  // US Date + Time format
  const formattedDate = job?.createdAt
    ? new Date(job.createdAt).toLocaleString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "Few days ago";

  return (
    <div
      onClick={() => navigate(`/description/${job._id}`)}
      tabIndex={0}
      className="
        group
        bg-white dark:bg-[#0a0a0a]
        rounded-2xl
        border border-gray-200 dark:border-white/10
        p-5
        cursor-pointer
        flex flex-col h-full

        transition-all duration-200 ease-out
        hover:-translate-y-1
        hover:shadow-md
        hover:border-gray-300 dark:hover:border-white/20

        focus-within:ring-2
        focus-within:ring-black/10 dark:focus-within:ring-white/20
      "
    >
      {/* Top row */}
      <div className="flex items-center justify-between">
        <Avatar
          className="
            h-11 w-11
            rounded-full
            border border-black/10 dark:border-white/20
            bg-gray-50 dark:bg-white/5
            p-1.5

            transition-transform duration-200 ease-out
            group-hover:scale-[1.03]
          "
        >
          <AvatarImage
            src={job?.company?.logo || "https://via.placeholder.com/40"}
            alt={job?.company?.name || "Company logo"}
            className="rounded-full object-contain"
          />
        </Avatar>

        <button
          onClick={(e) => e.stopPropagation()}
          className="
            flex items-center gap-1 text-xs px-2 py-1 rounded-md
            border border-gray-200 dark:border-white/10
            text-gray-500 dark:text-gray-400

            transition-colors duration-150
            hover:text-gray-900 dark:hover:text-white
            hover:bg-gray-50 dark:hover:bg-white/5
          "
        >
          <Bookmark className="h-3.5 w-3.5" />
          Save
        </button>
      </div>

      {/* Company + time */}
      <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
        {job?.company?.name} · {formattedDate}
      </p>

      {/* Job title */}
      <h3 className="mt-2 text-lg font-semibold text-gray-900 dark:text-white leading-snug">
        {job?.title}
      </h3>

      {/* Tags */}
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="px-3 py-1.5 text-xs font-semibold rounded-full bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-200 transition-colors">
          {job?.jobType}
        </span>
        <span className="px-3 py-1.5 text-xs font-semibold rounded-full bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-200 transition-colors">
          {job?.experienceLevel || "Senior level"}
        </span>
      </div>

      {/* Divider */}
      <div className="my-5 h-px bg-gray-200 dark:bg-white/10" />

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between">
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">
            ₹ {job?.salary} LPA
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {job?.location || "India"}
          </p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/description/${job._id}`);
          }}
          className="
            bg-gray-900 text-white dark:bg-white dark:text-gray-900
            px-5 py-2.5 rounded-lg
            text-sm font-semibold

            transition-all duration-200 ease-out
            hover:bg-black dark:hover:bg-gray-100
            hover:scale-105
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-black/20 dark:focus-visible:ring-white/20
            shadow-sm
          "
        >
          View details
        </button>
      </div>
    </div>
  );
};

LatestJobCards.propTypes = {
  job: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    salary: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    location: PropTypes.string,
    jobType: PropTypes.string,
    experienceLevel: PropTypes.string,
    createdAt: PropTypes.string,
    company: PropTypes.shape({
      name: PropTypes.string,
      logo: PropTypes.string,
    }),
  }),
};

export default LatestJobCards;
