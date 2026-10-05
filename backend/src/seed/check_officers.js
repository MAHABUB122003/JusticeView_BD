const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const PoliceOfficer = require('../models/PoliceOfficer');
const Thana = require('../models/Thana');
const User = require('../models/User');

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  const count = await PoliceOfficer.countDocuments();
  console.log('PoliceOfficer count:', count);
  const users = await User.find({ role: 'police_officer' }).lean();
  console.log('Police officer users:', users.map(u => ({ name: u.name, email: u.email, id: u._id })));
  const thanas = await Thana.find({ name: { $in: ['Dhanmondi'] } }).lean();
  console.log('Thanas found:', thanas.map(t => ({ name: t.name, id: t._id })));
  const thanaCount = await Thana.countDocuments();
  console.log('Total thanas:', thanaCount);
  await mongoose.disconnect();
}
check().catch(e => { console.error(e); process.exit(1); });
