import React, { useRef } from "react";
import LatestJobCards from "./LatestJobCards";
import { useSelector } from "react-redux";
import { motion, useScroll, useTransform } from "framer-motion";

/* Animation Variants */
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.25,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    scale: 0.7,
    rotateX: 14,
  },
  show: {
    opacity: 1,
    scale: 1,
    rotateX: 0,
    transition: {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const LatestJobs = () => {
  const { jobs } = useSelector((store) => store.job);
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 80%", "start 30%"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.94, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-gray-50 dark:bg-[#0a0a0a] py-24 overflow-hidden"
    >
      <motion.div
        style={{ scale, opacity }}
        className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8"
      >
        {/* Header */}
        <div className="mb-16 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 dark:text-white">
            Latest job openings
          </h2>
          <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
            Discover recently posted roles from trusted companies
          </p>
        </div>

        {/* Content */}
        {jobs.length <= 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 py-24 text-center">
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              No jobs available right now
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              New opportunities will appear here soon
            </p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 perspective-[1400px]"
          >
            {jobs.slice(0, 6).map((job) => (
              <motion.div
                key={job._id}
                variants={cardVariants}
                whileHover={{
                  y: -12,
                  scale: 1.05,
                  rotateX: -6,
                  transition: { duration: 0.35 },
                }}
                className="relative will-change-transform"
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
