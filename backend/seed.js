require('dotenv').config();
const mongoose = require('mongoose');
const Mandalam = require('./models/Mandalam');
const Event = require('./models/Event');
const connectDB = require('./config/db');

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Mandalam.deleteMany();
    await Event.deleteMany();

    // 12 Mandalams requested
    const mandalams = [
      'അങ്കമാലി', 'ആലുവ', 'കളമശ്ശേരി', 'പറവൂർ', 
      'വൈപ്പിൻ', 'കൊച്ചി', 'തൃപ്പൂണിത്തുറ', 'എറണാകുളം', 
      'തൃക്കാക്കര', 'കുന്നത്തുനാട്', 'പിറവം', 'മൂവാറ്റുപുഴ'
    ];

    const mandalamsData = mandalams.map(m => {
      const unameMap = {
        'അങ്കമാലി': 'angamaly', 'ആലുവ': 'aluva', 'കളമശ്ശേരി': 'kalamassery', 'പറവൂർ': 'paravur', 
        'വൈപ്പിൻ': 'vypin', 'കൊച്ചി': 'kochi', 'തൃപ്പൂണിത്തുറ': 'thrippunithura', 'എറണാകുളം': 'ernakulam', 
        'തൃക്കാക്കര': 'thrikkakara', 'കുന്നത്തുനാട്': 'kunnathunad', 'പിറവം': 'piravom', 'മൂവാറ്റുപുഴ': 'muvattupuzha'
      };
      
      const englishName = unameMap[m];
      let firstFour;
      
      // Handle collisions
      if (englishName === 'thrippunithura') {
        firstFour = 'THRP';
      } else if (englishName === 'thrikkakara') {
        firstFour = 'THRK';
      } else {
        firstFour = englishName.substring(0, 4).toUpperCase();
      }

      const username = firstFour + '1234';
      const password = '1234' + firstFour.split('').reverse().join('');

      return {
        username,
        password,
        name: m,
        district: 'Ernakulam'
      };
    });

    for (const mData of mandalamsData) {
      const mandalam = new Mandalam(mData);
      await mandalam.save();
    }

    // Create Admin
    const admin = new Mandalam({
      username: 'ADMI0987',
      password: 'PW890123',
      name: 'Administrator',
      district: 'All',
      role: 'admin'
    });
    await admin.save();

    console.log('Mandalams and Admin Seeded');

    const eventsData = [
      { name: '100m Race', type: 'Individual', category: ['Boys', 'Girls'], maxPerMandalam: 2 },
      { name: 'Badminton', type: 'Individual', category: ['Boys', 'Girls'], maxPerMandalam: 2 },
      { name: 'Shotput', type: 'Individual', category: ['Boys', 'Girls'], maxPerMandalam: 2 },
      { name: 'Arm Wrestling', type: 'Individual', category: ['Boys', 'Girls'], weightCategory: ['Below 60', '60-80', 'Above 80'], maxPerMandalam: 2 },
      { name: 'Shootout', type: 'Individual', category: ['Girls Only'], maxPerMandalam: 2 },
      { name: '4x100m Relay', type: 'Team', category: ['Boys', 'Girls'], maxPerMandalam: 1, participantsPerTeam: 4 },
      { name: '1500m Race', type: 'Individual', category: ['Boys Only'], maxPerMandalam: 2 },
      { name: 'Tug of War', type: 'Team', category: ['Boys', 'Girls'], maxPerMandalam: 1, participantsPerTeam: 7 },
      { name: 'Football', type: 'Team', category: ['Boys Only'], maxPerMandalam: 1, participantsPerTeam: 10 }
    ];

    await Event.insertMany(eventsData);
    console.log('Events Seeded');

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
