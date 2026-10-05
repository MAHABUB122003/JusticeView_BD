const mongoose = require('mongoose');
const Court = require('../models/Court');
const District = require('../models/District');
const courts = require('./courts');
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB.');

  const districts = await District.find({});
  const districtMap = {};
  districts.forEach(d => { districtMap[d.name] = d._id; });

  const unresolved = [];
  const courtDocs = courts.map(c => {
    const districtId = districtMap[c.districtName];
    if (!districtId) {
      unresolved.push(c.districtName);
    }
    return {
      name: c.name,
      name_bn: c.name_bn,
      district: districtId,
      courtType: c.courtType,
    };
  });

  if (unresolved.length) {
    console.log('Unresolved districts:', [...new Set(unresolved)]);
    process.exit(1);
  }

  await Court.deleteMany({});
  await Court.insertMany(courtDocs);
  console.log(`${courtDocs.length} courts seeded successfully.`);
  mongoose.disconnect();
};

seed().catch(err => { console.error(err); process.exit(1); });
