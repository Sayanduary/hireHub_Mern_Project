import React, { useEffect, useMemo } from "react";
import Navbar from "./shared/Navbar";
import Job from "./Job";
import { useDispatch, useSelector } from "react-redux";
import { setFilters, setSearchedQuery } from "@/redux/jobSlice";
import useGetAllJobs from "@/hooks/useGetAllJobs";

// const randomJobs = [1, 2,45];

const Browse = () => {
  useGetAllJobs();
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <div className="max-w-7xl mx-auto my-10 px-4">
        <h1 className="font-bold text-xl my-10 text-gray-900 dark:text-gray-100">
          Search Results ({filteredJobs.length})
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJobs.length === 0 ? (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No jobs found
              </p>
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
