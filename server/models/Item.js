const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true }, // e.g., 'Lost' or 'Found'
  location: { type: String, required: true },
  date: { type: Date, default: Date.now },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, default: 'Pending' } // Pending, Resolved
});

module.exports = mongoose.model('Item', itemSchema);
