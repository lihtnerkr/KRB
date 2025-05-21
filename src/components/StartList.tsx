import { ColumnDef } from '@tanstack/react-table';
import { TableComponent } from './TableComponent';
import { Player, Team } from '../utils/types';
import { useMemo } from 'react';

interface Props {
  players: Player[];
  teams: Team[];
}

export const StartList = ({ players, teams }: Props) => {
  const columns = useMemo<ColumnDef<Player>[]>(() => [
    { header: '№', accessorFn: (_, i) => i + 1 },
    { 
      header: 'Игрок', 
      accessorKey: 'name',
      cell: ({ row }) => `${row.original.surname} ${row.original.name}`
    },
    { header: 'Рейтинг', accessorKey: 'rating' },
    { 
      header: 'Команда', 
      accessorKey: 'teamId',
      cell: ({ row }) => teams.find(t => t.id === row.original.teamId)?.name || 'Неизвестно'
    }
  ], [teams]);

  return <TableComponent data={players} columns={columns} />;
};
