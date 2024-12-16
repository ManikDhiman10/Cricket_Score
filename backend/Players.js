const mongoose = require('mongoose');
const Batsman = require('./models/batsmanModel');
const Bowler = require('./models/bowlerModel');

mongoose.connect('mongodb://localhost:27017/CricketScore', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to CricketScore database'))
  .catch(err => console.error('Database connection error:', err));

const indianPlayers = [
  'Virat Kohli', 'Rohit Sharma', 'KL Rahul', 'Shubman Gill', 'Hardik Pandya',
  'Ravindra Jadeja', 'MS Dhoni', 'Suryakumar Yadav', 'Ishan Kishan', 'Ravichandran Ashwin',
  'Yuzvendra Chahal', 'Mohammed Shami', 'Jasprit Bumrah', 'Axar Patel', 'Shreyas Iyer'
];

const australianPlayers = [
  'David Warner', 'Steve Smith', 'Marnus Labuschagne', 'Glenn Maxwell', 'Travis Head',
  'Pat Cummins', 'Mitchell Starc', 'Josh Hazlewood', 'Alex Carey', 'Cameron Green',
  'Marcus Stoinis', 'Adam Zampa', 'Nathan Lyon', 'Aaron Finch', 'Usman Khawaja'
];

const createPlayers = async () => {
  try {
    const batsmen = [];
    const bowlers = [];

    [...indianPlayers, ...australianPlayers].forEach((player, index) => {
      if (index % 2 === 0) {
        batsmen.push({ name: player });
      } else {
        bowlers.push({ name: player });
      }
    });

    await Batsman.insertMany(batsmen);
    console.log(`${batsmen.length} batsmen inserted into the database.`);

    await Bowler.insertMany(bowlers);
    console.log(`${bowlers.length} bowlers inserted into the database.`);
  } catch (err) {
    console.error('Error inserting players:', err);
  } finally {
    mongoose.connection.close();
  }
};
createPlayers();
