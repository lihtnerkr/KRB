import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { TableComponent } from './TableComponent';
import { Player, Team } from '../utils/types';

interface Props {
  players: Player[];
  teams: Team[];
}

export const StandingsTable = ({ players, teams }: Props) => {
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
    },
    { header: 'Очки', accessorKey: 'points' },
    { header: 'Изменение рейтинга', accessorKey: 'ratingChange' }
  ], [teams]);

  const data = useMemo(() => 
    [...players].sort((a, b) => b.points - a.points || b.rating - a.rating), 
    [players]
  );

  return <TableComponent data={data} columns={columns} />;
};