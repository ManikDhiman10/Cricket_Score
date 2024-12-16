const mongoose = require('mongoose');
const batsmanSchema = require('./batsmanModel').schema;  // Ensure these are imported correctly
const bowlerSchema = require('./bowlerModel').schema;
const teamSchema = require('./teamModel').schema;

const matchSchema = new mongoose.Schema({
  batsmen: [batsmanSchema],
  bowlers: [bowlerSchema],
  teams: [teamSchema],
  commentary: [{ ball: Number, text: String }],
  currentOver: { type: Number, default: 0 },
});

module.exports = mongoose.model('Match', matchSchema);
