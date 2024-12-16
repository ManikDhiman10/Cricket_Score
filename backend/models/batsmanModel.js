const mongoose = require('mongoose');

const batsmanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  runs: { type: Number, default: 0 },
  ballsFaced: { type: Number, default: 0 },
  strikeRate: { type: Number, default: 0 },
  isStriker: { type: Boolean, default: false },
});

module.exports = mongoose.model('Batsman', batsmanSchema);
