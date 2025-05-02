// models/Document.js
const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['pdf', 'video'],
    required: true,
  },
  filePath: {
    type: String,
  },
  youtubeUrl: {
    type: String,
  },
  content: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Create text index for search
documentSchema.index({ title: 'text', content: 'text' });

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;