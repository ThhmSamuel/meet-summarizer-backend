const Summary = require('../models/Summary');

/**
 * Get all summaries
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllSummaries = async (req, res) => {
  try {
    const summaries = await Summary.find()
      .sort({ createdAt: -1 })
      .select('title createdAt updatedAt');
    
    res.status(200).json({
      success: true,
      count: summaries.length,
      data: summaries
    });
  } catch (error) {
    console.error('Error getting summaries:', error);
    res.status(500).json({
      success: false,
      error: 'Error retrieving summaries',
      details: error.message
    });
  }
};

/**
 * Get a single summary by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getSummaryById = async (req, res) => {
  try {
    const summary = await Summary.findById(req.params.id);
    
    if (!summary) {
      return res.status(404).json({
        success: false,
        error: 'Summary not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Error getting summary:', error);
    res.status(500).json({
      success: false,
      error: 'Error retrieving summary',
      details: error.message
    });
  }
};

/**
 * Update a summary
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateSummary = async (req, res) => {
  try {
    const { title, editedSummary } = req.body;
    
    if (!title && !editedSummary) {
      return res.status(400).json({
        success: false,
        error: 'No update data provided'
      });
    }
    
    const updateData = {
      ...(title && { title }),
      ...(editedSummary && { editedSummary }),
      updatedAt: Date.now()
    };
    
    const summary = await Summary.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!summary) {
      return res.status(404).json({
        success: false,
        error: 'Summary not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Error updating summary:', error);
    res.status(500).json({
      success: false,
      error: 'Error updating summary',
      details: error.message
    });
  }
};

/**
 * Delete a summary
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteSummary = async (req, res) => {
  try {
    const summary = await Summary.findById(req.params.id);
    
    if (!summary) {
      return res.status(404).json({
        success: false,
        error: 'Summary not found'
      });
    }
    
    // Delete summary from database
    await Summary.deleteOne({ _id: summary._id });
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting summary:', error);
    res.status(500).json({
      success: false,
      error: 'Error deleting summary',
      details: error.message
    });
  }
};

module.exports = {
  getAllSummaries,
  getSummaryById,
  updateSummary,
  deleteSummary
};
