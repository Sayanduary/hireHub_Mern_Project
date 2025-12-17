import React from "react";
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
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { setAllAppliedJobs } from "@/redux/applicationSlice";
import { Trash2 } from "lucide-react";

const AppliedJobTable = () => {
  const { applied } = useSelector((store) => store.application);
  const dispatch = useDispatch();

  const handleDeleteApplication = async (applicationId) => {
    try {
      const res = await axios.delete(
        `${APPLICATION_API_END_POINT}/${applicationId}`,
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success("Application withdrawn successfully");
        // Remove from local state
        const updatedApplied = applied.filter(
          (app) => app._id !== applicationId
        );
        dispatch(setAllAppliedJobs(updatedApplied));
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Failed to withdraw application"
      );
    }
  };

  return (
    <div>
      <Table>
        <TableCaption>A list of your applied jobs</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Job Role</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applied.length <= 0 ? (
            <span>You haven't applied any job yet.</span>
          ) : (
            applied.map((appliedJob) => (
              <TableRow key={appliedJob._id}>
                <TableCell>{appliedJob?.createdAt?.split("T")[0]}</TableCell>
                <TableCell>{appliedJob.job?.title}</TableCell>
                <TableCell>{appliedJob.job?.company?.name}</TableCell>
                <TableCell>
                  <Badge
                    className={`rounded-md ${
                      appliedJob?.status === "rejected"
                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                        : appliedJob.status === "pending"
                        ? "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
                        : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                    }`}
                  >
                    {appliedJob.status.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <button
                    onClick={() => handleDeleteApplication(appliedJob._id)}
                    className="text-red-600 hover:text-red-800 transition"
                    title="Withdraw application"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AppliedJobTable;
