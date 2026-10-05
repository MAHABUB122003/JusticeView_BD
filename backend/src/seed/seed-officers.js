const mongoose = require('mongoose');
const PoliceOfficer = require('../models/PoliceOfficer');
const Thana = require('../models/Thana');
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected.');

  const thana = await Thana.findOne({ name: 'Dhanmondi' });
  if (!thana) {
    console.log('Thana not found. Run npm run seed first.');
    process.exit(1);
  }

  const officers = [
    { name: 'SI Dhanmondi', name_bn: 'এসআই ধানমন্ডি', designation: 'SI', badgeNumber: '239884', phone: '+8801712345680', thana: thana._id },
    { name: 'OC Dhanmondi', name_bn: 'ওসি ধানমন্ডি', designation: 'OC', badgeNumber: '239885', phone: '+8801712345681', thana: thana._id },
    { name: 'ASI Dhanmondi', name_bn: 'এএসআই ধানমন্ডি', designation: 'ASI', badgeNumber: '239886', phone: '+8801712345682', thana: thana._id },
  ];

  await PoliceOfficer.deleteMany({});
  await PoliceOfficer.insertMany(officers);
  console.log(`${officers.length} police officers seeded.`);
  mongoose.disconnect();
};

seed().catch(err => { console.error(err); process.exit(1); });
