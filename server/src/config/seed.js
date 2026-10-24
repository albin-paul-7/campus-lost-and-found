const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../../../server/.env') });
dotenv.config();

const User = require('../models/User');
const Item = require('../models/Item');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('❌ Error: No MONGO_URI specified in environment');
      process.exit(1);
    }

    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri);
    console.log('Connected! Checking existing records...');

    // Clear existing items and demo users
    await Item.deleteMany({});
    await User.deleteMany({ email: { $in: ['arun@campus.edu', 'security@campus.edu'] } });

    console.log('Creating demo campus users...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    const adminHashedPassword = await bcrypt.hash('adminpassword123', salt);

    const studentUser = await User.create({
      name: 'Arun Kumar',
      email: 'arun@campus.edu',
      password: hashedPassword,
      department: 'Computer Science',
      phone: '+91 98471 23456',
      role: 'user'
    });

    const adminUser = await User.create({
      name: 'Campus Helpdesk & Security',
      email: 'security@campus.edu',
      password: adminHashedPassword,
      department: 'Campus Security Office',
      phone: '+91 94000 11223',
      role: 'admin'
    });

    console.log('Creating initial campus lost & found items...');

    const sampleItems = [
      {
        title: 'Casio Scientific Calculator fx-991EX',
        description: 'Found left behind on the second row desk after the morning semester exam. Has a small white sticker on the back cover.',
        type: 'found',
        category: 'Electronics',
        location: 'Examination Hall 2 (Main Academic Block)',
        contactInfo: 'Available at Main Security Desk or call +91 94000 11223',
        status: 'active',
        postedBy: adminUser._id,
        imageUrl: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=600&q=80',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Dell 65W USB-C Laptop Charger',
        description: 'Misplaced my black Dell laptop charger with round adapter pin while studying in the quiet reading zone yesterday evening.',
        type: 'lost',
        category: 'Electronics',
        location: 'Central Library 2nd Floor (Quiet Study Section)',
        contactInfo: 'Email arun@campus.edu or call +91 98471 23456',
        status: 'active',
        postedBy: studentUser._id,
        imageUrl: '',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Student ID Card - B.Tech Mechanical (S4)',
        description: 'Found an official college identity card lying near the billing counter of the cafeteria during lunch break.',
        type: 'found',
        category: 'ID Cards & Wallets',
        location: 'Student Cafeteria Ground Floor Counter',
        contactInfo: 'Handed over to Cafeteria Manager counter',
        status: 'active',
        postedBy: studentUser._id,
        imageUrl: '',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Set of 3 Keys with Red Spiderman Keychain',
        description: 'Lost my room and locker keys attached to a red Marvel Spiderman silicone keychain while playing badminton.',
        type: 'lost',
        category: 'Keys',
        location: 'Campus Sports Complex, Indoor Court 2',
        contactInfo: 'Please contact Arun at +91 98471 23456',
        status: 'active',
        postedBy: studentUser._id,
        imageUrl: '',
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Stainless Steel Insulated Water Flask (Matte Blue)',
        description: 'Spotted a blue metal water bottle on the 4th row seat of Room 204 after the afternoon lecture.',
        type: 'found',
        category: 'Bottles & Accessories',
        location: 'Mechanical Block Room 204',
        contactInfo: 'Kept with Department Staff Room Attendant',
        status: 'active',
        postedBy: adminUser._id,
        imageUrl: '',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Dark Blue Wildcraft College Backpack',
        description: 'Found outside the workshop shed with lab manuals and engineering drawing tools inside. Successfully identified and returned to the student!',
        type: 'found',
        category: 'Clothing & Bags',
        location: 'Engineering Workshop Entrance',
        contactInfo: 'Returned by Security Office',
        status: 'resolved',
        postedBy: adminUser._id,
        imageUrl: '',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      }
    ];

    await Item.insertMany(sampleItems);
    console.log(`✅ Database successfully seeded with 2 users and ${sampleItems.length} campus items!`);
    console.log('Demo Credentials:');
    console.log('  Student: email: "arun@campus.edu", password: "password123"');
    console.log('  Admin:   email: "security@campus.edu", password: "adminpassword123"');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
};

seedData();
