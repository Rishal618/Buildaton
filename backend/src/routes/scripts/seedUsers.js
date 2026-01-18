const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcrypt');   // <-- add bcrypt
const User = require('../models/User'); // adjust path if needed

require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

async function seed() {
  console.log("MONGO_URI:", process.env.MONGO_URI);

  await mongoose.connect(process.env.MONGO_URI);

  await User.deleteMany({});

  const users = [
    { email: "advisor@college.edu", password: await bcrypt.hash("advisor123", 10), role: "advisor" },
    { email: "hod@college.edu", password: await bcrypt.hash("hod123", 10), role: "hod" },
    { email: "principal@college.edu", password: await bcrypt.hash("principal123", 10), role: "principal" },
    { email: "student1@college.edu", password: await bcrypt.hash("2005-07-14", 10), role: "student" },
    { email: "student2@college.edu", password: await bcrypt.hash("2006-01-22", 10), role: "student" }
  ];

  await User.insertMany(users);
  console.log("Users seeded");
  mongoose.disconnect();
}

seed();
