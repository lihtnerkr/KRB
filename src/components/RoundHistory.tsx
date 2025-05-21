import { useMemo, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { TableComponent } from './TableComponent';
import { Pairing } from '../utils/types';

interface Props {
  roundsHistory: Pairing[][];
  currentRound: number;
}

export const RoundHistory = ({ roundsHistory, currentRound }: Props) => {
  const [selectedRound, setSelectedRound] = useState(roundsHistory.length - 1);

  const columns = useMemo<ColumnDef<Pairing>[]>(() => [
    { header: 'Доска', accessorKey: 'board' },
    { 
      header: 'Белые', 
      accessorFn: (row: Pairing) => `${row.white.surname} ${row.white.name} (${row.white.points})`
    },
    { 
      header: 'Черные', 
      accessorFn: (row: Pairing) => `${row.black.surname} ${row.black.name} (${row.black.points})`
    },
    { header: 'Результат', accessorKey: 'result.result' }
  ], []);

  return (
    <div>
      <div className="round-selector">
        <label>Выберите тур: </label>
        <select
          value={selectedRound}
          onChange={(e) => setSelectedRound(Number(e.target.value))}
          disabled={roundsHistory.length === 0}
        >
          {roundsHistory.map((_, index) => (
            <option key={index} value={index}>
              Тур {index + 1} {index === currentRound - 1 && "(текущий)"}
            </option>
          ))}
        </select>
      </div>
      
      <TableComponent 
        data={roundsHistory[selectedRound] || []} 
        columns={columns} 
      />
    </div>
  );
};