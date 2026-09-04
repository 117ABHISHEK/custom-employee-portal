require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const connectDB = require('./db');
const User = require('../models/User');
const Role = require('../models/Role');
const UserRole = require('../models/UserRole');

const run = async () => {
  await connectDB();

  const email = 'admin@brainwave.com'; // change if you want
  const existing = await User.findOne({ email });
  if (existing) {
    console.log('Admin user already exists:', email);
    return mongoose.connection.close();
  }

  const hashedPassword = await bcrypt.hash('Admin@123', 10); // change this password
  const user = await User.create({ name: 'Super Admin', email, password: hashedPassword });

  const adminRole = await Role.findOne({ name: 'Admin' });
  await UserRole.create({ user: user._id, role: adminRole._id });

  console.log('Bootstrap Admin created:', email, '/ password: Admin@123');
  mongoose.connection.close();
};

run().catch(err => { console.error(err); process.exit(1); });