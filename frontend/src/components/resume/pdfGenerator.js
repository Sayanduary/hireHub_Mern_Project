import jsPDF from "jspdf";

export const generateResumePDF = (resumeData, fileName = "resume.pdf") => {
  let {
    personalDetails,
    professionalSummary,
    skills,
    education,
    experience,
    projects,
    certificates,
  } = resumeData;

  // ---------- Defensive Defaults ----------
  personalDetails = personalDetails || {};
  skills = skills || [];
  education = education || [];
  experience = experience || [];
  projects = projects || [];
  certificates = certificates || [];

  // ---------- Helpers ----------
  const renderMarkdown = (text = "") =>
    text
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1");

  const renderBullets = (text = "") =>
    text
      .split("\n")
      .map((line) =>
        line.trim().startsWith("-")
          ? `• ${line.replace("-", "").trim()}`
          : line
      )
      .join("\n");

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 12;
  const maxWidth = pageWidth - margin * 2;

  let yPosition = 15;
  let pageNumber = 1;

  const setFont = (size, weight = "normal") => {
    doc.setFont("helvetica", weight);
    doc.setFontSize(size);
  };

  const addFooter = () => {
    setFont(8);
    doc.text(`Page ${pageNumber}`, pageWidth / 2, pageHeight - 8, {
      align: "center",
    });
  };

  const addNewPage = () => {
    addFooter();
    doc.addPage();
    pageNumber++;
    yPosition = margin;
  };

  const addText = (text, size = 10, weight = "normal") => {
    setFont(size, weight);
    const lines = doc.splitTextToSize(text, maxWidth);
    lines.forEach((line) => {
      if (yPosition > pageHeight - margin) addNewPage();
      doc.text(line, margin, yPosition);
      yPosition += size / 2.4;
    });
  };

  /**
   * Clickable link using label only (no raw URL shown)
   */
  const addNamedLink = (label, url) => {
    if (!label || !url) return;
    if (yPosition > pageHeight - margin) addNewPage();

    setFont(9);
    doc.setTextColor(0, 102, 204);
    doc.textWithLink(label, margin, yPosition, { url });
    doc.setTextColor(0, 0, 0);
    yPosition += 4;
  };

  const addSection = (title) => {
    if (yPosition > pageHeight - margin - 10) addNewPage();
    yPosition += 3;
    setFont(12, "bold");
    doc.text(title, margin, yPosition);
    yPosition += 4;
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 4;
  };

  // ---------- Header ----------
  if (personalDetails.fullName) {
    setFont(22, "bold");
    doc.text(personalDetails.fullName.toUpperCase(), margin, yPosition);
    yPosition += 8;

    const contact = [
      personalDetails.email,
      personalDetails.phone,
      personalDetails.location,
    ].filter(Boolean);

    if (contact.length) {
      setFont(9);
      doc.text(contact.join("  |  "), margin, yPosition);
      yPosition += 5;
    }

    // Social Profiles → only platform name clickable
    (personalDetails.profiles || []).forEach((p) => {
      addNamedLink(p.platform, p.url);
    });

    yPosition += 2;
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 5;
  }

  // ---------- Professional Summary ----------
  if (professionalSummary) {
    addSection("PROFESSIONAL SUMMARY");
    addText(renderMarkdown(professionalSummary), 10);
  }

  // ---------- Skills ----------
  if (skills.length) {
    addSection("SKILLS");
    addText(skills.map((s) => `• ${s}`).join("\n"), 10);
  }

  // ---------- Education ----------
  if (education.length) {
    addSection("EDUCATION");
    education.forEach((edu) => {
      if (yPosition > pageHeight - margin - 8) addNewPage();

      setFont(11, "bold");
      doc.text(edu.degree || "", margin, yPosition);

      if (edu.duration) {
        doc.text(edu.duration, pageWidth - margin, yPosition, {
          align: "right",
        });
      }

      yPosition += 5;

      setFont(10);
      if (edu.institution) doc.text(edu.institution, margin, yPosition);
      yPosition += 4;

      if (edu.score) {
        setFont(9);
        doc.text(`Score: ${edu.score}`, margin, yPosition);
        yPosition += 3;
      }

      yPosition += 2;
    });
  }

  // ---------- Experience ----------
  if (experience.length) {
    addSection("WORK EXPERIENCE");
    experience.forEach((exp) => {
      if (yPosition > pageHeight - margin - 8) addNewPage();

      setFont(11, "bold");
      doc.text(exp.position || "", margin, yPosition);

      if (exp.duration) {
        doc.text(exp.duration, pageWidth - margin, yPosition, {
          align: "right",
        });
      }

      yPosition += 5;

      setFont(10);
      if (exp.organization) doc.text(exp.organization, margin, yPosition);
      yPosition += 4;

      if (exp.description) {
        addText(
          renderMarkdown(renderBullets(exp.description)),
          9
        );
      }

      yPosition += 2;
    });
  }

  // ---------- Projects ----------
  if (projects.length) {
    addSection("PROJECTS");
    projects.forEach((project, index) => {
      if (yPosition > pageHeight - margin - 8) addNewPage();

      setFont(10, "bold");
      doc.text(project.title || `Project ${index + 1}`, margin, yPosition);
      yPosition += 4;

      if (project.description) {
        addText(
          renderMarkdown(renderBullets(project.description)),
          9
        );
      }

      // Link label shown, URL hidden
      if (project.link) {
        addNamedLink("Live Demo", project.link);
      }

      yPosition += 2;
    });
  }

  // ---------- Certificates ----------
  if (certificates.length) {
    addSection("CERTIFICATES");
    certificates.forEach((cert) => {
      if (yPosition > pageHeight - margin - 6) addNewPage();

      // Certificate title is clickable
      addNamedLink(cert.title, cert.link);
    });
  }
  addFooter();
  doc.save(fileName);
};

// Generate PDF as Base64 for sending to server
export const generateResumePDFBase64 = async (resumeData) => {
  let {
    personalDetails,
    professionalSummary,
    skills,
    education,
    experience,
    projects,
    certificates,
  } = resumeData;

  // ---------- Defensive Defaults ----------
  personalDetails = personalDetails || {};
  skills = skills || [];
  education = education || [];
  experience = experience || [];
  projects = projects || [];
  certificates = certificates || [];

  // ---------- Helpers ----------
  const renderMarkdown = (text = "") =>
    text
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1");

  const renderBullets = (text = "") =>
    text
      .split("\n")
      .map((line) =>
        line.trim().startsWith("-")
          ? `• ${line.replace("-", "").trim()}`
          : line
      )
      .join("\n");

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 12;
  const maxWidth = pageWidth - margin * 2;

  let yPosition = 15;

  const setFont = (size, weight = "normal") => {
    doc.setFont("helvetica", weight);
    doc.setFontSize(size);
  };

  const addSection = (title, content) => {
    const lineHeight = 5;
    const pageThreshold = pageHeight - 20;

    if (yPosition + 20 > pageThreshold) {
      doc.addPage();
      yPosition = 15;
    }

    setFont(12, "bold");
    doc.text(title, margin, yPosition);
    yPosition += 8;

    setFont(10, "normal");
    const lines = doc.splitTextToSize(content, maxWidth);
    const textHeight = lines.length * lineHeight;

    if (yPosition + textHeight > pageThreshold) {
      doc.addPage();
      yPosition = 15;
    }

    doc.text(lines, margin, yPosition);
    yPosition += textHeight + 6;
  };

  const checkPageOverflow = (height) => {
    if (yPosition + height > pageHeight - 20) {
      doc.addPage();
      yPosition = 15;
      return true;
    }
    return false;
  };

  // ========== HEADER ==========
  setFont(16, "bold");
  doc.text(personalDetails.fullName || "Your Name", margin, yPosition);
  yPosition += 10;

  let contactInfo = [];
  if (personalDetails.email)
    contactInfo.push(`Email: ${personalDetails.email}`);
  if (personalDetails.phone)
    contactInfo.push(`Phone: ${personalDetails.phone}`);
  if (personalDetails.location)
    contactInfo.push(`Location: ${personalDetails.location}`);

  setFont(9, "normal");
  doc.text(contactInfo.join(" | "), margin, yPosition);
  yPosition += 8;

  // Social Profiles
  if (personalDetails.profiles && personalDetails.profiles.length > 0) {
    const validProfiles = personalDetails.profiles.filter(
      (p) => p.platform && p.url
    );
    if (validProfiles.length > 0) {
      const profileText = validProfiles
        .map((p) => `${p.platform}: ${p.url}`)
        .join(" | ");
      doc.text(profileText, margin, yPosition);
      yPosition += 6;
    }
  }

  yPosition += 4;

  // ========== PROFESSIONAL SUMMARY ==========
  if (professionalSummary && professionalSummary.trim()) {
    checkPageOverflow(15);
    addSection("Professional Summary", professionalSummary);
  }

  // ========== SKILLS ==========
  if (skills.length > 0) {
    checkPageOverflow(15);
    const skillsText =
      typeof skills === "string" ? skills : skills.join(", ");
    addSection("Skills", skillsText);
  }

  // ========== EDUCATION ==========
  if (education.length > 0) {
    checkPageOverflow(20);
    setFont(12, "bold");
    doc.text("Education", margin, yPosition);
    yPosition += 8;

    education.forEach((edu) => {
      checkPageOverflow(15);
      setFont(10, "bold");
      doc.text(
        `${edu.degree || ""} - ${edu.institution || ""}`,
        margin,
        yPosition
      );
      yPosition += 5;

      setFont(9, "normal");
      if (edu.duration) doc.text(edu.duration, margin, yPosition);
      if (edu.score) doc.text(`CGPA: ${edu.score}`, margin + 50, yPosition);
      yPosition += 5;
    });

    yPosition += 2;
  }

  // ========== EXPERIENCE ==========
  if (experience.length > 0) {
    checkPageOverflow(20);
    setFont(12, "bold");
    doc.text("Experience", margin, yPosition);
    yPosition += 8;

    experience.forEach((exp) => {
      checkPageOverflow(20);
      setFont(10, "bold");
      doc.text(
        `${exp.position || ""} - ${exp.company || ""}`,
        margin,
        yPosition
      );
      yPosition += 5;

      setFont(9, "normal");
      if (exp.duration) doc.text(exp.duration, margin, yPosition);
      yPosition += 5;

      if (exp.description) {
        const lines = doc.splitTextToSize(
          renderBullets(exp.description),
          maxWidth
        );
        doc.text(lines, margin, yPosition);
        yPosition += lines.length * 4 + 3;
      }

      yPosition += 2;
    });
  }

  // ========== PROJECTS ==========
  if (projects.length > 0) {
    checkPageOverflow(20);
    setFont(12, "bold");
    doc.text("Projects", margin, yPosition);
    yPosition += 8;

    projects.forEach((proj) => {
      checkPageOverflow(15);
      setFont(10, "bold");
      doc.text(proj.title || "", margin, yPosition);
      yPosition += 5;

      setFont(9, "normal");
      if (proj.description) {
        const lines = doc.splitTextToSize(proj.description, maxWidth);
        doc.text(lines, margin, yPosition);
        yPosition += lines.length * 4;
      }
      if (proj.link) {
        doc.text(`Link: ${proj.link}`, margin, yPosition);
        yPosition += 4;
      }

      yPosition += 2;
    });
  }

  // ========== CERTIFICATES ==========
  if (certificates.length > 0) {
    checkPageOverflow(20);
    setFont(12, "bold");
    doc.text("Certificates", margin, yPosition);
    yPosition += 8;

    certificates.forEach((cert) => {
      checkPageOverflow(10);
      setFont(10, "normal");
      doc.text(`• ${cert.title || ""}`, margin, yPosition);
      yPosition += 4;
    });
  }

  // Return base64
  return doc.output("dataurlstring").split(",")[1];
};

