// models/backup.js
const mongoose = require('mongoose');

const backupSchema = new mongoose.Schema({
  data: {
    type: Array,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Backup', backupSchema);
