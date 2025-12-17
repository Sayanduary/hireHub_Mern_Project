import { ArrowRight, Search } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950 overflow-hidden flex items-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        {/* Subtle dark gradient overlay for text readability only */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/15 via-black/5 to-transparent dark:from-gray-950/40 dark:via-gray-950/20 dark:to-transparent"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6 lg:px-8 w-full py-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-white/80 bg-transparent backdrop-blur-sm px-5 py-2 text-xs font-semibold text-white hover:bg-white/10 transition-all duration-200 dark:bg-black dark:border-black dark:text-white dark:hover:bg-gray-900">
              Trusted talent marketplace
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-white" style={{ textShadow: '0 6px 24px rgba(0,0,0,0.55)' }}>
                Build momentum for your career
              </h1>
              <p className="text-xl font-medium leading-relaxed max-w-xl" style={{ color: '#F9FAFB', textShadow: '0 3px 12px rgba(0,0,0,0.45)', lineHeight: '1.7' }}>
                Discover vetted opportunities, stay aligned with hiring teams, and
                keep every application organized from a single platform.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start gap-3">
              <button
                onClick={() => navigate("/jobs")}
                className="inline-flex items-center gap-2 h-11 px-6 rounded-full border-2 border-white/80 bg-transparent text-white font-semibold hover:bg-white/15 transition-all duration-200 backdrop-blur-sm dark:bg-black dark:border-black dark:text-white dark:hover:bg-gray-900"
              >
                Browse jobs
                <Search className="h-4 w-4" />
              </button>

              <button
                onClick={() => navigate("/signup")}
                className="inline-flex items-center gap-2 h-11 px-6 text-sm font-medium text-white hover:text-gray-100 transition-colors"
                style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
              >
                Get started
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  3M+
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Active members
                </p>
              </div>

              <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  98%
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Hire success
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Featured role
                </p>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Senior Product Designer
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Remote · Full-time · Global
                </p>
              </div>
              <div className="space-y-2">
                {[
                  "Product Foundation",
                  "Design Systems",
                  "Prototype Strategy",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300"
                  >
                    <span>{item}</span>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-500">
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
