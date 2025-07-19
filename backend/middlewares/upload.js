import multer from 'multer';
import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';

// Use memory storage for multer (files will be in memory temporarily)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ storage, fileFilter });

// Custom middleware to handle GridFS upload
export const uploadToGridFS = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return next();
    }

    const db = mongoose.connection.db;
    const bucket = new GridFSBucket(db, { bucketName: 'uploads' });
    
    const uploadedFiles = [];
    
    for (const file of req.files) {
      const filename = `${Date.now()}-${file.originalname}`;
      const uploadStream = bucket.openUploadStream(filename, {
        metadata: {
          uploadedBy: req.user ? req.user.id : null,
          originalname: file.originalname,
          mimetype: file.mimetype
        }
      });

      // Write file buffer to GridFS
      await new Promise((resolve, reject) => {
        uploadStream.end(file.buffer, (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });

      uploadedFiles.push({
        id: uploadStream.id,
        filename: filename,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size
      });
    }

    // Attach uploaded files to request object
    req.uploadedFiles = uploadedFiles;
    next();
  } catch (error) {
    console.error('GridFS upload error:', error);
    res.status(500).json({ message: 'Error uploading files', error: error.message });
  }
};

export default upload;
