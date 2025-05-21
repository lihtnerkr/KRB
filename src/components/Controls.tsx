import { Link } from 'react-router-dom';

interface ControlsProps {
  isTournamentStarted: boolean;
  currentRound: number;
  totalRounds: number;
  onGeneratePairings: () => void;
  onNextRound: () => void;
}

export const Controls = ({ 
  isTournamentStarted, 
  currentRound, 
  totalRounds, 
  onGeneratePairings, 
  onNextRound 
}: ControlsProps) => {
  return (
    <div className="controls">
      <nav className="navigation">
        <Link to="/player-edit" className="nav-link">Редактор игроков</Link>
        <Link to="/start-list" className="nav-link">Стартовый список</Link>
        <Link to="/alphabetical" className="nav-link">Алфавитный список</Link>
        
        {isTournamentStarted && (
          <>
            <Link to="/pairings" className="nav-link">Текущий тур</Link>
            <Link to="/final-standings" className="nav-link">Итоговые результаты</Link>
            <Link to="/team-results" className="nav-link">Командные результаты</Link>
            <Link to="/round-history" className="nav-link">История туров</Link>
          </>
        )}
      </nav>
      
      <div className="round-controls">
        {!isTournamentStarted ? (
          <button onClick={onGeneratePairings} className="control-button">
            Начать турнир
          </button>
        ) : (
          currentRound < totalRounds && (
            <button onClick={onNextRound} className="control-button">
              Следующий тур ({currentRound + 1}/{totalRounds})
            </button>
          )
        )}
      </div>
    </div>
  );
};