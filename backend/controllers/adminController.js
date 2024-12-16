const Match = require('../models/matchModel');
const WebSocket = require('../utils/websocket');

exports.updateScore = async (req, res) => {
  const { runs, batsmanName, bowlerName, overNumber } = req.body;

  try {
    const match = await Match.findOne();

    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }
    const batsman = match.batsmen.find(b => b.name === batsmanName);
    if (!batsman) {
      return res.status(404).json({ message: 'Batsman not found' });
    }
    batsman.runs += runs;
    batsman.ballsFaced += 1;
    batsman.strikeRate = (batsman.runs / batsman.ballsFaced) * 100;

    if (runs % 2 !== 0) batsman.isStriker = !batsman.isStriker;

    const bowler = match.bowlers.find(b => b.name === bowlerName);
    if (!bowler) {
      return res.status(404).json({ message: 'Bowler not found' });
    }
    bowler.runsConceded += runs;

    match.teams[0].totalRuns += runs;
    match.currentOver = overNumber;

    match.commentary.push({ ball: overNumber, text: `${runs} runs to ${batsmanName}` });

    await match.save();

    WebSocket.emitUpdate(match);

    res.status(200).json({ message: 'Score updated successfully', match });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating score', error });
  }
};

exports.getLiveScore = async (req, res) => {
  try {
    const match = await Match.findOne();
    if (!match) {
      return res.status(404).json({ message: 'No live match found' });
    }
    res.status(200).json(match);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching live score', error });
  }
};
