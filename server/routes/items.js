const router = require('express').Router();
const Item = require('../models/Item');

// Get all items
router.get('/', async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Post a new lost/found item
router.post('/add', async (req, res) => {
  try {
    const { title, description, category, location, type, contactInfo } = req.body;
    
    const newItem = new Item({
      title,
      description,
      category,
      location,
      type, // 'lost' or 'found'
      contactInfo
    });

    const savedItem = await newItem.save();
    res.status(201).json({ message: "Item posted successfully!", savedItem });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
