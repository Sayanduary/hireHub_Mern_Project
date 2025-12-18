import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import PersonalDetailsForm from "./sections/PersonalDetailsForm";
import ProfessionalSummaryForm from "./sections/ProfessionalSummaryForm";
import SkillsForm from "./sections/SkillsForm";
import EducationForm from "./sections/EducationForm";
import ExperienceForm from "./sections/ExperienceForm";
import ProjectsForm from "./sections/ProjectsForm";
import CertificatesForm from "./sections/CertificatesForm";
import ReferencesForm from "./sections/ReferencesForm";

const ResumeForm = ({ resumeData, onDataChange }) => {
  const [expandedSections, setExpandedSections] = React.useState({
    personal: true,
    summary: true,
    skills: false,
    education: false,
    experience: false,
    projects: false,
    certificates: false,
    references: false,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const SectionHeader = ({ title, section, count }) => (
    <button
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between px-6 py-4 bg-gray-100 dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-[#333333] hover:bg-gray-50 dark:hover:bg-[#222222] transition-colors rounded-lg rounded-b-none"
    >
      <div className="flex items-center gap-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
        {count > 0 && (
          <span className="px-2 py-1 bg-gray-200 dark:bg-[#333333] rounded text-xs font-medium text-gray-700 dark:text-gray-300">
            {count}
          </span>
        )}
      </div>
      <span
        className={`transition-transform ${
          expandedSections[section] ? "rotate-180" : ""
        }`}
      >
        ▼
      </span>
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Personal Details */}
      <div className="rounded-lg border border-gray-200 overflow-hidden dark:border-[#444444]">
        <SectionHeader title="Personal Details" section="personal" />
        {expandedSections.personal && (
          <div className="p-6 bg-white dark:bg-[#0d0d0d] border-t border-gray-200 dark:border-[#333333]">
            <PersonalDetailsForm
              data={resumeData.personalDetails}
              onChange={(data) => onDataChange("personalDetails", data)}
            />
          </div>
        )}
      </div>

      {/* Professional Summary */}
      <div className="rounded-lg border border-gray-200 overflow-hidden dark:border-[#444444]">
        <SectionHeader title="Professional Summary" section="summary" />
        {expandedSections.summary && (
          <div className="p-6 bg-white dark:bg-[#0d0d0d] border-t border-gray-200 dark:border-[#333333]">
            <ProfessionalSummaryForm
              data={resumeData.professionalSummary}
              onChange={(data) => onDataChange("professionalSummary", data)}
            />
          </div>
        )}
      </div>

      {/* Skills */}
      <div className="rounded-lg border border-gray-200 overflow-hidden dark:border-[#444444]">
        <SectionHeader
          title="Skills"
          section="skills"
          count={resumeData.skills.length}
        />
        {expandedSections.skills && (
          <div className="p-6 bg-white dark:bg-[#0d0d0d] border-t border-gray-200 dark:border-[#333333]">
            <SkillsForm
              data={resumeData.skills}
              onChange={(data) => onDataChange("skills", data)}
            />
          </div>
        )}
      </div>

      {/* Education */}
      <div className="rounded-lg border border-gray-200 overflow-hidden dark:border-[#444444]">
        <SectionHeader
          title="Education"
          section="education"
          count={resumeData.education.length}
        />
        {expandedSections.education && (
          <div className="p-6 bg-white dark:bg-[#0d0d0d] border-t border-gray-200 dark:border-[#333333]">
            <EducationForm
              data={resumeData.education}
              onChange={(data) => onDataChange("education", data)}
            />
          </div>
        )}
      </div>

      {/* Experience */}
      <div className="rounded-lg border border-gray-200 overflow-hidden dark:border-[#444444]">
        <SectionHeader
          title="Work Experience"
          section="experience"
          count={resumeData.experience.length}
        />
        {expandedSections.experience && (
          <div className="p-6 bg-white dark:bg-[#0d0d0d] border-t border-gray-200 dark:border-[#333333]">
            <ExperienceForm
              data={resumeData.experience}
              onChange={(data) => onDataChange("experience", data)}
            />
          </div>
        )}
      </div>

      {/* Projects */}
      <div className="rounded-lg border border-gray-200 overflow-hidden dark:border-[#444444]">
        <SectionHeader
          title="Projects"
          section="projects"
          count={resumeData.projects.length}
        />
        {expandedSections.projects && (
          <div className="p-6 bg-white dark:bg-[#0d0d0d] border-t border-gray-200 dark:border-[#333333]">
            <ProjectsForm
              data={resumeData.projects}
              onChange={(data) => onDataChange("projects", data)}
            />
          </div>
        )}
      </div>

      {/* Certificates */}
      <div className="rounded-lg border border-gray-200 overflow-hidden dark:border-[#444444]">
        <SectionHeader
          title="Certificates"
          section="certificates"
          count={resumeData.certificates.length}
        />
        {expandedSections.certificates && (
          <div className="p-6 bg-white dark:bg-[#0d0d0d] border-t border-gray-200 dark:border-[#333333]">
            <CertificatesForm
              data={resumeData.certificates}
              onChange={(data) => onDataChange("certificates", data)}
            />
          </div>
        )}
      </div>

      {/* References */}
      <div className="rounded-lg border border-gray-200 overflow-hidden dark:border-[#444444]">
        <SectionHeader title="References (PDF)" section="references" />
        {expandedSections.references && (
          <div className="p-6 bg-white dark:bg-[#0d0d0d] border-t border-gray-200 dark:border-[#333333]">
            <ReferencesForm
              data={resumeData.references}
              onChange={(data) => onDataChange("references", data)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeForm;
