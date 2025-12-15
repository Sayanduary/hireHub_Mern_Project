import React from "react";
import LatestJobCards from "./LatestJobCards";
import { useSelector } from "react-redux";

const LatestJobs = () => {
  const { jobs } = useSelector((store) => store.job);

  return (
    <section className="bg-gray-50 dark:bg-black py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-10 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 dark:text-white">
            Latest job openings
          </h2>
          <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
            Discover recently posted roles from trusted companies
          </p>
        </div>

        {/* Content */}
        {jobs.length <= 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 dark:border-white/10 py-20 text-center">
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
              No jobs available right now
            </p>
            <p className="mt-2 text-sm text-gray-500">
              New opportunities will appear here soon
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.slice(0, 6).map((job) => (
              <LatestJobCards key={job._id} job={job} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestJobs;
