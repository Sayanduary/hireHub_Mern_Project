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
      {/* ===== Background ===== */}
      <div className="absolute inset-0 z-0">
        {theme === "dark" ? (
          <>
            {/* Dark theme - Premium spotlight */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.12)_0%,_rgba(255,255,255,0.06)_18%,_rgba(0,0,0,0.85)_45%,_#000_70%)]" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_40%,_rgba(0,0,0,0.9)_100%)]" />
          </>
        ) : (
          <>
            {/* Light theme - Subtle gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-gray-50" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(59,130,246,0.08)_0%,_transparent_40%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(59,130,246,0.05)_0%,_transparent_40%)]" />
          </>
        )}
      </div>

      {/* ===== Content ===== */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6 lg:px-8 w-full py-24">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Left */}
          <div className="space-y-8">
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-5 py-2 text-xs font-medium backdrop-blur ${
                theme === "dark"
                  ? "bg-white/10 border-white/10 text-white"
                  : "bg-blue-50 border-blue-200 text-blue-700"
              }`}
            >
              ✨ Latest component
            </span>

            <div className="space-y-5">
              <h1
                className={`text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight tracking-tight ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Build momentum for <br /> your career
              </h1>

              <p
                className={`max-w-xl text-base md:text-lg leading-relaxed ${
                  theme === "dark" ? "text-white/65" : "text-gray-600"
                }`}
              >
                Discover vetted opportunities, stay aligned with hiring teams,
                and keep every application organized from a single platform.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => navigate("/jobs")}
                className={`inline-flex items-center gap-2 h-11 px-6 rounded-full font-medium transition ${
                  theme === "dark"
                    ? "bg-white text-black hover:bg-white/90"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                Browse jobs
                <Search className="h-4 w-4" />
              </button>

              <button
                onClick={() => navigate("/signup")}
                className={`inline-flex items-center gap-2 h-11 px-4 text-sm transition ${
                  theme === "dark"
                    ? "text-white/80 hover:text-white"
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                Get started
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Right */}
          <div className="hidden lg:block space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div
                className={`rounded-xl border p-6 text-center backdrop-blur ${
                  theme === "dark"
                    ? "bg-white/5 border-white/10"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <p
                  className={`text-3xl font-semibold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  3M+
                </p>
                <p
                  className={`text-xs mt-1 ${
                    theme === "dark" ? "text-white/60" : "text-gray-600"
                  }`}
                >
                  Active members
                </p>
              </div>

              <div
                className={`rounded-xl border p-6 text-center backdrop-blur ${
                  theme === "dark"
                    ? "bg-white/5 border-white/10"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <p
                  className={`text-3xl font-semibold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  98%
                </p>
                <p
                  className={`text-xs mt-1 ${
                    theme === "dark" ? "text-white/60" : "text-gray-600"
                  }`}
                >
                  Hire success
                </p>
              </div>
            </div>

            <div
              className={`rounded-xl border p-6 backdrop-blur ${
                theme === "dark"
                  ? "bg-white/5 border-white/10"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <p
                className={`text-xs mb-2 ${
                  theme === "dark" ? "text-white/50" : "text-gray-500"
                }`}
              >
                Featured role
              </p>
              <h3
                className={`text-lg font-medium ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Senior Product Designer
              </h3>
              <p
                className={`text-sm mt-1 ${
                  theme === "dark" ? "text-white/60" : "text-gray-600"
                }`}
              >
                Remote · Full-time · Global
              </p>

              <div className="mt-4 space-y-2">
                {[
                  "Product Foundation",
                  "Design Systems",
                  "Prototype Strategy",
                ].map((item) => (
                  <div
                    key={item}
                    className={`flex items-center justify-between rounded-lg border px-4 py-2 text-sm ${
                      theme === "dark"
                        ? "bg-black/40 border-white/10 text-white/80"
                        : "bg-white border-gray-200 text-gray-700"
                    }`}
                  >
                    <span>{item}</span>
                    <span
                      className={`text-xs ${
                        theme === "dark" ? "text-white/40" : "text-gray-400"
                      }`}
                    >
                      Expert
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;