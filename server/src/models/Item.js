const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
  claimant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  claimantName: {
    type: String,
    required: true,
    trim: true
  },
  claimantContact: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an item title'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters long']
    },
    description: {
      type: String,
      required: [true, 'Please provide an item description'],
      trim: true
    },
    type: {
      type: String,
      enum: {
        values: ['lost', 'found'],
        message: 'Type must be either "lost" or "found"'
      },
      required: [true, 'Please specify if item was lost or found']
    },
    category: {
      type: String,
      required: [true, 'Please choose an item category'],
      enum: [
        'Electronics',
        'Books & Notes',
        'ID Cards & Wallets',
        'Clothing & Bags',
        'Keys',
        'Bottles & Accessories',
        'Jewelry & Watches',
        'Other'
      ]
    },
    location: {
      type: String,
      required: [true, 'Please provide the campus location where the item was lost/found'],
      trim: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    contactInfo: {
      type: String,
      required: [true, 'Please provide contact information (phone number or email)'],
      trim: true
    },
    imageUrl: {
      type: String,
      trim: true,
      default: ''
    },
    status: {
      type: String,
      enum: ['active', 'claimed', 'resolved'],
      default: 'active'
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Item must be linked to a user']
    },
    claims: [claimSchema]
  },
  {
    timestamps: true
  }
);

// Indexes for fast searching and filtering
itemSchema.index({ title: 'text', description: 'text', location: 'text' });
itemSchema.index({ type: 1, category: 1, status: 1 });

module.exports = mongoose.model('Item', itemSchema);
