import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { TableComponent } from './TableComponent';
import { Pairing } from '../utils/types'; 

interface PairingsTableProps {
  pairings: Pairing[];
  onResultChange: (board: number, result: string) => void;
}

export const PairingsTable = ({ pairings, onResultChange }: PairingsTableProps) => {
    const columns = useMemo<ColumnDef<Pairing>[]>(() => [
      { header: 'Доска', accessorKey: 'board' },
      { 
        header: 'Белые', 
        accessorFn: (row) => `${row.white.surname} ${row.white.name} (${row.white.points})`
      },
      { 
        header: 'Черные', 
        accessorFn: (row) => `${row.black.surname} ${row.black.name} (${row.black.points})`
      },
      {
        header: 'Результат',
        accessorKey: 'result.result',
        cell: ({ row }) => (
          <select 
            value={row.original.result.result}
            onChange={(e) => onResultChange(row.original.board, e.target.value)}
          >
            <option value="-">-</option>
            <option value="1-0">1-0</option>
            <option value="0-1">0-1</option>
            <option value="½-½">½-½</option>
          </select>
        )
      }
    ], [onResultChange]);
  
    return <TableComponent data={pairings} columns={columns} />;
  };