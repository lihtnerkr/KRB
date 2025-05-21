import { useState, useEffect} from 'react';
import { TournamentSettings } from './components/TournamentSettings';
import { Controls } from './components/Controls';
import { PairingsTable } from './components/PairingsTable';
import { StandingsTable } from './components/StandingsTable';
import { TeamResultsTable } from './components/TeamResultsTable';
import { RoundHistory } from './components/RoundHistory';
import { PlayerEditor } from './components/PlayerEditor';
import { TournamentStats } from './components/TournamentStats';
import { StartList } from './components/StartList';
import { AlphabeticalView } from './components/AlphabeticalView';
import { groupByPoints, calculatePairScore } from './utils/helpers';
import { Player, Team, TournamentParams, ViewMode, Pairing } from './utils/types';
import { Routes, Route, Navigate } from 'react-router-dom';
import logo from '/src/image/image.png'



const App = () => {
  const [tournamentParams, setTournamentParams] = useState<TournamentParams>({
    playerCount: 16,
    teamCount: 4,
    rounds: 5,
    countedMembers: 4,
    maxRepeatMatches: 0
  });

  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [pairings, setPairings] = useState<Pairing[]>([]);
  const [, setViewMode] = useState<ViewMode>('playerEdit');
  const [isTournamentStarted, setIsTournamentStarted] = useState(false);
  const [roundsHistory, setRoundsHistory] = useState<Pairing[][]>([]);
  const [, setSelectedRound] = useState(-1);
  

  useEffect(() => {
    const newTeams = Array.from({ length: tournamentParams.teamCount }, (_, i) => ({
      id: i + 1,
      name: `Команда ${i + 1}`,
      points: 0
    }));
    
    if (!isTournamentStarted) {
      const newPlayers = Array.from({ length: tournamentParams.playerCount }, (_, i) => ({
        id: i + 1,
        name: `Игрок ${i + 1}`,
        surname: `Фамилия ${i + 1}`,
        rating: 0, // 1500 + Math.floor(Math.random() * 500),
        teamId: (i % tournamentParams.teamCount) + 1,
        points: 0,
        ratingChange: 0,
        opponents: [],
        colorPreference: 0
      }));
      setPlayers(newPlayers);
    }
    
    setTeams(newTeams);
  }, [tournamentParams, isTournamentStarted]);
  
  const generatePairings = () => {
    if (currentRound >= tournamentParams.rounds) return;

    const allPlayers = [...players].sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      return b.rating - a.rating;
    });

    const groups = groupByPoints(allPlayers);
    const usedPlayers = new Set<number>();
    const newPairings: Pairing[] = [];
    let board = 1;

    groups.forEach(group => {
      const availablePlayers = group.filter(p => !usedPlayers.has(p.id));
      
      while (availablePlayers.length > 0) {
        const player1 = availablePlayers.shift()!;
        if (usedPlayers.has(player1.id)) continue;

        let bestMatch: Player | null = null;
        let bestScore = -Infinity;

        for (let j = 0; j < availablePlayers.length; j++) {
          const player2 = availablePlayers[j];
          
          if (player1.teamId !== player2.teamId &&
              player1.opponents.filter(id => id === player2.id).length <= tournamentParams.maxRepeatMatches) {
            const score = calculatePairScore(player1, player2);
            if (score > bestScore) {
              bestScore = score;
              bestMatch = player2;
            }
          }
        }

        if (bestMatch) {
          const player2Index = availablePlayers.findIndex(p => p.id === bestMatch!.id);
          availablePlayers.splice(player2Index, 1);
          
          const [white, black] = player1.colorPreference <= bestMatch.colorPreference 
            ? [player1, bestMatch] 
            : [bestMatch, player1];

          newPairings.push({ board: board++, white, black, result: { result: '-' } });

          white.colorPreference++;
          black.colorPreference--;
          usedPlayers.add(player1.id);
          usedPlayers.add(bestMatch.id);
        } else {
          setPlayers(prev => prev.map(p => 
            p.id === player1.id ? { ...p, points: p.points + 1 } : p
          ));
          usedPlayers.add(player1.id);
        }
      }
    });

    setPairings(newPairings);
    if (currentRound === 0) setIsTournamentStarted(true);
    setViewMode('pairings');
  };

  const handleResultChange = (board: number, result: string) => {
    setPairings(prev => prev.map(p => 
      p.board === board ? { ...p, result: { result } } : p
    ));
  };

  const handlePlayerChange = (id: number, field: keyof Player, value: any) => {
    setPlayers(prev => prev.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const calculateResults = () => {
    const updatedPlayers = players.map(player => {
      const playerPairings = pairings.filter(p => 
        p.white.id === player.id || p.black.id === player.id
      );

      let points = player.points;
      let delta = 0;
      const opponents = [...player.opponents];

      playerPairings.forEach(pairing => {
        const opponentId = pairing.white.id === player.id ? pairing.black.id : pairing.white.id;
        opponents.push(opponentId);

        if (pairing.result.result === '1-0' && pairing.white.id === player.id) {
          points += 1;
          delta += 10;
        } else if (pairing.result.result === '0-1' && pairing.black.id === player.id) {
          points += 1;
          delta += 10;
        } else if (pairing.result.result === '½-½') {
          points += 0.5;
          delta += 5;
        }
      });

      return { 
        ...player, 
        rating: player.rating + delta,
        points,
        ratingChange: player.ratingChange + delta,
        opponents 
      };
    });

    const updatedTeams = teams.map(team => {
      const teamPlayers = updatedPlayers
        .filter(p => p.teamId === team.id)
        .sort((a, b) => b.points - a.points)
        .slice(0, tournamentParams.countedMembers);

      return { ...team, points: teamPlayers.reduce((sum, p) => sum + p.points, 0) };
    });

    setPlayers(updatedPlayers);
    setTeams(updatedTeams);
    setCurrentRound(prev => prev + 1);
  };

  const nextRound = () => {
    setRoundsHistory(prev => [...prev, pairings]);
    calculateResults();
    if (currentRound < tournamentParams.rounds - 1) generatePairings();
  };

  useEffect(() => {
    if (roundsHistory.length > 0) setSelectedRound(roundsHistory.length - 1);
  }, [roundsHistory]);

  return (
    <div className="pairings-container">
      <h1>Лично-командные шахматные соревнования</h1>
        <img src={logo} alt="логотип" className="image1" />
        <img src={logo} alt="логотип" className="image2" />
      
      <Controls
        isTournamentStarted={isTournamentStarted}
        currentRound={currentRound}
        totalRounds={tournamentParams.rounds}
        onGeneratePairings={generatePairings}
        onNextRound={nextRound}
      />

      {!isTournamentStarted && (
        <TournamentSettings 
          params={tournamentParams} 
          onParamsChange={setTournamentParams} 
        />
      )}

      <Routes>
        <Route path="/pairings" element={
          <PairingsTable
            pairings={pairings}
            currentRound={currentRound}
            totalRounds={tournamentParams.rounds}
            onResultChange={handleResultChange}
          />
        } />
        
        <Route path="/start-list" element={<StartList players={players} teams={teams} />} />
        
        <Route path="/alphabetical" element={<AlphabeticalView players={players} teams={teams} />} />
        
        <Route path="/final-standings" element={
          <>
            <StandingsTable players={players} teams={teams} />
            <TournamentStats 
              players={players}
              teams={teams}
              currentRound={currentRound}
              totalRounds={tournamentParams.rounds}
            />
          </>
        } />
        
        <Route path="/team-results" element={
          <TeamResultsTable 
            teams={teams} 
            players={players}
            params={tournamentParams}
          />
        } />
        
        <Route path="/round-history" element={
          <RoundHistory 
            roundsHistory={roundsHistory} 
            currentRound={currentRound} 
          />
        } />
        
        <Route path="/player-edit" element={
          <PlayerEditor
            players={players}
            teams={teams}
            onPlayerChange={handlePlayerChange}
          />
        } />
        
        <Route path="/" element={<Navigate to="/player-edit" replace />} />
      </Routes>
    </div>
  );
};

export default App;