import React from "react";
import LatestJobCards from "./LatestJobCards";
import { useSelector } from "react-redux";

// const randomJobs = [1, 2, 3, 4, 5, 6, 7, 8];

const LatestJobs = () => {
  const { jobs } = useSelector((store) => store.job);

  return (
    <div className="max-w-7xl mx-auto my-20 px-4 bg-gray-50 dark:bg-gray-950 py-12">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
        <span className="text-[#0a66c2] dark:text-[#70b5f9]">
          Latest & Top{" "}
        </span>{" "}
        Job Openings
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
        {jobs.length <= 0 ? (
          <span className="text-gray-600 dark:text-gray-400 col-span-full text-center py-8">
            No Job Available
          </span>
        ) : (
          jobs
            ?.slice(0, 6)
            .map((job) => <LatestJobCards key={job._id} job={job} />)
        )}
      </div>
    </div>
  );
};

export default LatestJobs;
