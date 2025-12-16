import React, { useState } from "react";
import { Button } from "./ui/button";
import { Bookmark, MapPin, Briefcase, Clock } from "lucide-react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { APPLICATION_API_END_POINT } from "@/utils/constant";

const Job = ({ job }) => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const [isLoading, setIsLoading] = useState(false);

  const daysAgoFunction = (mongodbTime) => {
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const timeDifference = currentTime - createdAt;
    return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
  };

  const daysAgo = daysAgoFunction(job?.createdAt);

  const handleApply = async (e) => {
    e.stopPropagation();
    if (!user) {
      toast.error("Please login to apply for this job");
      navigate("/login");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.get(
        `${APPLICATION_API_END_POINT}/apply/${job._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        navigate(`/description/${job._id}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to apply");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <article className="flex h-full flex-col rounded-2xl border border-neutral-200/80 bg-white/80 p-6 transition-colors duration-200 hover:border-neutral-400 dark:border-white/10 dark:bg-[#0a0a0a]/80 dark:hover:border-white/20">
      <div className="flex items-start justify-between text-xs text-neutral-500 dark:text-neutral-400">
        <div className="inline-flex items-center gap-2">
          <Clock className="h-3.5 w-3.5" aria-hidden />
          <span>
            {daysAgo === 0
              ? "Today"
              : daysAgo === 1
              ? "Yesterday"
              : `${daysAgo} days ago`}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full border border-transparent text-neutral-500 transition-colors hover:border-neutral-300 hover:bg-white/70 hover:text-neutral-900 dark:text-neutral-400 dark:hover:border-white/10 dark:hover:bg-white/5 dark:hover:text-neutral-100"
          aria-label="Save job"
        >
          <Bookmark className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <Avatar className="h-12 w-12 border border-neutral-200/80 bg-white/70 dark:border-white/10 dark:bg-white/5">
          <AvatarImage
            src={
              job?.company?.logo ||
              "https://via.placeholder.com/150?text=Company"
            }
            alt={job?.company?.name || "Company"}
          />
        </Avatar>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            {job?.company?.name}
          </h2>
          <div className="mt-1 inline-flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
            <MapPin className="h-3.5 w-3.5" aria-hidden />
            <span className="truncate">{job?.location || "Remote"}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-1 flex-col gap-3">
        <h3 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
          {job?.title}
        </h3>
        <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400 line-clamp-3">
          {job?.description}
        </p>

        <div className="flex flex-wrap gap-2 pt-2">
          <Badge className="flex items-center gap-1 rounded-full border bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-900 dark:border-white/20 dark:bg-white/10 dark:text-neutral-100 pointer-events-none">
            <Briefcase className="h-3 w-3" aria-hidden />
            {job?.position} roles
          </Badge>
          <Badge className="rounded-full border bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-900 dark:border-white/20 dark:bg-white/10 dark:text-neutral-100 pointer-events-none">
            {job?.jobType}
          </Badge>
          <Badge className="flex items-center gap-1 rounded-full border bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-900 dark:border-white/20 dark:bg-white/10 dark:text-neutral-100 pointer-events-none">
            ₹ {job?.salary} LPA
          </Badge>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-2 border-t border-neutral-200/80 pt-4 dark:border-white/10">
        <Button
          onClick={() => navigate(`/description/${job?._id}`)}
          variant="ghost"
          className="h-11 flex-1 rounded-xl border border-neutral-200/80 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-400 hover:bg-white dark:border-white/10 dark:text-neutral-200 dark:hover:border-white/20 dark:hover:bg-white/5"
        >
          View details
        </Button>
        <Button
          onClick={handleApply}
          disabled={isLoading}
          className="h-11 flex-1 rounded-xl border border-neutral-900 bg-neutral-900 text-sm font-medium text-neutral-100 transition-colors hover:bg-neutral-800 disabled:opacity-50 dark:border-transparent dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100"
        >
          {isLoading ? "Applying..." : "Apply now"}
        </Button>
      </div>
    </article>
  );
};

export default Job;
