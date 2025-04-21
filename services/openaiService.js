const fs = require('fs');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Transcribe audio using OpenAI Whisper API
 * @param {String} audioPath - Path to the audio file on disk
 * @returns {Promise<String>} - Transcription text
 */
const transcribeAudio = async (audioPath) => {
  try {
    const response = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioPath),
      model: "whisper-1",
      language: "en", // Specify language if known, or let Whisper detect
      response_format: "text"
    });
    
    return response;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw error;
  }
};

/**
 * Summarize transcript using GPT-4o
 * @param {String} transcript - Full transcription text
 * @returns {Promise<String>} - Meeting minutes summary
 */
const generateSummary = async (transcript) => {
  try {
    const completion = await openai.chat.completions.create({
      // model: "gpt-4o",
      model: "gpt-4.1-mini-2025-04-14",
      messages: [
        {
          role: "system",
          content: "You are a professional meeting minutes creator. Create concise, well-structured meeting minutes from the transcript provided. Include key decisions, action items, and main discussion points. Format it with clear headings and bullet points where appropriate."
        },
        {
          role: "user",
          content: `Please create meeting minutes from this transcript:\n\n${transcript}`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });
    
    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error generating summary:', error);
    throw error;
  }
};

module.exports = {
  transcribeAudio,
  generateSummary
};