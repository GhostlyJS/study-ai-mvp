// services/documentProcessor.js
const fs = require('fs');
const path = require('path');
const { YoutubeTranscript } = require('youtube-transcript');
const pdfParse = require('pdf-parse');

/**
 * Extract transcript from a YouTube video
 * @param {string} youtubeUrl - URL of the YouTube video
 * @returns {Promise<string>} - Transcript text
 */
const extractYoutubeTranscript = async (youtubeUrl) => {
  try {
    // Extract video ID from URL
    const videoId = extractYoutubeVideoId(youtubeUrl);
    if (!videoId) {
      throw new Error('Invalid YouTube URL');
    }
    
    // Get transcript
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    
    // Format transcript to text
    const formattedTranscript = transcript
      .map(item => item.text)
      .join(' ')
      .replace(/\s+/g, ' ');
    
    return formattedTranscript;
  } catch (error) {
    throw new Error(`Failed to extract YouTube transcript: ${error.message}`);
  }
};

/**
 * Extract video ID from YouTube URL
 * @param {string} url - YouTube URL
 * @returns {string|null} - Video ID or null if invalid
 */
const extractYoutubeVideoId = (url) => {
  const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

/**
 * Process PDF file and extract text content
 * @param {string} filePath - Path to PDF file
 * @returns {Promise<string>} - Extracted text
 */
const processPdf = async (filePath) => {
  try {
    const fullPath = path.resolve(filePath);
    
    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      throw new Error('PDF file not found');
    }
    
    // Read file
    const dataBuffer = fs.readFileSync(fullPath);
    
    // Parse PDF
    const data = await pdfParse(dataBuffer);
    
    // Return text content
    return data.text;
  } catch (error) {
    throw new Error(`Failed to process PDF: ${error.message}`);
  }
};

module.exports = {
  extractYoutubeTranscript,
  processPdf,
};