import React from "react";
import ReactMarkdown from "react-markdown";
import { ExternalLink } from "lucide-react";

const ResumePreview = ({ resumeData }) => {
  const {
    personalDetails,
    professionalSummary,
    skills,
    education,
    experience,
    projects,
    certificates,
  } = resumeData;

  return (
    <div className="max-w-4xl mx-auto text-gray-900 font-serif">
      {/* Header */}
      {personalDetails.fullName && (
        <div className="mb-6 pb-6 border-b-2 border-gray-900">
          <h1 className="text-4xl font-bold mb-3">
            {personalDetails.fullName}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-700 mb-3">
            {personalDetails.email && (
              <span className="flex items-center gap-1">
                {personalDetails.email}
              </span>
            )}
            {personalDetails.phone && (
              <span className="flex items-center gap-1">
                {personalDetails.phone}
              </span>
            )}
            {personalDetails.location && (
              <span className="flex items-center gap-1">
                {personalDetails.location}
              </span>
            )}
          </div>

          {/* Social Profiles */}
          {(personalDetails.profiles || []).filter((p) => p.url).length > 0 && (
            <div className="flex flex-wrap gap-3 text-xs">
              {(personalDetails.profiles || [])
                .filter((p) => p.url)
                .map((profile, index) => (
                  <a
                    key={index}
                    href={profile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    {profile.platform} <ExternalLink size={12} />
                  </a>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Professional Summary */}
      {professionalSummary && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2 text-gray-900">
            Professional Summary
          </h2>
          <div className="text-sm text-gray-700 leading-relaxed prose prose-sm max-w-none">
            <ReactMarkdown>{professionalSummary}</ReactMarkdown>
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2 text-gray-900">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3 text-gray-900">Education</h2>
          <div className="space-y-3">
            {education.map((edu, index) => (
              <div key={index}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {edu.degree}
                    </h3>
                    <p className="text-gray-700">{edu.institution}</p>
                  </div>
                  {edu.duration && (
                    <span className="text-sm text-gray-600">
                      {edu.duration}
                    </span>
                  )}
                </div>
                {edu.score && (
                  <p className="text-sm text-gray-600">Score: {edu.score}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Work Experience */}
      {experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3 text-gray-900">
            Work Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {exp.position}
                    </h3>
                    <p className="text-gray-700">{exp.organization}</p>
                  </div>
                  {exp.duration && (
                    <span className="text-sm text-gray-600">
                      {exp.duration}
                    </span>
                  )}
                </div>
                {exp.description && (
                  <div className="text-sm text-gray-700 ml-4 prose prose-sm max-w-none">
                    <ReactMarkdown>{exp.description}</ReactMarkdown>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3 text-gray-900">Projects</h2>
          <div className="space-y-4">
            {projects.map((project, index) => (
              <div key={index}>
                {project.description && (
                  <div className="text-sm text-gray-700 prose prose-sm max-w-none">
                    <ReactMarkdown>{project.description}</ReactMarkdown>
                  </div>
                )}
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1 mt-1"
                  >
                    View Project <ExternalLink size={12} />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certificates */}
      {certificates.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3 text-gray-900">Certificates</h2>
          <div className="space-y-2">
            {certificates.map((cert, index) => (
              <div key={index} className="text-sm">
                <div className="flex items-start justify-between">
                  <p className="font-medium text-gray-900">{cert.title}</p>
                  {cert.link && (
                    <a
                      href={cert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      View <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumePreview;
