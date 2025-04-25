// const { transcribeAudio, generateSummary } = require('../services/openaiService');
// const Summary = require('../models/Summary');
// const path = require('path');
// const fs = require('fs');
// const os = require('os');

// /**
//  * Process audio file: save to temp, transcribe, and summarize
//  * @param {Object} req - Express request object
//  * @param {Object} res - Express response object
//  */
// const processAudio = async (req, res) => {
//   let tempFilePath = null;
  
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: 'No audio file uploaded' });
//     }

//     const { title } = req.body;
    
//     if (!title) {
//       return res.status(400).json({ error: 'Title is required' });
//     }

//     // Save the audio file to a temporary directory
//     const tempDir = os.tmpdir();
//     const fileName = `audio_${Date.now()}_${req.file.originalname}`;
//     tempFilePath = path.join(tempDir, fileName);
    
//     // Write the buffer to a temporary file
//     fs.writeFileSync(tempFilePath, req.file.buffer);
    
//     // Transcribe audio using OpenAI Whisper
//     const transcription = await transcribeAudio(tempFilePath);
    
//     // Generate summary using GPT-4o
//     const summary = await generateSummary(transcription);
    
//     // Save to database
//     const newSummary = new Summary({
//       title,
//       originalAudioName: req.file.originalname,
//       transcription,
//       summary,
//       editedSummary: summary  // Initially the same as the generated summary
//     });
    
//     await newSummary.save();
    
//     res.status(201).json({
//       success: true,
//       data: newSummary
//     });
//   } catch (error) {
//     console.error('Error processing audio:', error);
//     res.status(500).json({
//       success: false,
//       error: 'Error processing audio file',
//       details: error.message
//     });
//   } finally {
//     // Clean up temporary file
//     if (tempFilePath && fs.existsSync(tempFilePath)) {
//       fs.unlinkSync(tempFilePath);
//     }
//   }
// };

// module.exports = {
//   processAudio
// };

// controllers/audioController.js
const { transcribeAudio, generateSummary } = require('../services/openaiService');
const Summary = require('../models/Summary');
const path = require('path');
const fs = require('fs');
const os = require('os');

/**
 * Process audio file: save to temp, transcribe, and summarize
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const processAudio = async (req, res) => {
  let tempFilePath = null;
  
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file uploaded' });
    }

    const { title } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    // Save the audio file to a temporary directory
    const tempDir = os.tmpdir();
    const fileName = `audio_${Date.now()}_${req.file.originalname}`;
    tempFilePath = path.join(tempDir, fileName);
    
    // Write the buffer to a temporary file
    fs.writeFileSync(tempFilePath, req.file.buffer);
    
    // Transcribe audio using OpenAI Whisper
    const transcription = await transcribeAudio(tempFilePath);
    
    // Generate summary using GPT-4o
    const summary = await generateSummary(transcription);
    
    // Save to database with user reference
    const newSummary = new Summary({
      title,
      originalAudioName: req.file.originalname,
      transcription,
      summary,
      editedSummary: summary,  // Initially the same as the generated summary
      user: req.user.id  // Add reference to logged in user
    });
    
    await newSummary.save();
    
    res.status(201).json({
      success: true,
      data: newSummary
    });
  } catch (error) {
    console.error('Error processing audio:', error);
    res.status(500).json({
      success: false,
      error: 'Error processing audio file',
      details: error.message
    });
  } finally {
    // Clean up temporary file
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
  }
};

module.exports = {
  processAudio
};