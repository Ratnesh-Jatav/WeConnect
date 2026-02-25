require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('MONGODB_URI not set in environment');
  process.exit(1);
}

const email = process.argv[2];
if (!email) {
  console.error('Usage: node promoteAdmin.js <email>');
  process.exit(1);
}

async function run() {
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  const user = await User.findOne({ email });
  if (!user) {
    console.error('User not found:', email);
    process.exit(1);
  }
  user.role = 'admin';
  await user.save();
  console.log('Promoted user to admin:', email);
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
