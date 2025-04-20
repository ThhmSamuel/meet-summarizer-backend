const express = require('express');
const { processAudio } = require('../controllers/audioController');
const upload = require('../middleware/upload');

const router = express.Router();

// POST /api/audio/process
// Process an audio file (upload, transcribe, summarize)
router.post('/process', upload.single('audio'), processAudio);

// Note: We've removed the GET /api/audio/file/:fileId route since we're not storing files anymore

module.exports = router;