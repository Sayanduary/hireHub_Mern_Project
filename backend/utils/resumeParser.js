import mammoth from 'mammoth';
import { createRequire } from 'module';

// Use createRequire to import the actual pdf-parse lib (bypasses test file loading bug)
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse/lib/pdf-parse.js');

/**
 * Parse PDF buffer
 * @param {Buffer} buffer - PDF file buffer
 * @returns {Promise<{text: string}>} - Parsed PDF data
 */
const parsePDF = async (buffer) => {
  try {
    return await pdfParse(buffer);
  } catch (error) {
    console.error('PDF parsing internal error:', error);
    throw error;
  }
};

/**
 * Extract text from uploaded resume file
 * @param {Buffer} buffer - File buffer
 * @param {string} mimetype - File MIME type
 * @returns {Promise<string>} - Extracted text
 */
export const extractTextFromResume = async (buffer, mimetype) => {
  try {
    if (mimetype === 'application/pdf') {
      console.log('Parsing PDF file, buffer size:', buffer.length);
      
      const data = await parsePDF(buffer);
      
      // Validate extracted text
      if (!data || !data.text) {
        throw new Error('PDF parsing returned empty result');
      }
      
      console.log('PDF text extracted successfully, length:', data.text.length);
      return data.text;
      
    } else if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ buffer });
      
      if (!result || !result.value) {
        throw new Error('DOCX parsing returned empty result');
      }
      
      console.log('DOCX text extracted successfully, length:', result.value.length);
      return result.value;
      
    } else {
      throw new Error('Unsupported file format. Only PDF and DOCX are supported.');
    }
  } catch (error) {
    console.error('Resume parsing error:', error.message);
    throw new Error(`Failed to extract text from resume: ${error.message}`);
  }
};

/**
 * Trim resume text to limit AI cost
 * @param {string} text - Resume text
 * @param {number} maxLength - Maximum character length
 * @returns {string} - Trimmed text
 */
export const trimResumeText = (text, maxLength = 8000) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '\n\n[Content trimmed for analysis...]';
};
