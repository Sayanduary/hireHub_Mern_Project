import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { Trash2 } from "lucide-react";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import PropTypes from "prop-types";

const SavedJobsTable = ({ savedJobs, onRemove, className = "" }) => {
  const handleRemoveSavedJob = async (jobId) => {
    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/save-job/${jobId}`,
        {},
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success("Job removed from saved jobs");
        onRemove(jobId);
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Failed to remove saved job"
      );
    }
  };

  const hasSaved = savedJobs && savedJobs.length > 0;

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-neutral-200/80 bg-white/60 shadow-none transition-colors dark:border-white/10 dark:bg-[#0a0a0a]/60 ${className}`}
    >
      <Table className="min-w-[640px]">
        <TableCaption className="px-6 pb-6 text-left text-xs uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500">
          Your curated list of roles
        </TableCaption>
        <TableHeader className="bg-white/70 text-neutral-500 dark:bg-white/5 dark:text-neutral-400">
          <TableRow className="border-neutral-200/80 dark:border-white/10">
            <TableHead className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
              Date Saved
            </TableHead>
            <TableHead className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
              Job Role
            </TableHead>
            <TableHead className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
              Company
            </TableHead>
            <TableHead className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
              Job Type
            </TableHead>
            <TableHead className="text-right text-xs font-medium uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {hasSaved ? (
            savedJobs.map((job) => (
              <TableRow
                key={job._id}
                className="border-neutral-200/80 text-sm text-neutral-600 transition-colors hover:bg-white/80 dark:border-white/10 dark:text-neutral-300 dark:hover:bg-white/5"
              >
                <TableCell className="whitespace-nowrap text-xs font-medium text-neutral-500 dark:text-neutral-400">
                  {job?.createdAt?.split("T")[0]}
                </TableCell>
                <TableCell className="text-sm font-medium text-neutral-800 dark:text-neutral-100">
                  {job?.title}
                </TableCell>
                <TableCell className="text-sm text-neutral-600 dark:text-neutral-300">
                  {job?.company?.name}
                </TableCell>
                <TableCell>
                  <Badge className="rounded-full border border-neutral-200/70 bg-transparent px-3 py-1 text-xs font-medium text-neutral-600 dark:border-white/10 dark:text-neutral-300">
                    {job?.jobType}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <button
                    onClick={() => handleRemoveSavedJob(job._id)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-transparent text-neutral-500 transition-colors hover:border-neutral-300 hover:bg-white/80 hover:text-neutral-900 dark:text-neutral-400 dark:hover:border-white/15 dark:hover:bg-white/10 dark:hover:text-neutral-50"
                    title="Remove from saved jobs"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow className="border-neutral-200/80 dark:border-white/10">
              <TableCell colSpan="5" className="py-12 text-center">
                <div className="mx-auto max-w-sm space-y-2 text-neutral-500 dark:text-neutral-400">
                  <p className="text-sm font-medium">No saved roles yet</p>
                  <p className="text-xs leading-relaxed">
                    Track opportunities by tapping the bookmark icon on jobs
                    that catch your eye.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default SavedJobsTable;

SavedJobsTable.propTypes = {
  savedJobs: PropTypes.array,
  onRemove: PropTypes.func.isRequired,
  className: PropTypes.string,
};
