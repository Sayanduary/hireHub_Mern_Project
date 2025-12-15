import React, { useEffect, useState } from "react";
import Navbar from "./shared/Navbar";
import FilterCard from "./FilterCard";
import Job from "./Job";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import { Filter, X } from "lucide-react";
import { Button } from "./ui/button";

const Jobs = () => {
  useGetAllJobs();

  const { jobs, filters } = useSelector((store) => store.job);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

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
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <Navbar />

      <section className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        {/* Mobile filter toggle */}
        <div className="lg:hidden mb-6">
          <Button
            onClick={() => setShowMobileFilter(true)}
            className="w-full bg-black text-white hover:bg-gray-900"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        <div className="flex gap-8">
          {/* Sidebar filters */}
          <aside className="hidden lg:block w-72 shrink-0 sticky top-20 h-fit">
            <FilterCard />
          </aside>

          {/* Mobile filter drawer */}
          {showMobileFilter && (
            <div
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowMobileFilter(false)}
            >
              <div
                className="absolute left-0 top-0 h-full w-80 bg-white dark:bg-black p-5 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowMobileFilter(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <FilterCard onFilterApply={() => setShowMobileFilter(false)} />
              </div>
            </div>
          )}

          {/* Job results */}
          <main className="flex-1">
            {filteredJobs.length === 0 ? (
              <div className="border border-dashed border-gray-300 dark:border-white/10 rounded-2xl py-24 text-center">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  No jobs found
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Try adjusting your filters
                </p>
              </div>
            ) : (
              <>
                <p className="mb-5 text-sm text-gray-600 dark:text-gray-400">
                  Showing{" "}
                  <span className="font-medium text-gray-900 dark:text-white">
                    {filteredJobs.length}
                  </span>{" "}
                  jobs
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredJobs.map((job) => (
                    <motion.div
                      key={job._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <Job job={job} />
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </main>
        </div>
      </section>
    </div>
  );
};

export default Jobs;
