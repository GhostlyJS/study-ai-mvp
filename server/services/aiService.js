// services/aiService.js
const { OpenAI } = require('openai');
const dotenv = require('dotenv');
dotenv.config();
// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Ask question to AI based on document content
 * @param {string} documentContent - Content of the document
 * @param {string} question - User question
 * @returns {Promise<string>} - AI response
 */
const askAI = async (documentContent, question) => {
  try {
    // Prepare prompt for AI
    const prompt = `
      Je suis un assistant d'étude qui répond aux questions sur le contenu suivant. 
      Je dois uniquement me baser sur le contenu fourni pour répondre aux questions.
      Si je ne peux pas répondre à la question en me basant uniquement sur le contenu fourni,
      je l'indiquerai clairement.
      
      CONTENU:
      ${documentContent}
      
      QUESTION:
      ${question}
      
      RÉPONSE:
    `;
    
    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Tu es un assistant d\'étude précis et concis qui aide les étudiants à comprendre leur cours.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 1000,
      temperature: 0.5,
    });
    
    // Return AI response
    return response.choices[0].message.content;
  } catch (error) {
    throw new Error(`AI service error: ${error.message}`);
  }
};

module.exports = {
  askAI,
};