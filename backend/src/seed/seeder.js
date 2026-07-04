const mongoose = require('mongoose');
const Division = require('../models/Division');
const District = require('../models/District');
const Thana = require('../models/Thana');
const User = require('../models/User');
const Setting = require('../models/Setting');
const divisions = require('./divisions');
const districts = require('./districts');
const thanas = require('./thanas');
const users = require('./users');

require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding...');

    // Clear existing data
    await Promise.all([
      Division.deleteMany({}),
      District.deleteMany({}),
      Thana.deleteMany({}),
      User.deleteMany({}),
      Setting.deleteMany({}),
    ]);
    console.log('Cleared existing data.');

    // Seed divisions
    const createdDivisions = await Division.insertMany(divisions);
    console.log(`${createdDivisions.length} divisions seeded.`);

    // Seed districts
    const districtDocs = districts.map(d => ({
      name: d.name,
      name_bn: d.name_bn,
      code: d.code,
      division: createdDivisions[d.divisionIndex]._id,
    }));
    const createdDistricts = await District.insertMany(districtDocs);
    console.log(`${createdDistricts.length} districts seeded.`);

    // Seed thanas
    const thanaDocs = thanas.map(t => ({
      name: t.name,
      name_bn: t.name_bn,
      district: createdDistricts[t.districtIndex]._id,
    }));
    await Thana.insertMany(thanaDocs);
    console.log(`${thanaDocs.length} thanas seeded.`);

    // Seed users
    for (const userData of users) {
      await User.create(userData);
    }
    console.log(`${users.length} users seeded.`);

    // Seed default settings
    await Setting.create({
      siteName: 'JusticeView',
      siteName_bn: 'জাস্টিসভিউ',
      defaultLanguage: 'en',
      maintenanceMode: false,
      registrationEnabled: true,
    });
    console.log('Default settings seeded.');

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

seed();
