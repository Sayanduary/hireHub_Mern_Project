import React from "react";
import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";
import { Users, Briefcase, FileText, Zap, Lock, Globe } from "lucide-react";
import { useTheme } from "./theme-provider";

const About = () => {
  const { theme } = useTheme();

  const developers = [
    "Sayan Duary",
    "Srinjay Karfa",
    "Sohom Ghosh",
    "Jit Kumar Das",
  ];

  const features = [
    {
      icon: Briefcase,
      title: "Job Management",
      description:
        "Complete job posting, searching, and filtering with advanced filters and categories",
    },
    {
      icon: FileText,
      title: "Resume Builder",
      description:
        "Professional resume builder with multiple templates, PDF generation, and cloud storage",
    },
    {
      icon: Users,
      title: "Application Tracking",
      description:
        "Track applications in real-time, manage application statuses, and view applicant profiles",
    },
    {
      icon: Lock,
      title: "Secure Authentication",
      description:
        "JWT-based authentication with role-based access control (Student/Recruiter)",
    },
    {
      icon: Zap,
      title: "ATS Check",
      description:
        "AI-powered ATS resume checking to optimize your resume for applicant tracking systems",
    },
    {
      icon: Globe,
      title: "Responsive Design",
      description:
        "Fully responsive with dark mode support and seamless experience across all devices",
    },
  ];

  const techStack = [
    {
      category: "Frontend",
      technologies: [
        "React 18",
        "Redux Toolkit",
        "React Router",
        "TailwindCSS",
        "Vite",
      ],
    },
    {
      category: "Backend",
      technologies: ["Node.js", "Express.js", "MongoDB", "Mongoose", "JWT"],
    },
    {
      category: "Services",
      technologies: ["Cloudinary", "Bcryptjs", "Multer", "Radix UI"],
    },
  ];

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-[#0a0a0a]" : "bg-gray-50"
      }`}
    >
      <Navbar />

      <section className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1
            className={`text-5xl md:text-6xl font-bold mb-4 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
            style={{ fontFamily: "'Oswald', sans-serif" }}
          >
            About HIREHUB
          </h1>
          <div
            className={`mx-auto w-24 h-1 rounded-full ${
              theme === "dark" ? "bg-blue-500" : "bg-blue-600"
            }`}
          ></div>
        </div>

        {/* Main Description */}
        <div
          className={`rounded-2xl border p-10 md:p-14 shadow-lg mb-16 ${
            theme === "dark"
              ? "bg-[#0d0d0d] border-[#444444]"
              : "bg-white border-gray-200"
          }`}
        >
          <p
            className={`text-lg leading-relaxed mb-6 ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            <span
              className="font-semibold text-xl"
              style={{ fontFamily: "'Oswald', sans-serif" }}
            >
              HIREHUB
            </span>{" "}
            is a modern, full-stack job portal platform designed to
            revolutionize the hiring experience. We connect talented
            professionals with career opportunities through an intuitive,
            feature-rich platform that serves both job seekers and recruiters.
          </p>
          <p
            className={`text-lg leading-relaxed ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Our mission is to streamline the recruitment process, making it
            easier for companies to discover exceptional talent and for
            professionals to find their dream roles. With cutting-edge features
            like AI-powered resume analysis, intelligent job matching, and
            comprehensive application tracking,{" "}
            <span style={{ fontFamily: "'Oswald', sans-serif" }}>HIREHUB</span>{" "}
            is reshaping the future of recruitment.
          </p>
        </div>

        {/* Key Features */}
        <div className="mb-16">
          <h2
            className={`text-3xl font-bold mb-10 text-center ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Key Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className={`rounded-xl border p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${
                    theme === "dark"
                      ? "bg-[#1a1a1a] border-[#333333] hover:border-blue-500/50"
                      : "bg-white border-gray-200 hover:border-blue-400"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                      theme === "dark" ? "bg-blue-900/30" : "bg-blue-100"
                    }`}
                  >
                    <IconComponent
                      className={`w-6 h-6 ${
                        theme === "dark" ? "text-blue-400" : "text-blue-600"
                      }`}
                    />
                  </div>
                  <h3
                    className={`text-lg font-semibold mb-2 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Technology Stack */}
        <div className="mb-16">
          <h2
            className={`text-3xl font-bold mb-10 text-center ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            🛠️ Technology Stack
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {techStack.map((stack, index) => (
              <div
                key={index}
                className={`rounded-xl border p-8 ${
                  theme === "dark"
                    ? "bg-[#1a1a1a] border-[#333333]"
                    : "bg-white border-gray-200"
                }`}
              >
                <h3
                  className={`text-xl font-bold mb-4 ${
                    theme === "dark" ? "text-blue-400" : "text-blue-600"
                  }`}
                >
                  {stack.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {stack.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        theme === "dark"
                          ? "bg-blue-900/50 text-blue-200 border border-blue-700/50"
                          : "bg-blue-50 text-blue-700 border border-blue-200"
                      }`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Development Team */}
        <div className="mb-16">
          <div className="flex items-center justify-center gap-3 mb-10">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-lg border ${
                theme === "dark"
                  ? "bg-[#1a1a1a] border-[#444444]"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <Users
                className={`h-6 w-6 ${
                  theme === "dark" ? "text-blue-400" : "text-blue-600"
                }`}
              />
            </div>
            <h2
              className={`text-3xl font-bold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Development Team
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {developers.map((developer, index) => (
              <div
                key={index}
                className={`rounded-xl border-2 p-6 text-center hover:shadow-lg transition-all duration-200 hover:-translate-y-1 ${
                  theme === "dark"
                    ? "bg-[#1a1a1a] border-[#333333] hover:border-blue-500/50"
                    : "bg-white border-gray-200 hover:border-blue-400"
                }`}
              >
                <p
                  className={`text-lg font-bold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {developer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Statement */}
        <div
          className={`rounded-2xl border p-10 md:p-14 ${
            theme === "dark"
              ? "bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-[#444444]"
              : "bg-gradient-to-br from-blue-50 to-purple-50 border-gray-200"
          }`}
        >
          <p
            className={`text-center text-lg leading-relaxed ${
              theme === "dark" ? "text-gray-200" : "text-gray-700"
            }`}
          >
            Built with passion and dedication to revolutionize the hiring
            experience. We believe that the right opportunity can change
            someone's life, and the right talent can transform a company.
            <span style={{ fontFamily: "'Oswald', sans-serif" }}>
              {" "}
              H I R E H U B
            </span>{" "}
            bridges that gap with innovation, transparency, and excellence.
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default About;
