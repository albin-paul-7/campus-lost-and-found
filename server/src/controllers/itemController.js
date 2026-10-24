const Item = require('../models/Item');

// @desc    Get all items with search, filters, and pagination
// @route   GET /api/items
// @access  Public
const getItems = async (req, res, next) => {
  try {
    const {
      search,
      type,
      category,
      status,
      page = 1,
      limit = 12,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    const query = {};

    // Filter by type: 'lost' or 'found'
    if (type && type !== 'all') {
      query.type = type.toLowerCase();
    }

    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }

    // Filter by status
    if (status && status !== 'all') {
      query.status = status;
    }

    // Search keyword in title, description, or location
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { location: searchRegex }
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const total = await Item.countDocuments(query);
    const items = await Item.find(query)
      .populate('postedBy', 'name email phone department')
      .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: items.length,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      items
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single item by ID
// @route   GET /api/items/:id
// @access  Public
const getItemById = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('postedBy', 'name email phone department')
      .populate('claims.claimant', 'name email');

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    res.status(200).json({
      success: true,
      item
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new lost or found item
// @route   POST /api/items
// @access  Private
const createItem = async (req, res, next) => {
  try {
    const {
      title,
      description,
      type,
      category,
      location,
      contactInfo,
      imageUrl,
      date
    } = req.body;

    if (!title || !description || !type || !category || !location || !contactInfo) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, description, type, category, location, and contact information'
      });
    }

    if (!['lost', 'found'].includes(type.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Type must be either "lost" or "found"'
      });
    }

    const item = await Item.create({
      title,
      description,
      type: type.toLowerCase(),
      category,
      location,
      contactInfo,
      imageUrl: imageUrl || '',
      date: date ? new Date(date) : new Date(),
      postedBy: req.user._id
    });

    const populatedItem = await Item.findById(item._id).populate('postedBy', 'name email');

    res.status(201).json({
      success: true,
      message: `Item reported as ${type.toUpperCase()} successfully`,
      item: populatedItem
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update item
// @route   PUT /api/items/:id
// @access  Private (Owner or Admin)
const updateItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Ownership check (Section 6.6)
    const isOwner = item.postedBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You are only allowed to modify your own reported items'
      });
    }

    const {
      title,
      description,
      type,
      category,
      location,
      contactInfo,
      imageUrl,
      status,
      date
    } = req.body;

    if (title) item.title = title;
    if (description) item.description = description;
    if (type) item.type = type.toLowerCase();
    if (category) item.category = category;
    if (location) item.location = location;
    if (contactInfo) item.contactInfo = contactInfo;
    if (imageUrl !== undefined) item.imageUrl = imageUrl;
    if (status) item.status = status;
    if (date) item.date = new Date(date);

    const updatedItem = await item.save();
    const populated = await Item.findById(updatedItem._id).populate('postedBy', 'name email phone');

    res.status(200).json({
      success: true,
      message: 'Item updated successfully',
      item: populated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete item
// @route   DELETE /api/items/:id
// @access  Private (Owner or Admin)
const deleteItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Ownership check (Section 6.6)
    const isOwner = item.postedBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only delete items that you posted'
      });
    }

    await Item.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update item status (e.g., mark as resolved or claimed)
// @route   PATCH /api/items/:id/status
// @access  Private (Owner or Admin)
const updateItemStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['active', 'claimed', 'resolved'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be "active", "claimed", or "resolved"'
      });
    }

    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    const isOwner = item.postedBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only update the status of your own items'
      });
    }

    item.status = status;
    await item.save();

    res.status(200).json({
      success: true,
      message: `Item marked as ${status}`,
      item
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit a claim for a found or lost item
// @route   POST /api/items/:id/claim
// @access  Private
const claimItem = async (req, res, next) => {
  try {
    const { message, contactInfo } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide proof or description details in your claim message'
      });
    }

    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Add claim
    const newClaim = {
      claimant: req.user._id,
      claimantName: req.user.name,
      claimantContact: contactInfo || req.user.email,
      message: message.trim(),
      status: 'pending',
      createdAt: new Date()
    };

    item.claims.push(newClaim);
    await item.save();

    res.status(201).json({
      success: true,
      message: 'Claim request submitted successfully to the item reporter',
      claim: newClaim
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get items posted by current user
// @route   GET /api/items/user/my-items
// @access  Private
const getMyItems = async (req, res, next) => {
  try {
    const items = await Item.find({ postedBy: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: items.length,
      items
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get campus lost & found dashboard statistics
// @route   GET /api/items/stats
// @access  Public
const getStats = async (req, res, next) => {
  try {
    const [total, lost, found, resolved] = await Promise.all([
      Item.countDocuments(),
      Item.countDocuments({ type: 'lost' }),
      Item.countDocuments({ type: 'found' }),
      Item.countDocuments({ status: 'resolved' })
    ]);

    res.status(200).json({
      success: true,
      stats: {
        total,
        lost,
        found,
        resolved,
        recoveryRate: total > 0 ? Math.round((resolved / total) * 100) : 0
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  updateItemStatus,
  claimItem,
  getMyItems,
  getStats
};
