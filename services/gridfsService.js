const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');
const stream = require('stream');

/**
 * Upload file to MongoDB GridFS
 * @param {Buffer} fileBuffer - File buffer
 * @param {String} fileName - File name
 * @param {String} contentType - File MIME type
 * @returns {Promise<Object>} - Object containing fileId and URL for accessing the file
 */
const uploadFile = async (fileBuffer, fileName, contentType) => {
  try {
    // Create a GridFSBucket
    const db = mongoose.connection.db;
    const bucket = new GridFSBucket(db, {
      bucketName: 'audioFiles'
    });
    
    // Create a readable stream from buffer
    const readableStream = new stream.PassThrough();
    readableStream.end(fileBuffer);
    
    // Generate a unique filename
    const uniqueFileName = `${Date.now()}-${fileName}`;
    
    // Create upload stream
    const uploadStream = bucket.openUploadStream(uniqueFileName, {
      contentType: contentType
    });
    
    // Return a promise that resolves with file info when upload completes
    return new Promise((resolve, reject) => {
      readableStream.pipe(uploadStream)
        .on('error', (error) => {
          reject(error);
        })
        .on('finish', () => {
          // Construct a URL or reference to access this file
          const fileId = uploadStream.id.toString();
          const fileUrl = `/api/audio/file/${fileId}`;
          
          resolve({
            fileId,
            fileUrl
          });
        });
    });
  } catch (error) {
    console.error('Error uploading to GridFS:', error);
    throw error;
  }
};

/**
 * Get file from MongoDB GridFS
 * @param {String} fileId - The ID of the file
 * @returns {Promise<Object>} - Stream of the file and file metadata
 */
const getFile = async (fileId) => {
  try {
    const db = mongoose.connection.db;
    const bucket = new GridFSBucket(db, {
      bucketName: 'audioFiles'
    });
    
    // Convert string ID to ObjectId
    const objectId = new mongoose.Types.ObjectId(fileId);
    
    // Get file metadata
    const files = await bucket.find({ _id: objectId }).toArray();
    
    if (!files || files.length === 0) {
      throw new Error('File not found');
    }
    
    // Create download stream
    const downloadStream = bucket.openDownloadStream(objectId);
    
    return {
      stream: downloadStream,
      metadata: files[0]
    };
  } catch (error) {
    console.error('Error getting file from GridFS:', error);
    throw error;
  }
};

/**
 * Delete file from MongoDB GridFS
 * @param {String} fileId - The ID of the file to delete
 */
const deleteFile = async (fileId) => {
  try {
    const db = mongoose.connection.db;
    const bucket = new GridFSBucket(db, {
      bucketName: 'audioFiles'
    });
    
    // Convert string ID to ObjectId
    const objectId = new mongoose.Types.ObjectId(fileId);
    
    // Delete file
    await bucket.delete(objectId);
    console.log(`File deleted: ${fileId}`);
  } catch (error) {
    console.error('Error deleting from GridFS:', error);
    throw error;
  }
};

module.exports = {
  uploadFile,
  getFile,
  deleteFile
};