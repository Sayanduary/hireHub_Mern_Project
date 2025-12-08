import React from "react";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";

const LatestJobCards = ({ job }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/description/${job._id}`)}
      className="p-5 rounded-lg shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-lg hover:border-[#0a66c2] dark:hover:border-[#70b5f9] transition-all duration-200"
    >
      <div>
        <h1 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
          {job?.company?.name}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {job?.location || "India"}
        </p>
      </div>
      <div className="mt-3">
        <h1 className="font-bold text-lg my-2 text-[#0a66c2] dark:text-[#70b5f9]">
          {job?.title}
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
          {job?.description}
        </p>
      </div>
      <div className="flex items-center gap-2 mt-4 flex-wrap">
        <Badge
          className={
            "text-[#0a66c2] dark:text-[#70b5f9] bg-[#e8f3ff] dark:bg-[#0a66c2]/20 font-semibold border-none"
          }
          variant="outline"
        >
          {job?.position} Positions
        </Badge>
        <Badge
          className={
            "text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 font-semibold border-none"
          }
          variant="outline"
        >
          {job?.jobType}
        </Badge>
        <Badge
          className={
            "text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 font-semibold border-none"
          }
          variant="outline"
        >
          {job?.salary}LPA
        </Badge>
      </div>
    </div>
  );
};

export default LatestJobCards;
