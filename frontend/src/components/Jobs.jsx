import { useEffect, useState } from "react";
import Navbar from "./shared/Navbar";
import FilterCard from "./FilterCard";
import Job from "./Job";
import { useSelector } from "react-redux";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";

const Jobs = () => {
  useGetAllJobs();
  useGetAppliedJobs(); // Fetch applied jobs to sync state

  const { jobs, filters } = useSelector((store) => store.job);
  const [filteredJobs, setFilteredJobs] = useState([]);

  useEffect(() => {
    let data = [...jobs];

    if (filters.searchText) {
      const q = filters.searchText.toLowerCase();
      data = data.filter(
        (job) =>
          job.title?.toLowerCase().includes(q) ||
          job.description?.toLowerCase().includes(q) ||
          job.location?.toLowerCase().includes(q) ||
          job.company?.name?.toLowerCase().includes(q)
      );
    }

    if (filters.location) {
      data = data.filter((job) =>
        job.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.industry) {
      const i = filters.industry.toLowerCase();
      data = data.filter(
        (job) =>
          job.title?.toLowerCase().includes(i) ||
          job.description?.toLowerCase().includes(i)
      );
    }

    if (filters.jobType) {
      data = data.filter(
        (job) => job.jobType?.toLowerCase() === filters.jobType.toLowerCase()
      );
    }

    if (filters.experience) {
      data = data.filter((job) => {
        const exp = job.experience || 0;
        switch (filters.experience) {
          case "Fresher":
            return exp === 0;
          case "1-2 Years":
            return exp >= 1 && exp <= 2;
          case "2-5 Years":
            return exp >= 2 && exp <= 5;
          case "5-10 Years":
            return exp >= 5 && exp <= 10;
          case "10+ Years":
            return exp >= 10;
          default:
            return true;
        }
      });
    }

    if (filters.salary) {
      data = data.filter((job) => {
        const s = job.salary || 0;
        switch (filters.salary) {
          case "0-40k":
            return s <= 40000;
          case "40k-1lakh":
            return s > 40000 && s <= 100000;
          case "1lakh-5lakh":
            return s > 100000 && s <= 500000;
          case "5lakh-10lakh":
            return s > 500000 && s <= 1000000;
          case "10lakh+":
            return s > 1000000;
          default:
            return true;
        }
      });
    }

    if (filters.skills?.length) {
      data = data.filter((job) => {
        const text = `
          ${job.title}
          ${job.description}
          ${job.requirements}
        `.toLowerCase();
        return filters.skills.some((s) => text.includes(s.toLowerCase()));
      });
    }

    setFilteredJobs(data);
  }, [jobs, filters]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#121212]">
      <Navbar />

      {/* Horizontal Filter Bar */}
      <div className="sticky top-16 z-40 bg-white dark:bg-[#121212] border-b border-gray-200 dark:border-[#444444]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <FilterCard />
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        {/* Job results */}
        {filteredJobs.length === 0 ? (
          <div className="border border-dashed border-gray-300 dark:border-[#444444] bg-white dark:bg-[#121212] rounded-lg py-24 text-center">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-[#E0E0E0]">
              No jobs found
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-[#B0B0B0]">
              Try adjusting your filters
            </p>
          </div>
        ) : (
          <>
            <p className="mb-6 text-sm text-gray-600 dark:text-[#B0B0B0]">
              Showing{" "}
              <span className="font-semibold text-gray-900 dark:text-[#E0E0E0]">
                {filteredJobs.length}
              </span>{" "}
              jobs
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredJobs.map((job) => (
                <Job key={job._id} job={job} />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default Jobs;
