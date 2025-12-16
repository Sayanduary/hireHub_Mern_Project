import { ArrowRight, Search } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden border-b border-neutral-200/80 bg-[#F8F7F3] text-neutral-900 transition-colors dark:border-white/10 dark:bg-[#0a0a0a] dark:text-neutral-50">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.45),_transparent_55%)] opacity-60 dark:bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.08),_transparent_60%)]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 pt-36 pb-24 md:pt-40 md:pb-32 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div className="space-y-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200/80 px-4 py-1 text-xs font-medium uppercase tracking-[0.22em] text-neutral-500 transition-colors dark:border-white/10 dark:bg-white/5 dark:text-neutral-300">
            Trusted talent marketplace
          </span>

          <div className="space-y-6">
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-neutral-900 md:text-5xl xl:text-6xl dark:text-neutral-50">
              Build momentum for the next chapter in your career
            </h1>
            <p className="max-w-lg text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
              Discover vetted opportunities, stay aligned with hiring teams, and
              keep every application organized from a single, streamlined
              workspace.
            </p>
          </div>

          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Button
              onClick={() => navigate("/jobs")}
              className="h-11 rounded-xl border border-neutral-900/80 bg-neutral-900 px-6 text-sm font-medium tracking-tight text-neutral-100 transition-colors hover:bg-neutral-800 focus-visible:ring-0 dark:border-transparent dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100"
            >
              Browse open roles
              <Search className="ml-2 h-4 w-4" />
            </Button>

            <button
              onClick={() => navigate("/signup")}
              className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-50"
            >
              Join as candidate
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="relative hidden lg:block">
          <div className="absolute -top-40 -left-6 flex w-44 flex-col items-center justify-center gap-1 rounded-2xl border border-neutral-200/80 bg-white/80 px-6 py-5 text-center shadow-none backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
            <p className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
              3M+
            </p>
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
              active members
            </p>
          </div>

          <div className="absolute top-10 right-0 flex w-40 flex-col items-center justify-center gap-1 rounded-2xl border border-neutral-200/80 bg-white/70 px-6 py-5 text-center shadow-none backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
            <p className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
              98%
            </p>
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
              hire success
            </p>
          </div>

          <div className="relative ml-10 flex h-72 w-80 flex-col justify-between rounded-3xl border border-neutral-200/80 bg-white/80 p-8 text-left shadow-none backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
                Spotlight search
              </p>
              <h3 className="mt-3 text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                Senior Product Designer
              </h3>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                Remote · Full-time · Global
              </p>
            </div>
            <div className="space-y-3">
              {[
                "Product Foundation",
                "Design Systems",
                "Prototype Strategy",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between rounded-xl border border-neutral-200/80 px-3 py-2 text-sm text-neutral-600 dark:border-white/10 dark:text-neutral-300"
                >
                  <span>{item}</span>
                  <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500">
                    Expert
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
