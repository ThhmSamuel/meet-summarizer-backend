const express = require('express');
const {
  getAllSummaries,
  getSummaryById,
  updateSummary,
  deleteSummary
} = require('../controllers/summaryController');

const { protect } = require('../middleware/auth');

const router = express.Router();

//Applu protection to all middleware routes
router.use(protect);

// GET /api/summary
// Get all summaries (list view)
router.get('/', getAllSummaries);

// GET /api/summary/:id
// Get a specific summary
router.get('/:id', getSummaryById);

// PUT /api/summary/:id
// Update a summary
router.put('/:id', updateSummary);

// DELETE /api/summary/:id
// Delete a summary
router.delete('/:id', deleteSummary);

module.exports = router;