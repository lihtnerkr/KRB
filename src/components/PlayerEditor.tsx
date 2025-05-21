import { ColumnDef } from '@tanstack/react-table';
import { TableComponent } from './TableComponent';
import { Player, Team } from '../utils/types';
import { useMemo } from 'react';

interface Props {
  players: Player[];
  teams: Team[];
  onPlayerChange: (id: number, field: keyof Player, value: any) => void;
}

export const PlayerEditor = ({ players, teams, onPlayerChange }: Props) => {
  const columns = useMemo<ColumnDef<Player>[]>(() => [
    { header: '№', accessorFn: (_, i) => i + 1 },
    { 
      header: 'Имя', 
      accessorKey: 'name',
      cell: ({ row }) => (
        <input
          value={row.original.name}
          onChange={(e) => onPlayerChange(row.original.id, 'name', e.target.value)}
          
        />
      )
    },
    { 
      header: 'Фамилия', 
      accessorKey: 'surname',
      cell: ({ row }) => (
        <input
          value={row.original.surname}
          onChange={(e) => onPlayerChange(row.original.id, 'surname', e.target.value)}
          
        />
      )
    },
    { 
      header: 'Рейтинг', 
      accessorKey: 'rating',
      cell: ({ row }) => (
        <input
          type="number"
          value={row.original.rating}
          onChange={(e) => onPlayerChange(row.original.id, 'rating', parseInt(e.target.value))}
          
        />
      )
    },
    { 
      header: 'Команда', 
      accessorKey: 'teamId',
      cell: ({ row }) => (
        <select
          value={row.original.teamId}
          onChange={(e) => onPlayerChange(row.original.id, 'teamId', parseInt(e.target.value))}
          
        >
          {teams.map(team => (
            <option key={team.id} value={team.id}>{team.name}</option>
          ))}
        </select>
      )
    }
  ], [teams]);

  return <TableComponent data={players} columns={columns} />;
};