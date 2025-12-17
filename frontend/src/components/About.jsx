import React from "react";
import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";
import { Users } from "lucide-react";

const About = () => {
  const developers = [
    "Sayan Duary",
    "Srinjay Karfa",
    "Sohom Ghosh",
    "Jit Kumar Das",
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
      <Navbar />

      <section className="mx-auto max-w-4xl px-4 md:px-6 lg:px-8 py-20">
        <div className="rounded-2xl border border-gray-200 bg-white p-10 md:p-14 shadow-sm dark:border-[#444444] dark:bg-[#0d0d0d] transition-all duration-300">
          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-[#E0E0E0] mb-4">
              About HIREHUB
            </h1>
            <div className="mx-auto w-16 h-1 bg-gray-900 dark:bg-[#E0E0E0] rounded-full"></div>
          </div>

          {/* Description */}
          <div className="mb-12">
            <p className="text-lg text-gray-600 dark:text-[#B0B0B0] leading-relaxed text-center max-w-2xl mx-auto">
              HIREHUB is a modern job portal platform designed to connect
              talented professionals with career opportunities. Our platform
              streamlines the hiring process, making it easier for job seekers
              to find their dream roles and for recruiters to discover
              exceptional talent.
            </p>
          </div>

          {/* Developers Section */}
          <div className="mt-12">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 bg-gray-50 dark:border-[#444444] dark:bg-[#1a1a1a]">
                <Users className="h-5 w-5 text-gray-700 dark:text-[#888888]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-[#E0E0E0]">
                Development Team
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {developers.map((developer, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center rounded-xl border-2 border-gray-200 bg-gray-50 px-6 py-5 text-center hover:border-gray-300 hover:shadow-md hover:-translate-y-0.5 dark:border-[#444444] dark:bg-[#1a1a1a] dark:hover:border-[#888888] transition-all duration-200"
                >
                  <p className="text-lg font-bold text-gray-900 dark:text-[#E0E0E0]">
                    {developer}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-[#444444]">
            <p className="text-sm text-center text-gray-500 dark:text-[#888888]">
              Built with passion and dedication to revolutionize the hiring
              experience.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default About;
