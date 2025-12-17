import React, { useEffect, useMemo } from "react";
import Navbar from "./shared/Navbar";
import Job from "./Job";
import { useDispatch, useSelector } from "react-redux";
import { setFilters, setSearchedQuery } from "@/redux/jobSlice";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";

// const randomJobs = [1, 2,45];

const Browse = () => {
  useGetAllJobs();
  useGetAppliedJobs(); // Fetch applied jobs to sync state
  const { jobs, searchedQuery } = useSelector((store) => store.job);
  const dispatch = useDispatch();

  const filteredJobs = useMemo(() => {
    if (!searchedQuery) return jobs;
    const query = searchedQuery.toLowerCase();
    return jobs.filter((job) => {
      const haystack = `
        ${job?.title || ""}
        ${job?.description || ""}
        ${job?.location || ""}
        ${job?.company?.name || ""}
      `.toLowerCase();
      return haystack.includes(query);
    });
  }, [jobs, searchedQuery]);

  useEffect(() => {
    return () => {
      dispatch(setSearchedQuery(""));
      dispatch(setFilters({ searchText: "" }));
    };
  }, [dispatch]);
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Search Results
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.length === 0 ? (
            <div className="col-span-full">
              <div className="border border-dashed border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 rounded-lg py-20 text-center">
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  No jobs found
                </p>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Try adjusting your search query
                </p>
              </div>
            </div>
          ) : (
            filteredJobs.map((job) => {
              return <Job key={job._id} job={job} />;
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Browse;
