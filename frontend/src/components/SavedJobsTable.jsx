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
      className={`overflow-hidden rounded-md border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 ${className}`}
    >
      <Table className="min-w-[640px]">
        <TableCaption className="px-6 pb-6 text-left text-sm text-gray-500 dark:text-gray-400">
          Your saved jobs
        </TableCaption>
        <TableHeader className="bg-gray-50 dark:bg-gray-900">
          <TableRow className="border-gray-200 dark:border-gray-800">
            <TableHead className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Date Saved
            </TableHead>
            <TableHead className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Job Role
            </TableHead>
            <TableHead className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Company
            </TableHead>
            <TableHead className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Job Type
            </TableHead>
            <TableHead className="text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {hasSaved ? (
            savedJobs.map((job) => (
              <TableRow
                key={job._id}
                className="border-gray-200 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-900"
              >
                <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                  {job?.createdAt?.split("T")[0]}
                </TableCell>
                <TableCell className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {job?.title}
                </TableCell>
                <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                  {job?.company?.name}
                </TableCell>
                <TableCell>
                  <Badge className="rounded-md border border-gray-200 bg-gray-100 px-3 py-1 text-xs font-medium text-gray-900 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100">
                    {job?.jobType}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <button
                    onClick={() => handleRemoveSavedJob(job._id)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-100"
                    title="Remove from saved jobs"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow className="border-gray-200 dark:border-gray-800">
              <TableCell colSpan="5" className="py-12 text-center">
                <div className="mx-auto max-w-sm space-y-2 text-gray-600 dark:text-gray-400">
                  <p className="text-sm font-semibold">No saved jobs yet</p>
                  <p className="text-sm">
                    Save jobs to track opportunities that interest you.
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
