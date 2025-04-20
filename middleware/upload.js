const multer = require('multer');

// Set up multer for memory storage
const storage = multer.memoryStorage();

// File filter to accept only audio files
const fileFilter = (req, file, cb) => {
  // Accept audio files
  if (file.mimetype.startsWith('audio/')) {
    cb(null, true);
  } else {
    cb(new Error('Only audio files are allowed'), false);
  }
};

// Configure multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max file size
  },
});

module.exports = upload;