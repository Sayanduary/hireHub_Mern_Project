import React from "react";

const ResumePDFContent = ({ resumeData }) => {
  const {
    personalDetails,
    professionalSummary,
    skills,
    education,
    experience,
    projects,
    certificates,
  } = resumeData;

  // Convert markdown to simple text
  const renderMarkdown = (text) => {
    if (!text) return "";
    return text
      .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold markers
      .replace(/\*(.*?)\*/g, "$1") // Remove italic markers
      .replace(/- /g, "• "); // Convert dashes to bullets
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        lineHeight: "1.6",
        color: "#000",
        padding: "0",
        margin: "0",
      }}
    >
      {/* Header */}
      {personalDetails.fullName && (
        <div
          style={{
            marginBottom: "16px",
            paddingBottom: "12px",
            borderBottom: "2px solid #000",
          }}
        >
          <h1
            style={{
              margin: "0 0 8px 0",
              fontSize: "28px",
              fontWeight: "bold",
            }}
          >
            {personalDetails.fullName}
          </h1>
          <div style={{ fontSize: "11px", marginTop: "4px" }}>
            {personalDetails.email && <span>{personalDetails.email}</span>}
            {personalDetails.email && personalDetails.phone && <span> • </span>}
            {personalDetails.phone && <span>{personalDetails.phone}</span>}
            {(personalDetails.email || personalDetails.phone) &&
              personalDetails.location && <span> • </span>}
            {personalDetails.location && (
              <span>{personalDetails.location}</span>
            )}
          </div>
        </div>
      )}

      {/* Professional Summary */}
      {professionalSummary && (
        <div style={{ marginBottom: "14px" }}>
          <h2
            style={{
              margin: "0 0 6px 0",
              fontSize: "14px",
              fontWeight: "bold",
              borderBottom: "1px solid #000",
            }}
          >
            PROFESSIONAL SUMMARY
          </h2>
          <p
            style={{
              margin: "6px 0",
              fontSize: "11px",
              whiteSpace: "pre-wrap",
            }}
          >
            {renderMarkdown(professionalSummary)}
          </p>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div style={{ marginBottom: "14px" }}>
          <h2
            style={{
              margin: "0 0 6px 0",
              fontSize: "14px",
              fontWeight: "bold",
              borderBottom: "1px solid #000",
            }}
          >
            SKILLS
          </h2>
          <p style={{ margin: "6px 0", fontSize: "11px" }}>
            {skills.join(" • ")}
          </p>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div style={{ marginBottom: "14px" }}>
          <h2
            style={{
              margin: "0 0 6px 0",
              fontSize: "14px",
              fontWeight: "bold",
              borderBottom: "1px solid #000",
            }}
          >
            EDUCATION
          </h2>
          {education.map((edu, index) => (
            <div key={index} style={{ marginBottom: "8px", fontSize: "11px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: "bold",
                }}
              >
                <span>{edu.degree}</span>
                {edu.duration && <span>{edu.duration}</span>}
              </div>
              <div style={{ marginTop: "2px" }}>{edu.institution}</div>
              {edu.score && (
                <div style={{ marginTop: "2px", fontSize: "10px" }}>
                  Score: {edu.score}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Work Experience */}
      {experience.length > 0 && (
        <div style={{ marginBottom: "14px" }}>
          <h2
            style={{
              margin: "0 0 6px 0",
              fontSize: "14px",
              fontWeight: "bold",
              borderBottom: "1px solid #000",
            }}
          >
            WORK EXPERIENCE
          </h2>
          {experience.map((exp, index) => (
            <div key={index} style={{ marginBottom: "10px", fontSize: "11px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: "bold",
                }}
              >
                <span>{exp.position}</span>
                {exp.duration && <span>{exp.duration}</span>}
              </div>
              <div style={{ marginTop: "2px", marginBottom: "4px" }}>
                {exp.organization}
              </div>
              {exp.description && (
                <div
                  style={{
                    marginTop: "4px",
                    marginLeft: "12px",
                    whiteSpace: "pre-wrap",
                    fontSize: "10px",
                  }}
                >
                  {renderMarkdown(exp.description)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div style={{ marginBottom: "14px" }}>
          <h2
            style={{
              margin: "0 0 6px 0",
              fontSize: "14px",
              fontWeight: "bold",
              borderBottom: "1px solid #000",
            }}
          >
            PROJECTS
          </h2>
          {projects.map((project, index) => (
            <div key={index} style={{ marginBottom: "8px", fontSize: "11px" }}>
              {project.description && (
                <div style={{ marginBottom: "4px", whiteSpace: "pre-wrap" }}>
                  {renderMarkdown(project.description)}
                </div>
              )}
              {project.link && (
                <div style={{ fontSize: "10px", color: "#0066cc" }}>
                  {project.link}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Certificates */}
      {certificates.length > 0 && (
        <div style={{ marginBottom: "14px" }}>
          <h2
            style={{
              margin: "0 0 6px 0",
              fontSize: "14px",
              fontWeight: "bold",
              borderBottom: "1px solid #000",
            }}
          >
            CERTIFICATES
          </h2>
          {certificates.map((cert, index) => (
            <div key={index} style={{ marginBottom: "6px", fontSize: "11px" }}>
              <div style={{ fontWeight: "bold" }}>{cert.title}</div>
              {cert.link && (
                <div style={{ fontSize: "10px", color: "#0066cc" }}>
                  {cert.link}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResumePDFContent;
