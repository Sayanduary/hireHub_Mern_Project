import React from "react";
import {
  Code,
  Server,
  Database,
  Palette,
  Layers,
  Smartphone,
  Cloud,
  PenTool,
  Briefcase,
} from "lucide-react";

const categories = [
  { label: "Frontend Developer", icon: Code, color: "blue" },
  { label: "Backend Developer", icon: Server, color: "emerald" },
  { label: "Full-Stack Developer", icon: Layers, color: "violet" },
  { label: "Data Science", icon: Database, color: "amber" },
  { label: "Mobile Developer", icon: Smartphone, color: "rose" },
  { label: "DevOps Engineer", icon: Cloud, color: "cyan" },
  { label: "UI / UX Designer", icon: Palette, color: "pink" },
  { label: "Graphic Designer", icon: PenTool, color: "indigo" },
];

const colorMap = {
  blue: {
    bg: "bg-blue-50 dark:bg-blue-950/30",
    iconBg: "bg-blue-100 dark:bg-blue-900/40",
    iconText: "text-blue-700 dark:text-blue-300",
  },
  emerald: {
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
    iconText: "text-emerald-700 dark:text-emerald-300",
  },
  violet: {
    bg: "bg-violet-50 dark:bg-violet-950/30",
    iconBg: "bg-violet-100 dark:bg-violet-900/40",
    iconText: "text-violet-700 dark:text-violet-300",
  },
  amber: {
    bg: "bg-amber-50 dark:bg-amber-950/30",
    iconBg: "bg-amber-100 dark:bg-amber-900/40",
    iconText: "text-amber-700 dark:text-amber-300",
  },
  rose: {
    bg: "bg-rose-50 dark:bg-rose-950/30",
    iconBg: "bg-rose-100 dark:bg-rose-900/40",
    iconText: "text-rose-700 dark:text-rose-300",
  },
  cyan: {
    bg: "bg-cyan-50 dark:bg-cyan-950/30",
    iconBg: "bg-cyan-100 dark:bg-cyan-900/40",
    iconText: "text-cyan-700 dark:text-cyan-300",
  },
  pink: {
    bg: "bg-pink-50 dark:bg-pink-950/30",
    iconBg: "bg-pink-100 dark:bg-pink-900/40",
    iconText: "text-pink-700 dark:text-pink-300",
  },
  indigo: {
    bg: "bg-indigo-50 dark:bg-indigo-950/30",
    iconBg: "bg-indigo-100 dark:bg-indigo-900/40",
    iconText: "text-indigo-700 dark:text-indigo-300",
  },
};

const CategorySection = () => {
  return (
    <section className="py-20 bg-gray-50 dark:bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-[#E0E0E0]">
            Explore jobs by role
          </h2>
          <p className="mt-3 text-base text-gray-600 dark:text-[#B0B0B0]">
            Full-time opportunities from verified employers
          </p>

          {/* Trust Line */}
          <div className="mt-4 inline-flex items-center gap-2 rounded-md border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#1a1a1a] px-4 py-2 text-sm text-gray-600 dark:text-[#B0B0B0]">
            <Briefcase className="h-4 w-4" />
            We hire employees only · No freelance / gig roles
          </div>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories.map(({ label, icon: Icon, color }) => {
            const c = colorMap[color];

            return (
              <div
                key={label}
                className={`
                  flex items-center gap-4
                  rounded-lg border border-gray-200 dark:border-[#2a2a2a]
                  ${c.bg}
                  px-4 py-5
                `}
              >
                {/* Inner Rectangle Icon */}
                <div
                  className={`
                    flex h-12 w-12 items-center justify-center
                    rounded-md
                    ${c.iconBg}
                    ${c.iconText}
                  `}
                >
                  <Icon className="h-6 w-6" />
                </div>

                {/* Role Text */}
                <p className="text-sm font-semibold text-gray-900 dark:text-[#E0E0E0]">
                  {label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
