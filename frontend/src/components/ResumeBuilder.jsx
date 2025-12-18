import React, { useState, useRef } from "react";
import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";
import { Button } from "./ui/button";
import { Download, RotateCcw, Eye, Edit } from "lucide-react";
import { toast } from "sonner";
import ResumeForm from "./resume/ResumeForm";
import ResumePreview from "./resume/ResumePreview";
import { generateResumePDF } from "./resume/pdfGenerator";

/* ======================
   Country + Phone Config
====================== */
const COUNTRY_CONFIG = {
  IN: { label: "India", code: "+91", digits: 10 },
  US: { label: "United States", code: "+1", digits: 10 },
  UK: { label: "United Kingdom", code: "+44", digits: 10 },
  AU: { label: "Australia", code: "+61", digits: 9 },
};

/* ======================
   Default Resume State
====================== */
const DEFAULT_RESUME_DATA = {
  personalDetails: {
    fullName: "",
    email: "",
    country: "IN",
    phone: "+91 ",
    location: "",
    profiles: [
      { platform: "LinkedIn", url: "" },
      { platform: "GitHub", url: "" },
      { platform: "LeetCode", url: "" },
    ],
  },
  professionalSummary: "",
  skills: [],
  education: [],
  experience: [],
  projects: [],
  certificates: [],
  references: null,
};

const ResumeBuilder = () => {
  const [mode, setMode] = useState("edit");
  const previewRef = useRef(null);
  const [resumeData, setResumeData] = useState(DEFAULT_RESUME_DATA);

  /* ======================
     Data Change Handler
  ====================== */
  const handleResumeDataChange = (section, value) => {
    setResumeData((prev) => {
      if (section === "personalDetails") {
        return {
          ...prev,
          personalDetails: { ...prev.personalDetails, ...value },
        };
      }

      return { ...prev, [section]: value };
    });
  };

  /* ======================
     Reset
  ====================== */
  const handleReset = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all data? This cannot be undone."
      )
    ) {
      setResumeData(DEFAULT_RESUME_DATA);
      setMode("edit");
      toast.success("Resume cleared successfully");
    }
  };

  /* ======================
     Download PDF
  ====================== */
  const handleDownloadPDF = () => {
    const { fullName, phone, country } = resumeData.personalDetails;
    const cfg = COUNTRY_CONFIG[country];

    if (!fullName) {
      toast.error("Please enter your name before downloading");
      return;
    }

    const digits = phone.replace(/\D/g, "");
    if (digits.length !== cfg.digits) {
      toast.error(`Phone number must be ${cfg.digits} digits`);
      return;
    }

    try {
      const safeName = fullName
        .trim()
        .replace(/\s+/g, "_")
        .replace(/[^a-zA-Z0-9_]/g, "");

      generateResumePDF(resumeData, `${safeName}_Resume.pdf`);
      toast.success("Resume downloaded successfully");
    } catch (err) {
      console.error(err);
      toast.error("Error generating PDF");
    }
  };

  /* ======================
     Export JSON
  ====================== */
  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(resumeData, null, 2)], {
      type: "application/json",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${
      resumeData.personalDetails.fullName || "resume"
    }-backup.json`;
    link.click();

    toast.success("Resume exported as JSON");
  };

  /* ======================
     Render
  ====================== */
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#121212] flex flex-col">
      <Navbar />

      <section className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Resume Builder
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Create a professional resume with live preview
          </p>
        </div>

        {/* Actions */}
        <div className="mb-6 flex flex-wrap gap-3">
          <Button
            onClick={() => setMode("edit")}
            variant={mode === "edit" ? "default" : "outline"}
            className="gap-2"
          >
            <Edit size={16} /> Edit
          </Button>

          <Button
            onClick={() => setMode("preview")}
            variant={mode === "preview" ? "default" : "outline"}
            className="gap-2"
          >
            <Eye size={16} /> Preview
          </Button>

          <Button
            onClick={handleDownloadPDF}
            variant="secondary"
            className="gap-2"
          >
            <Download size={16} /> Download PDF
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
            className="gap-2 text-red-600"
          >
            <RotateCcw size={16} /> Reset
          </Button>
        </div>

        {/* Content */}
        {mode === "edit" ? (
          <ResumeForm
            resumeData={resumeData}
            onDataChange={handleResumeDataChange}
            countryConfig={COUNTRY_CONFIG}
          />
        ) : (
          /* =========================
             PREVIEW (FORCED LIGHT)
          ========================== */
          <div className="rounded-lg border border-gray-300 bg-gray-100 p-6">
            <div
              ref={previewRef}
              className="
                bg-white
                text-black
                p-8
                shadow-md
                max-w-[800px]
                mx-auto
              "
            >
              {/* Light-theme-only preview */}
              <div className="prose prose-neutral max-w-none">
                <ResumePreview resumeData={resumeData} />
              </div>
            </div>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default ResumeBuilder;
