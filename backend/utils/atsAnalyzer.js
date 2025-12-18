/**
 * Rule-Based ATS Score Analyzer
 * No AI/ML required - Pure keyword matching and rule-based scoring
 */

// Common technical skills database
const TECH_SKILLS = {
  programming: [
    'javascript', 'python', 'java', 'c++', 'c#', 'ruby', 'php', 'swift', 'kotlin', 'go',
    'rust', 'typescript', 'scala', 'perl', 'r', 'matlab', 'sql', 'html', 'css', 'sass',
    'less', 'bash', 'shell', 'powershell', 'objective-c', 'dart', 'lua', 'groovy', 'c'
  ],
  frameworks: [
    'react', 'reactjs', 'react.js', 'angular', 'angularjs', 'vue', 'vuejs', 'vue.js',
    'node', 'nodejs', 'node.js', 'express', 'expressjs', 'express.js', 'django', 'flask',
    'spring', 'spring boot', 'springboot', 'laravel', 'rails', 'ruby on rails', 'asp.net',
    '.net', 'dotnet', 'next', 'nextjs', 'next.js', 'nuxt', 'nuxtjs', 'gatsby', 'svelte',
    'bootstrap', 'tailwind', 'tailwindcss', 'material-ui', 'mui', 'jquery', 'redux',
    'mobx', 'graphql', 'rest', 'restful', 'fastapi', 'nestjs', 'nest.js', 'mern', 'mean'
  ],
  databases: [
    'mysql', 'postgresql', 'postgres', 'mongodb', 'redis', 'elasticsearch', 'sqlite',
    'oracle', 'sql server', 'mssql', 'dynamodb', 'cassandra', 'couchdb', 'neo4j',
    'mariadb', 'firebase', 'firestore', 'supabase', 'prisma', 'mongoose'
  ],
  cloud: [
    'aws', 'amazon web services', 'azure', 'gcp', 'google cloud', 'heroku', 'vercel',
    'netlify', 'digitalocean', 'cloudflare', 'docker', 'kubernetes', 'k8s', 'jenkins',
    'ci/cd', 'cicd', 'terraform', 'ansible', 'lambda', 'ec2', 's3', 'cloudfront'
  ],
  tools: [
    'git', 'github', 'gitlab', 'bitbucket', 'jira', 'confluence', 'slack', 'trello',
    'asana', 'figma', 'sketch', 'adobe xd', 'photoshop', 'illustrator', 'vs code',
    'visual studio', 'intellij', 'eclipse', 'postman', 'insomnia', 'webpack', 'vite',
    'babel', 'npm', 'yarn', 'pnpm', 'pip', 'maven', 'gradle', 'linux', 'unix', 'windows'
  ],
  concepts: [
    'api', 'rest api', 'restful api', 'microservices', 'agile', 'scrum', 'kanban',
    'tdd', 'test driven', 'bdd', 'devops', 'mlops', 'data structures', 'algorithms',
    'oop', 'object oriented', 'functional programming', 'design patterns', 'solid',
    'mvc', 'mvvm', 'clean code', 'code review', 'pair programming', 'unit testing',
    'integration testing', 'e2e testing', 'responsive design', 'mobile first',
    'accessibility', 'a11y', 'seo', 'performance optimization', 'security', 'authentication',
    'authorization', 'oauth', 'jwt', 'ssl', 'https', 'websocket', 'socket.io'
  ],
  soft_skills: [
    'leadership', 'communication', 'teamwork', 'problem solving', 'critical thinking',
    'time management', 'project management', 'collaboration', 'adaptability', 'creativity',
    'attention to detail', 'analytical', 'interpersonal', 'presentation', 'mentoring',
    'decision making', 'strategic thinking', 'negotiation', 'conflict resolution'
  ]
};

// Flatten all skills for easy lookup
const ALL_SKILLS = Object.values(TECH_SKILLS).flat();

/**
 * Normalize text for comparison
 */
const normalizeText = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s\-\.\/\#\+]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Extract keywords from text
 */
const extractKeywords = (text) => {
  const normalized = normalizeText(text);
  const words = normalized.split(/\s+/);
  
  const keywords = new Set();
  
  // Single word matching
  words.forEach(word => {
    if (word.length > 2) {
      keywords.add(word);
    }
  });
  
  // Multi-word phrase matching (2-3 word combinations)
  for (let i = 0; i < words.length - 1; i++) {
    const twoWord = `${words[i]} ${words[i + 1]}`;
    keywords.add(twoWord);
    
    if (i < words.length - 2) {
      const threeWord = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
      keywords.add(threeWord);
    }
  }
  
  return keywords;
};

/**
 * Extract skills from text based on known skills database
 */
const extractSkills = (text) => {
  const normalized = normalizeText(text);
  const foundSkills = new Set();
  
  ALL_SKILLS.forEach(skill => {
    const skillPattern = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (skillPattern.test(normalized)) {
      foundSkills.add(skill);
    }
  });
  
  return Array.from(foundSkills);
};

/**
 * Extract experience years from text
 */
const extractExperienceYears = (text) => {
  const patterns = [
    /(\d+)\+?\s*(?:years?|yrs?)\s*(?:of\s*)?(?:experience|exp)?/gi,
    /(?:experience|exp)\s*(?:of\s*)?(\d+)\+?\s*(?:years?|yrs?)/gi,
  ];
  
  let maxYears = 0;
  patterns.forEach(pattern => {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      const years = parseInt(match[1], 10);
      if (years > maxYears && years < 50) {
        maxYears = years;
      }
    }
  });
  
  return maxYears;
};

/**
 * Check resume sections
 */
const analyzeResumeSections = (resumeText) => {
  const normalized = normalizeText(resumeText);
  
  const sections = {
    contact: /(?:email|phone|mobile|address|linkedin|github|portfolio)/i,
    education: /(?:education|degree|university|college|bachelor|master|phd|b\.?tech|m\.?tech|b\.?sc|m\.?sc|b\.?e|m\.?e|bca|mca)/i,
    experience: /(?:experience|work\s*history|employment|job\s*history|professional\s*experience)/i,
    skills: /(?:skills|technical\s*skills|technologies|competencies|proficiencies)/i,
    projects: /(?:projects|portfolio|work\s*samples)/i,
    certifications: /(?:certifications?|certificates?|licenses?|credentials?)/i,
    summary: /(?:summary|objective|profile|about\s*me|professional\s*summary)/i,
  };
  
  const foundSections = {};
  const missingSections = [];
  
  Object.entries(sections).forEach(([name, pattern]) => {
    if (pattern.test(resumeText)) {
      foundSections[name] = true;
    } else {
      missingSections.push(name);
    }
  });
  
  return { foundSections, missingSections };
};

/**
 * Calculate keyword match score
 */
const calculateKeywordScore = (resumeKeywords, jobKeywords) => {
  let matchCount = 0;
  const matchedKeywords = [];
  const missingKeywords = [];
  
  jobKeywords.forEach(keyword => {
    if (resumeKeywords.has(keyword)) {
      matchCount++;
      matchedKeywords.push(keyword);
    } else {
      missingKeywords.push(keyword);
    }
  });
  
  const score = jobKeywords.size > 0 ? (matchCount / jobKeywords.size) * 100 : 0;
  
  return { score, matchedKeywords, missingKeywords };
};

/**
 * Calculate skill match score
 */
const calculateSkillScore = (resumeSkills, jobSkills) => {
  const matchedSkills = resumeSkills.filter(skill => 
    jobSkills.some(jSkill => 
      normalizeText(skill) === normalizeText(jSkill) ||
      normalizeText(skill).includes(normalizeText(jSkill)) ||
      normalizeText(jSkill).includes(normalizeText(skill))
    )
  );
  
  const missingSkills = jobSkills.filter(skill =>
    !resumeSkills.some(rSkill =>
      normalizeText(skill) === normalizeText(rSkill) ||
      normalizeText(skill).includes(normalizeText(rSkill)) ||
      normalizeText(rSkill).includes(normalizeText(skill))
    )
  );
  
  const score = jobSkills.length > 0 ? (matchedSkills.length / jobSkills.length) * 100 : 0;
  
  return { score, matchedSkills, missingSkills };
};

/**
 * Generate improvement tips based on analysis
 */
const generateImprovementTips = (analysis) => {
  const tips = [];
  
  // Keyword match tips
  if (analysis.keywordScore < 50) {
    tips.push('Add more relevant keywords from the job description to your resume.');
  }
  
  // Skills tips
  if (analysis.missingSkills.length > 0) {
    const topMissing = analysis.missingSkills.slice(0, 3).join(', ');
    tips.push(`Consider adding these skills if you have them: ${topMissing}`);
  }
  
  // Section tips
  if (analysis.missingSections.includes('summary')) {
    tips.push('Add a professional summary section at the top of your resume.');
  }
  
  if (analysis.missingSections.includes('skills')) {
    tips.push('Create a dedicated skills section listing your technical competencies.');
  }
  
  if (analysis.missingSections.includes('projects')) {
    tips.push('Include a projects section to showcase your practical experience.');
  }
  
  if (analysis.missingSections.includes('certifications')) {
    tips.push('Add relevant certifications to strengthen your profile.');
  }
  
  // Score-based tips
  if (analysis.atsScore < 40) {
    tips.push('Your resume needs significant improvement to pass ATS screening.');
    tips.push('Use exact phrases from the job description where applicable.');
  } else if (analysis.atsScore < 60) {
    tips.push('Quantify your achievements with numbers and metrics.');
  } else if (analysis.atsScore < 80) {
    tips.push('Fine-tune your resume by incorporating more industry-specific terminology.');
  }
  
  // Always useful tips
  if (tips.length < 3) {
    tips.push('Use action verbs to describe your accomplishments.');
  }
  
  if (tips.length < 4) {
    tips.push('Ensure your resume is in a clean, ATS-friendly format.');
  }
  
  return tips.slice(0, 5);
};

/**
 * Generate summary based on score
 */
const generateSummary = (score, matchedSkills, missingSkills) => {
  if (score >= 80) {
    return `Excellent match! Your resume aligns very well with the job requirements. You have ${matchedSkills.length} matching skills. Minor optimizations could further improve your chances.`;
  } else if (score >= 60) {
    return `Good match! Your resume covers most key requirements with ${matchedSkills.length} matching skills. Consider adding ${missingSkills.length} missing skills to improve your score.`;
  } else if (score >= 40) {
    return `Moderate match. Your resume has ${matchedSkills.length} relevant skills but is missing ${missingSkills.length} key requirements. Focus on addressing the missing skills to improve compatibility.`;
  } else {
    return `Low match. Your resume needs significant improvements to align with this job. You're missing ${missingSkills.length} important skills. Consider tailoring your resume specifically for this role.`;
  }
};

/**
 * Main ATS Analysis Function
 * @param {string} resumeText - Extracted resume text
 * @param {string} jobDescription - Job description text
 * @returns {Object} - ATS analysis result
 */
export const analyzeResume = (resumeText, jobDescription) => {
  console.log('Starting rule-based ATS analysis...');
  
  // Extract keywords
  const resumeKeywords = extractKeywords(resumeText);
  const jobKeywords = extractKeywords(jobDescription);
  
  // Extract skills
  const resumeSkills = extractSkills(resumeText);
  const jobSkills = extractSkills(jobDescription);
  
  console.log(`Resume skills found: ${resumeSkills.length}`);
  console.log(`Job skills found: ${jobSkills.length}`);
  
  // Analyze resume sections
  const { foundSections, missingSections } = analyzeResumeSections(resumeText);
  
  // Calculate scores
  const keywordAnalysis = calculateKeywordScore(resumeKeywords, jobKeywords);
  const skillAnalysis = calculateSkillScore(resumeSkills, jobSkills);
  
  // Calculate section score
  const sectionScore = (Object.keys(foundSections).length / 7) * 100;
  
  // Calculate final ATS score (weighted)
  const atsScore = Math.round(
    (skillAnalysis.score * 0.45) +  // Skills match: 45%
    (keywordAnalysis.score * 0.35) + // Keyword match: 35%
    (sectionScore * 0.20)            // Resume structure: 20%
  );
  
  // Compile analysis results
  const analysis = {
    atsScore,
    keywordScore: keywordAnalysis.score,
    skillScore: skillAnalysis.score,
    sectionScore,
    matchedSkills: skillAnalysis.matchedSkills,
    missingSkills: skillAnalysis.missingSkills,
    missingSections,
  };
  
  // Generate tips and summary
  const improvementTips = generateImprovementTips(analysis);
  const summary = generateSummary(atsScore, skillAnalysis.matchedSkills, skillAnalysis.missingSkills);
  
  console.log(`ATS Score calculated: ${atsScore}`);
  
  return {
    ats_score: Math.min(100, Math.max(0, atsScore)),
    matched_skills: skillAnalysis.matchedSkills,
    missing_skills: skillAnalysis.missingSkills.slice(0, 10),
    improvement_tips: improvementTips,
    resume_sections_to_improve: missingSections.slice(0, 3),
    summary,
    details: {
      keyword_match_percentage: Math.round(keywordAnalysis.score),
      skill_match_percentage: Math.round(skillAnalysis.score),
      section_completeness: Math.round(sectionScore),
      total_resume_skills: resumeSkills.length,
      total_job_skills: jobSkills.length,
    }
  };
};

export default {
  analyzeResume,
};
