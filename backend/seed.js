const mongoose = require('mongoose');
const Match = require('./models/matchModel');
const Team = require('./models/teamModel');
const Batsman = require('./models/batsmanModel');
const Bowler = require('./models/bowlerModel');

mongoose.connect('mongodb://localhost:27017/cricket')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

async function seedData() {
  try {
    const team1 = new Team({ name: 'India', totalRuns: 120, wickets: 3, overs: '18.3' });
    const team2 = new Team({ name: 'Australia', totalRuns: 130, wickets: 2, overs: '19.0' });
    await team1.save();
    await team2.save();

    const batsman1 = new Batsman({ name: 'Batsman 1', runs: 45, ballsFaced: 30 });
    const batsman2 = new Batsman({ name: 'Batsman 2', runs: 30, ballsFaced: 25 });
    const batsman3 = new Batsman({ name: 'Batsman 3', runs: 20, ballsFaced: 15 });
    const batsman4 = new Batsman({ name: 'Batsman 4', runs: 25, ballsFaced: 18 });
    await batsman1.save();
    await batsman2.save();
    await batsman3.save();
    await batsman4.save();

    const bowler1 = new Bowler({ name: 'Bowler 1', overs: 4, wickets: 2 });
    const bowler2 = new Bowler({ name: 'Bowler 2', overs: 4, wickets: 1 });
    const bowler3 = new Bowler({ name: 'Bowler 3', overs: 4, wickets: 0 });
    const bowler4 = new Bowler({ name: 'Bowler 4', overs: 3, wickets: 1 });
    await bowler1.save();
    await bowler2.save();
    await bowler3.save();
    await bowler4.save();

    const match = new Match({
      batsmen: [batsman1, batsman2, batsman3, batsman4],
      bowlers: [bowler1, bowler2, bowler3, bowler4],
      teams: [team1, team2],
      commentary: [
        { ball: 1, text: 'Batsman 1 hits a four!' },
        { ball: 2, text: 'Bowler 1 bowls a perfect delivery.' },
        { ball: 3, text: 'Batsman 2 hits a six!' }
      ],
      currentOver: 3
    });

    await match.save();
    console.log('Seed data inserted');
  } catch (err) {
    console.error('Error during seeding data:', err);
  }
}

seedData();
