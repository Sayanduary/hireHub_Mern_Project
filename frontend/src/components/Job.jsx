import React, { useState } from "react";
import { Button } from "./ui/button";
import { Bookmark, MapPin, Briefcase, Clock } from "lucide-react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import { addAppliedJobId } from "@/redux/applicationSlice";

const Job = ({ job }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const { appliedJobIds } = useSelector((store) => store.application);
  const [isLoading, setIsLoading] = useState(false);
  
  // Check if user has already applied to this job using centralized Redux state
  const isApplied = appliedJobIds.includes(job?._id);

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
      toast.error("Please login to apply for this job", { duration: 2000 });
      navigate("/login");
      return;
    }

    if (isApplied) {
      toast.info("You have already applied to this job", { duration: 2000 });
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.get(
        `${APPLICATION_API_END_POINT}/apply/${job._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        // Update centralized Redux state immediately
        dispatch(addAppliedJobId(job._id));
        toast.success(res.data.message, { duration: 1500 });
        // Don't navigate - keep user on current page
      }
    } catch (error) {
      const errorData = error.response?.data;
      
      // Check if profile is incomplete
      if (errorData?.profileIncomplete) {
        toast.error(errorData.message || "Complete your profile to apply for jobs", { duration: 2500 });
        
        // Show missing fields
        if (errorData.missingFields && errorData.missingFields.length > 0) {
          setTimeout(() => {
            toast.info(`Missing: ${errorData.missingFields.join(", ")}`, { duration: 2500 });
          }, 500);
        }
        
        // Redirect to profile page after a short delay
        setTimeout(() => {
          navigate("/profile");
        }, 1500);
      } else {
        toast.error(errorData?.message || "Failed to apply", { duration: 2000 });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <article className="group flex h-full flex-col rounded-xl border border-gray-200 bg-white p-6 transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg hover:border-gray-300 dark:border-[#444444] dark:bg-[#121212] dark:hover:border-[#888888]">
      <div className="flex items-start justify-between text-xs text-gray-500 dark:text-[#888888]">
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
          className="h-8 w-8 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 hover:scale-105 dark:text-[#888888] dark:hover:text-[#E0E0E0] dark:hover:bg-[#1a1a1a] transition-all duration-200"
          aria-label="Save job"
        >
          <Bookmark className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <Avatar className="h-12 w-12 rounded-xl border border-gray-200 bg-gray-50 dark:border-[#444444] dark:bg-[#1a1a1a] p-2 transition-transform duration-200 group-hover:scale-105">
          <AvatarImage
            src={
              job?.company?.logo ||
              "https://via.placeholder.com/150?text=Company"
            }
            alt={job?.company?.name || "Company"}
          />
        </Avatar>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-semibold text-gray-900 dark:text-[#E0E0E0]">
            {job?.company?.name}
          </h2>
          <div className="mt-1 inline-flex items-center gap-1 text-xs text-gray-500 dark:text-[#888888]">
            <MapPin className="h-3.5 w-3.5" aria-hidden />
            <span className="truncate">{job?.location || "Remote"}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-1 flex-col gap-3">
        <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-[#E0E0E0]">
          {job?.title}
        </h3>
        <p className="text-sm leading-relaxed text-gray-600 dark:text-[#B0B0B0] line-clamp-3">
          {job?.description}
        </p>

        <div className="flex flex-wrap gap-2 pt-2">
          <Badge className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:border-[#444444] dark:bg-[#1a1a1a] dark:text-[#B0B0B0] pointer-events-none">
            <Briefcase className="h-3 w-3" aria-hidden />
            {job?.position} roles
          </Badge>
          <Badge className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:border-[#444444] dark:bg-[#1a1a1a] dark:text-[#B0B0B0] pointer-events-none">
            {job?.jobType}
          </Badge>
          <Badge className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:border-[#444444] dark:bg-[#1a1a1a] dark:text-[#B0B0B0] pointer-events-none">
            ₹ {job?.salary} LPA
          </Badge>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-3 border-t border-gray-200 pt-5 dark:border-[#444444]">
        <Button
          onClick={() => navigate(`/description/${job?._id}`)}
          variant="ghost"
          className="h-11 flex-1 rounded-lg border-2 border-gray-200 text-sm font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300 dark:border-[#444444] dark:text-[#B0B0B0] dark:hover:text-[#E0E0E0] dark:hover:bg-[#1a1a1a] dark:hover:border-[#888888] transition-all duration-200"
        >
          View details
        </Button>
        <Button
          onClick={handleApply}
          disabled={isLoading || isApplied}
          className="h-11 flex-1 rounded-lg bg-gray-900 text-sm font-semibold text-white hover:bg-black hover:scale-[1.02] disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:scale-100 dark:bg-[#E0E0E0] dark:text-[#121212] dark:hover:bg-[#888888] dark:disabled:bg-[#1a1a1a] dark:disabled:text-[#888888] transition-all duration-200 shadow-sm"
        >
          {isLoading ? "Applying..." : isApplied ? "Applied" : "Apply now"}
        </Button>
      </div>
    </article>
  );
};

export default Job;
