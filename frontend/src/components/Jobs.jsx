import { useMemo } from "react";
import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";
import FilterCard from "./FilterCard";
import Job from "./Job";
import { useSelector } from "react-redux";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";
import { motion, AnimatePresence } from "framer-motion";

/* Page container animation */
const pageVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

/* List animation */
const listVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

/* Card entrance animation */
const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const Jobs = () => {
  useGetAllJobs();
  useGetAppliedJobs();

  const { jobs, filters } = useSelector((store) => store.job);

  /* ===== Filter logic (unchanged, memoized) ===== */
  const filteredJobs = useMemo(() => {
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
        const exp = job.experienceLevel || 0;
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

    if (filters.salaryRange) {
      data = data.filter((job) => {
        const s = job.salary || 0;
        // Convert salary to LPA (assuming job.salary is in LPA)
        const salaryInLPA = s;

        if (
          filters.salaryRange.min !== undefined &&
          filters.salaryRange.max !== undefined
        ) {
          return (
            salaryInLPA >= filters.salaryRange.min &&
            salaryInLPA <= filters.salaryRange.max
          );
        }
        return true;
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

    return data;
  }, [jobs, filters]);

  return (
    <>
      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="show"
        className="bg-gray-50 dark:bg-[#0a0a0a]"
      >
        <Navbar />

        {/* Sticky Filter Bar */}
        <div className="sticky top-16 z-40 bg-white dark:bg-[#121212] border-b border-gray-200 dark:border-[#444444]">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            <FilterCard />
          </div>
        </div>

        <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-10">
          <AnimatePresence mode="wait">
            {filteredJobs.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="
                border border-dashed border-gray-300 dark:border-[#444444]
                bg-white dark:bg-[#121212]
                rounded-xl py-24 text-center
              "
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-[#E0E0E0]">
                  No jobs found
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-[#B0B0B0]">
                  Try adjusting your filters
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                variants={listVariants}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0 }}
              >
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-6 text-sm text-gray-600 dark:text-[#B0B0B0]"
                >
                  Showing{" "}
                  <span className="font-semibold text-gray-900 dark:text-[#E0E0E0]">
                    {filteredJobs.length}
                  </span>{" "}
                  jobs
                </motion.p>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredJobs.map((job) => (
                    <motion.div
                      key={job._id}
                      variants={cardVariants}
                      className="will-change-transform"
                    >
                      <Job job={job} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </motion.div>
      <Footer />
    </>
  );
};

export default Jobs;
