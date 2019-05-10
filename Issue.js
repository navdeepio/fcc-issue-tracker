const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  project: {
    type: String,
    required: true,
  },
  issue_title: {
    type: String,
    required: true,
  },
  issue_text: {
    type: String,
    required: true,
  },
  created_by: {
    type: String,
    required: true,
  },
  open: {
    type: Boolean,
    required: true,
    default: true,
  },
  assigned_to: {
    type: String,
    default: '',
  },
  status_text: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});


module.exports = mongoose.model('Issue', issueSchema);
