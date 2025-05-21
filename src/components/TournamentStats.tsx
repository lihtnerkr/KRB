import { useMemo } from 'react';
import { Player, Team } from '../utils/types';

interface Props {
  players: Player[];
  teams: Team[];
  currentRound: number;
  totalRounds: number;
}

export const TournamentStats = ({ players, teams, currentRound, totalRounds }: Props) => {
  const tournamentLeader = useMemo(() => {
    const [leader] = [...players].sort((a, b) => b.points - a.points);
    return leader;
  }, [players]);

  const bestTeam = useMemo(() => {
    const [team] = [...teams].sort((a, b) => b.points - a.points);
    return team;
  }, [teams]);

  const playersCount = players.length;
  const teamsCount = teams.length;

  return (
    <div className="tournament-stats">
      <h3 className="stats-title">Статистика турнира</h3>
      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-label">Участников:</span>
          <span className="stat-value">{playersCount}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Команд:</span>
          <span className="stat-value">{teamsCount}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Сыграно туров:</span>
          <span className="stat-value">
            {currentRound} из {totalRounds}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Лидер:</span>
          <span className="stat-value">
            {tournamentLeader 
              ? `${tournamentLeader.surname} ${tournamentLeader.name} (${tournamentLeader.points} очков)`
              : 'Нет данных'}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Лучшая команда:</span>
          <span className="stat-value">
            {bestTeam 
              ? `${bestTeam.name} (${bestTeam.points} очков)`
              : 'Нет данных'}
          </span>
        </div>
      </div>
    </div>
  );
};