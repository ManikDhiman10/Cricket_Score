"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {

  const [striker, setStriker] = useState('');
  const [nonStriker, setNonStriker] = useState('');
  const [bowler, setBowler] = useState('');
  const [teamScores, setTeamScores] = useState({ country1: 0, country2: 0 });
  const [teamWickets, setTeamWickets] = useState({ country1: 0, country2: 0 }); 
  const [commentary, setCommentary] = useState([]);
  const [ballsTimeline, setBallsTimeline] = useState([]);
  const [overCount, setOverCount] = useState(1);
  const [ballCount, setBallCount] = useState(1);
  const [runs, setRuns] = useState(0); 
  const [wickets, setWickets] = useState(0); 
  const [playerScores, setPlayerScores] = useState({}); 
  const [battedPlayers, setBattedPlayers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4000/api/match')
      .then(response => {
        const matchData = response.data;
        setStriker(matchData.players[0].name);
        setNonStriker(matchData.players[1].name);
        setBowler(matchData.players[2].name); 

        const initialPlayerScores = {};
        matchData.players.forEach(player => {
          initialPlayerScores[player.name] = { runs: 0, balls: 0 };
        });
        setPlayerScores(initialPlayerScores);
      })
      .catch(error => {
        console.log('Error fetching match data:', error);
      });
  }, []);

  const handleScore = (score) => {
    let scoreIncrement = 0;

    if (['1', '2', '3', '4', '6'].includes(score)) {
      scoreIncrement = parseInt(score, 10); 
    } else if (score === 'Wide' || score === 'No Ball') {
      scoreIncrement = 1; 
    } else if (score === 'Wicket') {
      setWickets(prevWickets => prevWickets + 1);
    }

    if (striker && playerScores[striker]) {
      setPlayerScores(prevScores => ({
        ...prevScores,
        [striker]: {
          runs: prevScores[striker].runs + scoreIncrement,
          balls: prevScores[striker].balls + 1,
        },
      }));
    }

    if (scoreIncrement !== 0) {
      setRuns(prevRuns => prevRuns + scoreIncrement);
    }

    const newTimeline = [...ballsTimeline, score];
    if (newTimeline.length > 24) {
      newTimeline.shift();
    }
    setBallsTimeline(newTimeline);


    const validScores = ['1', '2', '3', '4', '5', '6', 'wide', 'Wicket', 'No Ball'];
    if (validScores.includes(score)) {
      const runText = () => {
        if (score === 'wide') {
          return 'wide';
        } else if (score === 'No Ball') {
          return 'No Ball';
        } else if (score === 'Wicket') {
          return 'Wicket';
        } else {
          return `${score} run${score === '1' ? '' : 's'}`;
        }
      };
      
      const newCommentary = [
        ...commentary,
        `${overCount}.${ballCount} ${bowler} to ${striker}: ${runText()}.`
      ];
      setCommentary(newCommentary);
    }

    if (ballCount === 6) {
      setOverCount(prevOverCount => prevOverCount + 1);
      setBallCount(1); 
    } else {
      setBallCount(prevBallCount => prevBallCount + 1);
    }

    if (score === '1' || score === '3') {
      setStriker(nonStriker);
      setNonStriker(striker);
    } else if (score === 'Wicket') {
      const remainingPlayers = Object.keys(playerScores).filter(
        (player) => !battedPlayers.includes(player) && player !== nonStriker
      );
    
      if (remainingPlayers.length > 0) {
        const newStriker = remainingPlayers[0];
        setStriker(newStriker);
        setBattedPlayers((prev) => [...prev, newStriker]);
      } else {
        alert("All players are out!");
      }
    } 

    if (score === 'Wicket') {
      const isTeam1 = Object.keys(playerScores).slice(0, Math.ceil(Object.keys(playerScores).length / 2)).includes(striker);
      if (isTeam1) {
        setTeamWickets(prevWickets => ({ ...prevWickets, country1: prevWickets.country1 + 1 }));
      } else {
        setTeamWickets(prevWickets => ({ ...prevWickets, country2: prevWickets.country2 + 1 }));
      }
    }
  };

  const handleDone = () => {
    setStriker(nonStriker);
    setNonStriker(striker);
  };

  const calculateTeamScores = () => {
    let country1Score = 0;
    let country2Score = 0;

    const playerEntries = Object.entries(playerScores);
    const half = Math.ceil(playerEntries.length / 2);

    playerEntries.slice(0, half).forEach(([playerName, score]) => {
      country1Score += score.runs;
    });

    playerEntries.slice(half).forEach(([playerName, score]) => {
      country2Score += score.runs;
    });

    return { country1: country1Score, country2: country2Score };
  };

  useEffect(() => {
    const { country1, country2 } = calculateTeamScores();
    setTeamScores({ country1, country2 });
  }, [playerScores]);

  return (
    <div className="flex bg-gradient-to-r from-blue-800 to-purple-700 min-h-screen">
      {/* Left Section: Buttons and Controls */}
      <div className="w-2/3 p-8 space-y-6 text-white">
        <h1 className="text-3xl font-semibold text-center">Cricket Dashboard</h1>
        
        {/* Dropdowns */}
        <div className="flex flex-wrap justify-between">
          <div className="flex flex-col md:flex-row items-start md:items-center md:my-2 w-full md:w-auto">
            <label htmlFor="striker" className="font-medium mb-2 md:mb-0 md:mr-2">Striker:</label>
            <select
              id="striker"
              className="p-3 rounded-xl bg-gray-700 text-white w-full md:w-auto"
              value={striker}
              onChange={(e) => setStriker(e.target.value)}
            >
              {Object.keys(playerScores).map(playerName => (
                <option key={playerName} value={playerName}>
                  {playerName}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center md:my-2 w-full md:w-auto">
            <label htmlFor="nonStriker" className="font-medium mb-2 md:mb-0 md:mr-2">Non-Striker:</label>
            <select
              id="nonStriker"
              className="p-3 rounded-xl bg-gray-700 text-white w-full md:w-auto"
              value={nonStriker}
              onChange={(e) => setNonStriker(e.target.value)}
            >
              {Object.keys(playerScores).map(playerName => (
                <option key={playerName} value={playerName}>
                  {playerName}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center md:my-2 w-full md:w-auto">
            <label htmlFor="bowler" className="font-medium mb-2 md:mb-0 md:mr-2">Bowler:</label>
            <select
              id="bowler"
              className="p-3 rounded-xl bg-gray-700 text-white w-full md:w-auto"
              value={bowler}
              onChange={(e) => setBowler(e.target.value)}
            >
              {Object.keys(playerScores).map(playerName => (
                <option key={playerName} value={playerName}>
                  {playerName}
                </option>
              ))}
            </select>
          </div>
        </div>


        {/* Score Control Buttons */}
        <div className="grid grid-cols-4 gap-6 max-sm:gap-4 max-sm:grid-cols-3 max-[465px]:grid-cols-2">
          {[
            'Ball Start',
            'Wide',
            'No Ball',
            'Bowler Stop',
            'Others',
            'Leg Bye',
            'Misfield',
            'Overthrow',
            'Wicket',
            '0',
            '1',
            '2',
            '3',
            '4',
            '6',
            'Review',
            'Wicket Confirm',
            'Boundary check',
            'Appeal',
            'Catch drop',
            'Third umpire',
            'Bye',
            'Ball in air',
            'Done',
          ].map((buttonLabel, idx) => {
            let color;
            switch (buttonLabel) {
              case 'Ball Start':
                color = 'bg-green-600';
                break;
              case 'Wide':
                color = 'bg-yellow-600';
                break;
              case 'No Ball':
                color = 'bg-teal-600';
                break;
              case 'Bowler Stop':
                color = 'bg-purple-600';
                break;
              case 'Others':
                color = 'bg-blue-600';
                break;
              case 'Leg Bye':
                color = 'bg-indigo-600';
                break;
              case 'Done':
                color = 'bg-emerald-600';
                break;
              case 'Misfield':
                color = 'bg-red-600';
                break;
              case 'Overthrow':
                color = 'bg-orange-600';
                break;
              case 'Wicket':
                color = 'bg-pink-600';
                break;
              case 'Boundary check':
                color = 'bg-yellow-500';
                break;
              case 'Appeal':
                color = 'bg-red-500';
                break;
              case 'Catch drop':
                color = 'bg-blue-500';
                break;
              case 'Third umpire':
                color = 'bg-purple-500';
                break;
              case 'Bye':
                color = 'bg-indigo-500';
                break;
              case 'Ball in air':
                color = 'bg-gray-500';
                break;
              default:
                color = 'bg-gray-600';
            }
            return (
              <button
                key={idx}
                className={`${color} rounded-lg py-3 px-4 max-sm:px-0 text-center text-white max-sm:text-sm  max-xs:text-xs`}
                onClick={() => handleScore(buttonLabel)}
              >
                {buttonLabel}
              </button>
            );
          })}
        </div>
                {/* Mute & Text Toggle */}
                <div className="flex items-center">
          <input
            type="checkbox"
            id="mute-text"
            className="mr-2"
          />
          <label htmlFor="mute-text" className="text-white">Mute & Text Off</label>
        </div>
      </div>

      {/* Right Section: Match Info and Stats */}
      <div className="w-1/3 p-8 space-y-6 text-white">
        <h2 className="text-2xl font-semibold">Scorecard</h2>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span>{`Team 1: ${teamScores.country1} Runs | Wickets: ${teamWickets.country1}`}</span>
            <span>{`Team 2: ${teamScores.country2} Runs | Wickets: ${teamWickets.country2}`}</span>
          </div>
        </div>

          {/* Last 24 Balls Timeline */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Last 24 Balls</h3>
            <div className="flex flex-wrap gap-2">
              {ballsTimeline.map((ball, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full bg-gray-700 text-sm"
                >
                  {ball}
                </span>
              ))}
            </div>
          </div>

          {/* Commentary Section */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Commentary</h3>
            {commentary.length > 0 ? (
              <div className="max-h-64 overflow-y-auto bg-gray-800 p-4 rounded-lg">
                {commentary.map((comment, index) => (
                  <p key={index} className="text-sm mb-2">
                    {comment}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-sm">No commentary yet.</p>
            )}
          </div>
                  {/* Player Scores */}
        <div className="space-y-4  bg-gray-800 p-4 rounded-lg">
          <h3 className="text-xl font-semibold">Player Scores</h3>
          {Object.entries(playerScores).map(([playerName, { runs, balls }]) => (
            <div key={playerName} className="flex justify-between max-h-64 overflow-y-auto ">
              <span>{playerName}</span>
              <span>{`Runs: ${runs}, Balls: ${balls}`}</span>
            </div>
          ))}
        </div>
        </div>    
      </div>
  );
};

export default Dashboard;
