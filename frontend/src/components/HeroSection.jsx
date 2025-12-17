import { ArrowRight, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "./theme-provider";

const HeroSection = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  return (
    <section
      className={`relative min-h-screen overflow-hidden flex items-center border-b ${
        theme === "dark"
          ? "bg-black border-white/5"
          : "bg-white border-gray-200"
      }`}
    >
      {/* ================= BACKGROUND ================= */}
      <div className="absolute inset-0 z-0">
        {theme === "dark" ? (
          <>
            {/* Black + dark blue glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(30,64,175,0.18)_0%,_rgba(30,64,175,0.08)_22%,_rgba(0,0,0,0.9)_48%,_#000_72%)]" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_42%,_rgba(0,0,0,0.95)_100%)]" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-gray-50" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(59,130,246,0.08)_0%,_transparent_40%)]" />
          </>
        )}
      </div>

      {/* ================= CONTENT ================= */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6 lg:px-8 w-full py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* ================= LEFT ================= */}
          <div className="space-y-8">
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-5 py-2 text-xs font-medium backdrop-blur ${
                theme === "dark"
                  ? "bg-white/10 border-white/10 text-white"
                  : "bg-blue-50 border-blue-200 text-blue-700"
              }`}
            >
              ✨ Trusted hiring platform
            </span>

            <h1
              className={`text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight tracking-tight ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Build momentum <br /> for your career
            </h1>

            <p
              className={`max-w-xl text-base md:text-lg leading-relaxed ${
                theme === "dark" ? "text-white/65" : "text-gray-600"
              }`}
            >
              Discover verified roles, track applications, and connect directly
              with hiring teams — all in one place.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => navigate("/jobs")}
                className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 ease-in-out ${
                  theme === "dark"
                    ? "bg-[#E0E0E0] text-[#121212] border border-[#E0E0E0] hover:bg-white hover:scale-[1.02] shadow-sm"
                    : "bg-gray-900 text-white border border-gray-900 hover:bg-gray-800 hover:scale-[1.02] shadow-sm"
                }`}
              >
                Browse jobs
                <Search className="h-4 w-4" />
              </button>

              <button
                onClick={() => navigate("/signup")}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 ease-in-out ${
                  theme === "dark"
                    ? "text-white/80 hover:text-white hover:bg-white/5"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                Get started
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* ================= RIGHT (FLOATING CARDS) ================= */}
          <div className="relative hidden lg:block h-[520px]">
            {/* Glow core */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className={`h-48 w-48 rounded-full blur-3xl ${
                  theme === "dark"
                    ? "bg-blue-800/30"
                    : "bg-blue-300/40"
                }`}
              />
            </div>

            {/* Card 1 */}
            <div
              className={`absolute top-6 left-4 w-64 rounded-xl border p-4 backdrop-blur shadow-lg ${
                theme === "dark"
                  ? "bg-white/10 border-white/10 text-white"
                  : "bg-white border-gray-200"
              }`}
            >
              <p className="text-sm font-semibold">Frontend Developer</p>
              <p className="text-xs opacity-70">React · Full-time</p>
            </div>

            {/* Card 2 */}
            <div
              className={`absolute top-24 right-6 w-60 rounded-xl border p-4 backdrop-blur shadow-lg ${
                theme === "dark"
                  ? "bg-white/10 border-white/10 text-white"
                  : "bg-white border-gray-200"
              }`}
            >
              <p className="text-sm font-semibold">Backend Engineer</p>
              <p className="text-xs opacity-70">Node.js · Remote</p>
            </div>

            {/* Card 3 */}
            <div
              className={`absolute bottom-24 left-10 w-56 rounded-xl border p-4 backdrop-blur shadow-lg ${
                theme === "dark"
                  ? "bg-white/10 border-white/10 text-white"
                  : "bg-white border-gray-200"
              }`}
            >
              <p className="text-sm font-semibold">UI / UX Designer</p>
              <p className="text-xs opacity-70">Figma · Contract</p>
            </div>

            {/* Card 4 */}
            <div
              className={`absolute bottom-6 right-12 w-64 rounded-xl border p-4 backdrop-blur shadow-lg ${
                theme === "dark"
                  ? "bg-white/10 border-white/10 text-white"
                  : "bg-white border-gray-200"
              }`}
            >
              <p className="text-sm font-semibold">DevOps Engineer</p>
              <p className="text-xs opacity-70">AWS · Kubernetes</p>
            </div>

            {/* Center stats card */}
            <div
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 rounded-xl border p-5 backdrop-blur shadow-xl ${
                theme === "dark"
                  ? "bg-white/10 border-white/10 text-white"
                  : "bg-white border-gray-200"
              }`}
            >
              <p className="text-2xl font-semibold">1200+</p>
              <p className="mt-1 text-xs opacity-70">
                Active job openings
              </p>
            </div>
          </div>
          {/* ========================================================= */}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
