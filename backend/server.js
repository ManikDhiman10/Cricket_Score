const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const app = express();
const port = 4000;
require('dotenv').config();

mongoose.connect('mongodb://localhost:27017/CricketScore')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);

const BatsmanSchema = new mongoose.Schema({
  name: String,
});

const BowlerSchema = new mongoose.Schema({
  name: String,
});

const TeamSchema = new mongoose.Schema({
  name: String,
  totalRuns: { type: Number, default: 0 },
  wickets: { type: Number, default: 0 },
  overs: { type: Number, default: 0 },
});

const Batsman = mongoose.model('Batsman', BatsmanSchema);
const Bowler = mongoose.model('Bowler', BowlerSchema);
const Team = mongoose.model('Team', TeamSchema);

app.get('/api/match', async (req, res) => {
  try {
    const batsmen = await Batsman.find();
    const bowlers = await Bowler.find();
    const teams = await Team.find();
    const players = [
      ...batsmen.map(b => ({ name: b.name, type: 'batsman' })),
      ...bowlers.map(b => ({ name: b.name, type: 'bowler' }))
    ];
    const teamScores = teams.length ? teams.map(team => ({
      name: team.name,
      totalRuns: team.totalRuns,
      wickets: team.wickets,
      overs: team.overs,
    })) : [
      { name: 'India', totalRuns: 250, wickets: 8, overs: 50 },
      { name: 'Australia', totalRuns: 245, wickets: 9, overs: 50 }
    ];

    const matchData = {
      teamScores: teamScores,
      players: players,
      commentary: ["Great shot by Kohli!", "Smith takes a quick single"], 
      ballsTimeline: ["Over 1: 1 run", "Over 2: 2 runs"],
    };

    res.json(matchData);
  } catch (error) {
    console.error('Error fetching match data:', error);
    res.status(500).json({ error: 'Failed to fetch match data' });
  }
});
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
