import { extractTextFromResume, trimResumeText } from '../utils/resumeParser.js';
import { analyzeResume } from '../utils/atsAnalyzer.js';

/**
 * ATS Score Check Controller
 * POST /api/v1/ats/check
 * Uses rule-based keyword matching (no AI required)
 */
export const checkATSScore = async (req, res) => {
  try {
    // Validate file upload
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Resume file is required',
      });
    }

    // Validate job description
    const { jobDescription } = req.body;
    if (!jobDescription || jobDescription.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Job description is required',
      });
    }

    // Validate file type
    const allowedMimeTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowedMimeTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: 'Only PDF and DOCX files are allowed',
      });
    }

    // Extract text from resume
    let resumeText;
    try {
      console.log('Extracting text from resume...');
      resumeText = await extractTextFromResume(req.file.buffer, req.file.mimetype);
      console.log('Resume text extracted, length:', resumeText.length);
    } catch (error) {
      console.error('Resume extraction error:', error);
      return res.status(400).json({
        success: false,
        message: 'Failed to extract text from resume. Please ensure the file is valid.',
      });
    }

    // Validate extracted text
    if (!resumeText || resumeText.trim().length < 50) {
      console.log('Resume text too short:', resumeText?.length);
      return res.status(400).json({
        success: false,
        message: 'Resume appears to be empty or too short. Please upload a valid resume.',
      });
    }

    // Trim resume text
    const trimmedResumeText = trimResumeText(resumeText, 15000);
    console.log('Resume text trimmed to:', trimmedResumeText.length);

    // Analyze with rule-based ATS analyzer (no AI)
    let result;
    try {
      console.log('Starting rule-based ATS analysis...');
      result = analyzeResume(trimmedResumeText, jobDescription.trim());
      console.log('ATS analysis completed successfully');
    } catch (error) {
      console.error('ATS analysis error:', error.message);
      return res.status(500).json({
        success: false,
        message: `Analysis failed: ${error.message}`,
      });
    }

    // Return result
    return res.status(200).json({
      success: true,
      message: 'ATS analysis completed successfully',
      result,
    });
  } catch (error) {
    console.error('ATS Check Controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
