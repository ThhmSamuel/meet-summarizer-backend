const mongoose = require('mongoose');

const SummarySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  originalAudioName: {
    type: String,
    required: true
  },
  transcription: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  editedSummary: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  // Add reference to User model
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Summary', SummarySchema);