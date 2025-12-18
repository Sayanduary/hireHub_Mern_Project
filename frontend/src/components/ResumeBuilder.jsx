import React, { useState, useRef } from "react";
import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";
import { Button } from "./ui/button";
import { Download, RotateCcw, Eye, Edit } from "lucide-react";
import { toast } from "sonner";
import ResumeForm from "./resume/ResumeForm";
import ResumePreview from "./resume/ResumePreview";
import html2pdf from "html2pdf.js";

const ResumeBuilder = () => {
  const [mode, setMode] = useState("edit");
  const previewRef = useRef(null);

  const [resumeData, setResumeData] = useState({
    personalDetails: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
    },
    professionalSummary: "",
    skills: [],
    education: [],
    experience: [],
    projects: [],
    certificates: [],
    references: null,
  });

  const handleResumeDataChange = (section, value) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: value,
    }));
  };

  const handleReset = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all data? This cannot be undone."
      )
    ) {
      setResumeData({
        personalDetails: {
          fullName: "",
          email: "",
          phone: "",
          location: "",
        },
        professionalSummary: "",
        skills: [],
        education: [],
        experience: [],
        projects: [],
        certificates: [],
        references: null,
      });
      setMode("edit");
      toast.success("Resume cleared successfully");
    }
  };

  const handleDownloadPDF = () => {
    if (!resumeData.personalDetails.fullName) {
      toast.error("Please enter your name before downloading");
      return;
    }

    const element = previewRef.current;
    const opt = {
      margin: 10,
      filename: `${resumeData.personalDetails.fullName}-Resume.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: "portrait", unit: "mm", format: "a4" },
    };

    html2pdf().set(opt).from(element).save();
    toast.success("Resume downloaded successfully");
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(resumeData, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `${
      resumeData.personalDetails.fullName || "resume"
    }-backup.json`;
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
    toast.success("Resume exported as JSON");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#121212] flex flex-col">
      <Navbar />

      <section className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            Resume Builder
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Create a professional resume with live preview
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mb-6 flex flex-wrap gap-3">
          <Button
            onClick={() => setMode("edit")}
            variant={mode === "edit" ? "default" : "outline"}
            className="gap-2"
          >
            <Edit size={16} />
            Edit
          </Button>
          <Button
            onClick={() => setMode("preview")}
            variant={mode === "preview" ? "default" : "outline"}
            className="gap-2"
          >
            <Eye size={16} />
            Preview
          </Button>
          <Button
            onClick={handleDownloadPDF}
            variant="secondary"
            className="gap-2"
          >
            <Download size={16} />
            Download PDF
          </Button>
          <Button
            onClick={handleExportJSON}
            variant="outline"
            className="gap-2"
          >
            Export JSON
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="gap-2 text-red-600 hover:text-red-700 dark:text-red-400"
          >
            <RotateCcw size={16} />
            Reset
          </Button>
        </div>

        {/* Main Content */}
        {mode === "edit" ? (
          <ResumeForm
            resumeData={resumeData}
            onDataChange={handleResumeDataChange}
          />
        ) : (
          <div className="rounded-lg border border-gray-200 bg-white p-8 dark:border-[#444444] dark:bg-[#0d0d0d]">
            <div ref={previewRef} className="bg-white p-8">
              <ResumePreview resumeData={resumeData} />
            </div>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default ResumeBuilder;
