import { TournamentParams } from '../utils/types';

interface Props {
  params: TournamentParams;
  onParamsChange: (params: TournamentParams) => void;
}

const getLabel = (key: string): string => {
  const labels: Record<string, string> = {
    playerCount: 'Количество игроков',
    teamCount: 'Количество команд',
    rounds: 'Количество туров',
    countedMembers: 'Учитываемых игроков в команде',
    maxRepeatMatches: 'Макс. повторных встреч'
  };
  return labels[key] || key;
};

const getMinValue = (key: string): number => {
  const mins: Record<string, number> = {
    playerCount: 2,
    teamCount: 2,
    rounds: 1,
    countedMembers: 1,
    maxRepeatMatches: 0
  };
  return mins[key] || 0;
};

export const TournamentSettings = ({ params, onParamsChange }: Props) => (
    <div className="tournament-settings">
      <h3>Настройки турнира</h3>
      <div>
        {Object.entries(params).map(([key, value]) => (
          <div key={key}>
            <label>{getLabel(key)}:</label>
            <input
              type="number"
              min={getMinValue(key)}
              value={value}
              onChange={(e) => {
                const newValue = Math.max(
                  getMinValue(key), 
                  Number(e.target.value) || getMinValue(key) 
                );
                onParamsChange({ ...params, [key]: newValue });
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );