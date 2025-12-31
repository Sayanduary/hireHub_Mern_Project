import React, { useState, useEffect } from "react";
import {
  Upload,
  FileText,
  Search,
  AlertCircle,
  CheckCircle,
  XCircle,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "./ui/button";
import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001"
).replace(/\/$/, "");
const ATS_API_END_POINT = `${API_BASE_URL}/api/v1/ats`;

const ATSCheck = () => {
  const { user } = useSelector((s) => s.auth);
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [inputMode, setInputMode] = useState("paste"); // 'paste' or 'select'
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/v1/job/get`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setJobs(res.data.jobs || []);
      }
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!validTypes.includes(file.type)) {
        toast.error("Only PDF and DOCX files are allowed");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setResumeFile(file);
    }
  };

  const handleJobSelect = (e) => {
    const jobId = e.target.value;
    setSelectedJobId(jobId);
    if (jobId) {
      const job = jobs.find((j) => j._id === jobId);
      if (job) {
        setJobDescription(job.description || "");
      }
    } else {
      setJobDescription("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resumeFile) {
      toast.error("Please upload your resume");
      return;
    }

    if (!jobDescription.trim()) {
      toast.error("Please provide a job description");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("resume", resumeFile);
      formData.append("jobDescription", jobDescription);

      const res = await axios.post(`${ATS_API_END_POINT}/check`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (res.data.success) {
        setResult(res.data.result);
        toast.success("ATS analysis completed");
      } else {
        toast.error(res.data.message || "Analysis failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to analyze resume");
      console.error("ATS Check error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Improvement";
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Search className="h-8 w-8 text-gray-900 dark:text-white" />
              <h1
                className="text-4xl font-bold text-gray-900 dark:text-white"
                style={{ fontFamily: "'Oswald', sans-serif" }}
              >
                ATS Score Check
              </h1>
            </div>
            <p className="text-gray-600 dark:text-[#B0B0B0] text-lg">
              Analyze your resume against job descriptions using keyword
              matching
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
              <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <span className="text-sm text-amber-700 dark:text-amber-300">
                ATS score is an estimation based on keyword matching. Actual
                recruiter ATS systems may vary.
              </span>
            </div>
          </div>

          {/* Main Card */}
          <div className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-lg border border-gray-200 dark:border-[#2a2a2a] overflow-hidden">
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Resume Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Upload Resume
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label
                    htmlFor="resume-upload"
                    className="flex items-center justify-center gap-3 px-6 py-8 border-2 border-dashed border-gray-300 dark:border-[#2a2a2a] rounded-lg cursor-pointer hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
                  >
                    <Upload className="h-8 w-8 text-gray-400" />
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {resumeFile
                          ? resumeFile.name
                          : "Click to upload resume"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-[#808080] mt-1">
                        PDF or DOCX (Max 5MB)
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Job Description Input Mode Toggle */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Job Description
                </label>
                <div className="flex gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setInputMode("paste")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      inputMode === "paste"
                        ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-[#121212]"
                        : "bg-gray-100 text-gray-700 dark:bg-[#2a2a2a] dark:text-[#B0B0B0]"
                    }`}
                  >
                    Paste Description
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputMode("select")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      inputMode === "select"
                        ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-[#121212]"
                        : "bg-gray-100 text-gray-700 dark:bg-[#2a2a2a] dark:text-[#B0B0B0]"
                    }`}
                  >
                    Select Existing Job
                  </button>
                </div>

                {inputMode === "paste" ? (
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the full job description here..."
                    rows={10}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-[#2a2a2a] bg-white dark:bg-[#121212] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-[#606060] focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
                  />
                ) : (
                  <div className="space-y-3">
                    <select
                      value={selectedJobId}
                      onChange={handleJobSelect}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-[#2a2a2a] bg-white dark:bg-[#121212] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
                    >
                      <option value="">Select a job...</option>
                      {jobs.map((job) => (
                        <option key={job._id} value={job._id}>
                          {job.title} - {job.company?.name}
                        </option>
                      ))}
                    </select>
                    {jobDescription && (
                      <div className="p-4 rounded-lg bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-[#2a2a2a]">
                        <p className="text-sm text-gray-600 dark:text-[#B0B0B0] line-clamp-4">
                          {jobDescription}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full py-6 text-base font-semibold bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-[#121212] dark:hover:bg-gray-200 disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 border-2 border-white dark:border-[#121212] border-t-transparent rounded-full animate-spin" />
                    Analyzing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Check ATS Score
                  </div>
                )}
              </Button>
            </form>

            {/* Results Section */}
            {result && (
              <div className="border-t border-gray-200 dark:border-[#2a2a2a] p-8 space-y-8">
                {/* ATS Score */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      ATS Score
                    </h3>
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      {result.ats_score}%
                    </span>
                  </div>
                  <div className="relative h-4 bg-gray-200 dark:bg-[#2a2a2a] rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getScoreColor(
                        result.ats_score
                      )} transition-all duration-1000 ease-out`}
                      style={{ width: `${result.ats_score}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-[#B0B0B0] mt-2">
                    {getScoreLabel(result.ats_score)}
                  </p>
                </div>

                {/* Score Breakdown */}
                {result.details && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900">
                      <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        <span className="text-sm font-medium text-purple-900 dark:text-purple-300">
                          Skill Match
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                        {result.details.skill_match_percentage}%
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-900">
                      <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                        <span className="text-sm font-medium text-cyan-900 dark:text-cyan-300">
                          Keyword Match
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-cyan-700 dark:text-cyan-300">
                        {result.details.keyword_match_percentage}%
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900">
                      <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        <span className="text-sm font-medium text-indigo-900 dark:text-indigo-300">
                          Section Completeness
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
                        {result.details.section_completeness}%
                      </p>
                    </div>
                  </div>
                )}

                {/* Summary */}
                {result.summary && (
                  <div className="p-5 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900">
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-1">
                          Analysis Summary
                        </h4>
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          {result.summary}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Matched Skills */}
                {result.matched_skills && result.matched_skills.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        Matched Skills
                      </h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {result.matched_skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 rounded-full bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-300 text-sm font-medium border border-green-200 dark:border-green-900"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Missing Skills */}
                {result.missing_skills && result.missing_skills.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        Missing Skills
                      </h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {result.missing_skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 rounded-full bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-300 text-sm font-medium border border-red-200 dark:border-red-900"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Improvement Tips */}
                {result.improvement_tips &&
                  result.improvement_tips.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          Improvement Tips
                        </h4>
                      </div>
                      <ul className="space-y-2">
                        {result.improvement_tips.map((tip, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-3 text-sm text-gray-700 dark:text-[#B0B0B0]"
                          >
                            <span className="flex-shrink-0 h-6 w-6 rounded-full bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 flex items-center justify-center text-xs font-semibold">
                              {idx + 1}
                            </span>
                            <span className="pt-0.5">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {/* Resume Sections to Improve */}
                {result.resume_sections_to_improve &&
                  result.resume_sections_to_improve.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Missing Resume Sections
                      </h4>
                      <div className="space-y-2">
                        {result.resume_sections_to_improve.map(
                          (section, idx) => (
                            <div
                              key={idx}
                              className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-[#2a2a2a] text-sm text-gray-700 dark:text-[#B0B0B0] capitalize"
                            >
                              Add a {section} section
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {/* Skills Stats */}
                {result.details && (
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-[#2a2a2a]">
                    <p className="text-sm text-gray-600 dark:text-[#808080]">
                      Found{" "}
                      <strong className="text-gray-900 dark:text-white">
                        {result.details.total_resume_skills}
                      </strong>{" "}
                      skills in your resume • Job requires{" "}
                      <strong className="text-gray-900 dark:text-white">
                        {result.details.total_job_skills}
                      </strong>{" "}
                      skills • You match{" "}
                      <strong className="text-green-600 dark:text-green-400">
                        {result.matched_skills?.length || 0}
                      </strong>{" "}
                      skills
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ATSCheck;
