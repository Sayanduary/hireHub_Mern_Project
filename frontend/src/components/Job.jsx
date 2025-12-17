import { useState } from "react";
import PropTypes from "prop-types";
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

  const isApplied = appliedJobIds.includes(job?._id);

  const daysAgoFunction = (mongodbTime) => {
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    return Math.floor((currentTime - createdAt) / (1000 * 60 * 60 * 24));
  };

  const daysAgo = daysAgoFunction(job?.createdAt);

  const handleApply = async (e) => {
    e.stopPropagation();

    if (!user) {
      toast.error("Please login to apply for this job", { duration: 1000 });
      navigate("/login");
      return;
    }

    if (isApplied) {
      toast.info("You have already applied to this job", { duration: 1000 });
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.get(
        `${APPLICATION_API_END_POINT}/apply/${job._id}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(addAppliedJobId(job._id));
        toast.success(res.data.message, { duration: 1000 });
      }
    } catch (error) {
      const errorData = error.response?.data;

      if (errorData?.profileIncomplete) {
        toast.error(errorData.message, { duration: 1000 });

        if (errorData.missingFields?.length) {
          setTimeout(() => {
            toast.info(`Missing: ${errorData.missingFields.join(", ")}`, {
              duration: 1000,
            });
          }, 500);
        }

        setTimeout(() => navigate("/profile"), 1500);
      } else {
        toast.error(errorData?.message || "Failed to apply", {
          duration: 1000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <article
      className="
        group relative flex h-full flex-col rounded-xl
        border border-gray-200 dark:border-[#444444]
        bg-white dark:bg-[#121212]
        p-6 cursor-pointer

        transition-all duration-300
        ease-[cubic-bezier(0.22,1,0.36,1)]
        hover:-translate-y-1.5
        hover:shadow-[0_18px_40px_-18px_rgba(0,0,0,0.35)]
        dark:hover:shadow-[0_18px_40px_-18px_rgba(0,0,0,0.6)]
        hover:border-gray-300 dark:hover:border-[#888888]

        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-black/20
        dark:focus-visible:ring-[#888888]/30
      "
      onClick={() => navigate(`/description/${job?._id}`)}
      tabIndex={0}
    >
      {/* Top meta */}
      <div className="flex items-start justify-between text-xs text-gray-500 dark:text-[#888888]">
        <div className="inline-flex items-center gap-2">
          <Clock className="h-3.5 w-3.5" />
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
          onClick={(e) => e.stopPropagation()}
          className="
            h-8 w-8 rounded-lg
            text-gray-500 dark:text-[#888888]
            transition-all duration-200
            hover:bg-gray-100 dark:hover:bg-[#1f1f1f]
            hover:text-gray-900 dark:hover:text-[#E0E0E0]
            hover:scale-[1.05]
            active:scale-[0.96]
          "
        >
          <Bookmark className="h-4 w-4" />
        </Button>
      </div>

      {/* Company */}
      <div className="mt-5 flex items-center gap-3">
        <Avatar
          className="
            h-12 w-12 rounded-xl p-2
            border border-gray-200 dark:border-[#444444]
            bg-gray-50 dark:bg-[#1a1a1a]
            transition-transform duration-300
            group-hover:scale-[1.06]
            group-hover:-rotate-[1deg]
          "
        >
          <AvatarImage
            src={job?.company?.logo || "https://via.placeholder.com/150"}
            alt={job?.company?.name}
          />
        </Avatar>

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-semibold text-gray-900 dark:text-[#E0E0E0]">
            {job?.company?.name}
          </h2>
          <div className="mt-1 inline-flex items-center gap-1 text-xs text-gray-500 dark:text-[#888888]">
            <MapPin className="h-3.5 w-3.5" />
            <span className="truncate">{job?.location || "Remote"}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mt-6 flex flex-1 flex-col gap-3">
        <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-[#E0E0E0]">
          {job?.title}
        </h3>

        <p className="text-sm leading-relaxed text-gray-600 dark:text-[#B0B0B0] line-clamp-3">
          {job?.description}
        </p>

        <div className="flex flex-wrap gap-2 pt-2">
          <Badge className="pointer-events-none rounded-full px-3 py-1.5 text-xs font-semibold border bg-gray-50 text-gray-700 dark:bg-[#1a1a1a] dark:text-[#B0B0B0] dark:border-[#444444]">
            <Briefcase className="mr-1 h-3 w-3" />
            {job?.position} roles
          </Badge>
          <Badge className="pointer-events-none rounded-full px-3 py-1.5 text-xs font-semibold border bg-gray-50 text-gray-700 dark:bg-[#1a1a1a] dark:text-[#B0B0B0] dark:border-[#444444]">
            {job?.jobType}
          </Badge>
          <Badge className="pointer-events-none rounded-full px-3 py-1.5 text-xs font-semibold border bg-gray-50 text-gray-700 dark:bg-[#1a1a1a] dark:text-[#B0B0B0] dark:border-[#444444]">
            ₹ {job?.salary} LPA
          </Badge>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex items-center gap-3 border-t border-gray-200 pt-5 dark:border-[#444444]">
        <Button
          variant="ghost"
          className="
            h-11 flex-1 rounded-lg
            border-2 border-gray-900
            text-sm font-semibold text-gray-900
            transition-all duration-200
            hover:bg-gray-900/10 hover:border-gray-800
            dark:border-[#444444]
            dark:text-[#B0B0B0]
            dark:hover:bg-[#1a1a1a]
            dark:hover:border-[#888888]
          "
        >
          View details
        </Button>

        <Button
          onClick={handleApply}
          disabled={isLoading || isApplied}
          className="
            h-11 flex-1 rounded-lg
            bg-gray-900 text-white
            text-sm font-semibold

            transition-all duration-300
            ease-[cubic-bezier(0.22,1,0.36,1)]
            hover:scale-[1.04]
            active:scale-[0.97]
            hover:bg-gray-800
            disabled:scale-100

            dark:bg-[#E0E0E0]
            dark:text-[#121212]
            dark:hover:bg-[#888888]
            dark:disabled:bg-[#1a1a1a]
            dark:disabled:text-[#888888]
          "
        >
          {isLoading ? "Applying..." : isApplied ? "Applied" : "Apply now"}
        </Button>
      </div>
    </article>
  );
};

Job.propTypes = {
  job: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    location: PropTypes.string,
    position: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    jobType: PropTypes.string,
    salary: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    createdAt: PropTypes.string,
    company: PropTypes.shape({
      name: PropTypes.string,
      logo: PropTypes.string,
    }),
  }).isRequired,
};

export default Job;
