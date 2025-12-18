import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Download, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import resumeAPI from "../utils/resumeAPI";
import {
  setResumes,
  removeResumeFromList,
  setCurrentResume,
} from "../redux/resumeSlice";

const MyResumesTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { resumes } = useSelector((state) => state.resume);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    setLoading(true);
    try {
      const response = await resumeAPI.getAll();
      dispatch(setResumes(response.data.resumes || []));
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load resumes");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (resume) => {
    dispatch(setCurrentResume({ id: resume._id, data: resume.resumeData }));
    navigate("/resume-builder");
  };

  const handleDownload = (resume) => {
    if (resume.pdfUrl) {
      const link = document.createElement("a");
      link.href = resume.pdfUrl;
      link.download = `${resume.title}.pdf`;
      link.click();
      toast.success("Downloading...");
    } else {
      toast.error("PDF URL not available");
    }
  };

  const handleDelete = async (resumeId) => {
    if (!window.confirm("Are you sure you want to delete this resume?")) {
      return;
    }

    setDeleting(resumeId);
    try {
      await resumeAPI.delete(resumeId);
      dispatch(removeResumeFromList(resumeId));
      toast.success("Resume deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || "Failed to delete resume");
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading resumes...</div>;
  }

  if (resumes.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          No resumes yet. Create one to get started!
        </p>
        <Button onClick={() => navigate("/resume-builder")}>
          Create Resume
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-300 dark:border-[#444444]">
            <th className="text-left py-3 px-4 text-gray-900 dark:text-white font-semibold">
              Title
            </th>
            <th className="text-left py-3 px-4 text-gray-900 dark:text-white font-semibold">
              Template
            </th>
            <th className="text-left py-3 px-4 text-gray-900 dark:text-white font-semibold">
              Created
            </th>
            <th className="text-left py-3 px-4 text-gray-900 dark:text-white font-semibold">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {resumes.map((resume) => (
            <tr
              key={resume._id}
              className="border-b border-gray-200 dark:border-[#333333] hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors"
            >
              <td className="py-3 px-4 text-gray-900 dark:text-white">
                {resume.title}
              </td>
              <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs font-medium">
                  {resume.templateType === "ui" ? "UI Builder" : "LaTeX"}
                </span>
              </td>
              <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                {new Date(resume.createdAt).toLocaleDateString()}
              </td>
              <td className="py-3 px-4">
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleEdit(resume)}
                    variant="outline"
                    size="sm"
                    className="gap-1"
                  >
                    <Edit2 size={14} /> Edit
                  </Button>
                  <Button
                    onClick={() => handleDownload(resume)}
                    variant="outline"
                    size="sm"
                    className="gap-1"
                  >
                    <Download size={14} /> Download
                  </Button>
                  <Button
                    onClick={() => handleDelete(resume._id)}
                    disabled={deleting === resume._id}
                    variant="outline"
                    size="sm"
                    className="gap-1 text-red-600"
                  >
                    <Trash2 size={14} />
                    {deleting === resume._id ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyResumesTable;
