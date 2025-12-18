import { GoogleGenerativeAI } from '@google/generative-ai';

// Gemini Configuration
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error('GEMINI_API_KEY is not set in environment variables');
}

const genAI = new GoogleGenerativeAI(apiKey || '');
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

/**
 * ATS Analysis Prompt
 * @param {string} resumeText - Extracted resume text
 * @param {string} jobDescription - Job description
 * @returns {string} - Prompt for AI
 */
const buildATSPrompt = (resumeText, jobDescription) => {
  return `You are an expert Applicant Tracking System (ATS) analyzer.

Analyze the following resume against the job description and provide a comprehensive ATS evaluation.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

TASK:
1. Calculate an ATS score (0-100) based on:
   - Keyword match between resume and job description
   - Skills relevance and coverage
   - Experience alignment with job requirements
   - Resume structure and ATS readability
   - Professional formatting and clarity

2. Identify matched skills (skills from resume that align with job requirements)
3. Identify missing skills (critical skills from job description not found in resume)
4. Provide 3-5 specific, actionable improvement tips
5. List 2-3 resume sections that need improvement
6. Write a brief summary (2-3 sentences) of overall resume quality

RULES:
- Be objective and specific
- Do not hallucinate skills not present in the resume
- Focus on ATS-relevant factors (keywords, formatting, structure)
- Penalize missing critical job keywords
- Reward clear section headers, bullet points, and quantified achievements

IMPORTANT: Return ONLY valid JSON with this exact structure (no markdown, no code blocks, no explanations):

{
  "ats_score": <number 0-100>,
  "matched_skills": ["skill1", "skill2"],
  "missing_skills": ["skill1", "skill2"],
  "improvement_tips": ["tip1", "tip2", "tip3"],
  "resume_sections_to_improve": ["section1", "section2"],
  "summary": "Brief 2-3 sentence summary"
}`;
};

/**
 * Sleep utility for retry delays
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Call Google Gemini API with retry logic
 */
const callGemini = async (prompt, retries = 2) => {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      console.log(`Calling Gemini API... (attempt ${attempt + 1})`);
      
      const result = await model.generateContent({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 2000,
        },
      });

      const response = await result.response;
      const content = response.text().trim();
      
      console.log('Gemini response received:', content.substring(0, 200));
      
      // Clean any markdown code blocks if present
      const cleanedContent = content
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .trim();
      
      return JSON.parse(cleanedContent);
    } catch (error) {
      console.error('Gemini API error details:', error.message);
      
      // Check if it's a rate limit error (429)
      if (error.status === 429 && attempt < retries) {
        const waitTime = (attempt + 1) * 30000; // 30s, 60s
        console.log(`Rate limited. Waiting ${waitTime/1000}s before retry...`);
        await sleep(waitTime);
        continue;
      }
      
      if (error.response) {
        console.error('API Response:', error.response);
      }
      throw error;
    }
  }
};

/**
 * Main AI Service - Analyze resume with job description
 * @param {string} resumeText - Extracted resume text
 * @param {string} jobDescription - Job description
 * @returns {Promise<Object>} - ATS analysis result
 */
export const analyzeResumeWithAI = async (resumeText, jobDescription) => {
  if (!resumeText || !jobDescription) {
    throw new Error('Resume text and job description are required');
  }

  const prompt = buildATSPrompt(resumeText, jobDescription);

  try {
    // Use Gemini API
    const result = await callGemini(prompt);

    // Validate response structure
    if (
      typeof result.ats_score !== 'number' ||
      !Array.isArray(result.matched_skills) ||
      !Array.isArray(result.missing_skills) ||
      !Array.isArray(result.improvement_tips)
    ) {
      throw new Error('Invalid AI response structure');
    }

    return result;
  } catch (error) {
    console.error('AI analysis error:', error);
    
    // Fallback response
    return {
      ats_score: 0,
      matched_skills: [],
      missing_skills: [],
      improvement_tips: ['Unable to analyze resume at this time. Please try again later.'],
      resume_sections_to_improve: [],
      summary: 'Analysis failed due to technical issues. Please try again.',
    };
  }
};

export default {
  analyzeResumeWithAI,
};
