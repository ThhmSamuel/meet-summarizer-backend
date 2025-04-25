const express = require('express');
const { processAudio } = require('../controllers/audioController');
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Apply protect middleware
router.use(protect);

// POST /api/audio/process
// Process an audio file (upload, transcribe, summarize)
router.post('/process', upload.single('audio'), processAudio);


module.exports = router;