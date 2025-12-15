import React from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Bookmark } from "lucide-react";

const LatestJobCards = ({ job }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/description/${job._id}`)}
      className="
        bg-white dark:bg-neutral-900
        rounded-2xl
        border border-gray-200 dark:border-white/10
        p-5
        hover:shadow-lg transition
        cursor-pointer
        flex flex-col h-full
      "
    >
      {/* Top row */}
      <div className="flex items-center justify-between">
        <Avatar className="h-9 w-9">
          <AvatarImage
            src={job?.company?.logo || "https://via.placeholder.com/40"}
            alt={job?.company?.name}
          />
        </Avatar>

        <button className="flex items-center gap-1 text-xs px-2 py-1 rounded-md border border-gray-200 dark:border-white/10 text-gray-500 hover:text-black dark:hover:text-white">
          <Bookmark className="h-3.5 w-3.5" />
          Save
        </button>
      </div>

      {/* Company + time */}
      <p className="mt-3 text-sm text-gray-500">
        {job?.company?.name} · {job?.createdAt || "Few days ago"}
      </p>

      {/* Job title */}
      <h3 className="mt-2 text-lg font-semibold text-gray-900 dark:text-white leading-snug">
        {job?.title}
      </h3>

      {/* Tags */}
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="px-3 py-1 text-xs rounded-md bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300">
          {job?.jobType}
        </span>
        <span className="px-3 py-1 text-xs rounded-md bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300">
          {job?.experienceLevel || "Senior level"}
        </span>
      </div>

      {/* Divider */}
      <div className="my-5 h-px bg-gray-200 dark:bg-white/10" />

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between">
        <div>
          {/* ✅ EXACT LPA (NO /hr) */}
          <p className="font-semibold text-gray-900 dark:text-white">
            ₹ {job?.salary} LPA
          </p>
          <p className="text-sm text-gray-500">{job?.location || "India"}</p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/description/${job._id}`);
          }}
          className="bg-black text-white px-4 py-2 rounded-md text-sm hover:bg-gray-900 transition"
        >
          Apply now
        </button>
      </div>
    </div>
  );
};

export default LatestJobCards;
