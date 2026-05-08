require('dotenv').config();
const mongoose = require('mongoose');
const Mandalam = require('./models/Mandalam');
const connectDB = require('./config/db');

const seedExtraMandalams = async () => {
  try {
    await connectDB();

    const extraMandalams = [
      { malayalam: 'പെരുമ്പാവൂർ', english: 'perumbavoor' },
      { malayalam: 'കോതമംഗലം', english: 'kothamangalam' }
    ];

    for (const m of extraMandalams) {
      // Check if already exists
      const existing = await Mandalam.findOne({ name: m.malayalam });
      if (existing) {
        console.log(`${m.malayalam} already exists, skipping...`);
        continue;
      }

      const firstFour = m.english.substring(0, 4).toUpperCase();
      const username = firstFour + '1234';
      const password = '1234' + firstFour.split('').reverse().join('');

      const mandalam = new Mandalam({
        username,
        password, // Will be hashed by the model pre-save hook
        name: m.malayalam,
        district: 'Ernakulam'
      });

      await mandalam.save();
      console.log(`Seeded: ${m.malayalam} (Username: ${username}, Password: ${password})`);
    }

    console.log('Extra Mandalams Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedExtraMandalams();
