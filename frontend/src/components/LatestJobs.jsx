import React, { useRef } from "react";
import LatestJobCards from "./LatestJobCards";
import { useSelector } from "react-redux";
import { motion, useScroll, useTransform } from "framer-motion";

/* Container animation */
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

/* Card entrance animation only (no hover here) */
const cardVariants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.96,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const LatestJobs = () => {
  const { jobs } = useSelector((store) => store.job);
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 85%", "start 40%"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.97, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 bg-gray-50 dark:bg-[#121212] overflow-hidden"
    >
      <motion.div
        style={{ scale, opacity }}
        className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8"
      >
        {/* Header */}
        <div className="mb-16 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 dark:text-[#E0E0E0]">
            Latest job openings
          </h2>
          <p className="mt-2 text-base text-gray-600 dark:text-[#B0B0B0]">
            Discover recently posted roles from trusted companies
          </p>
        </div>

        {/* Content */}
        {jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 dark:border-[#444444] bg-white dark:bg-[#121212] py-24 text-center">
            <p className="text-lg font-semibold text-gray-900 dark:text-[#E0E0E0]">
              No jobs available right now
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-[#B0B0B0]">
              New opportunities will appear here soon
            </p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {jobs.slice(0, 6).map((job) => (
              <motion.div
                key={job._id}
                variants={cardVariants}
                className="will-change-transform"
              >
                <LatestJobCards job={job} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default LatestJobs;
