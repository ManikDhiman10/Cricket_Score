const mongoose = require('mongoose');

const bowlerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  overs: { type: Number, default: 0 },
  runsConceded: { type: Number, default: 0 },
  wickets: { type: Number, default: 0 },
});

module.exports = mongoose.model('Bowler', bowlerSchema);
