import { ColumnDef } from '@tanstack/react-table';
import { TableComponent } from './TableComponent';
import { Player, Team } from '../utils/types';
import { useMemo } from 'react';

interface Props {
  players: Player[];
  teams: Team[];
}

export const AlphabeticalView = ({ players, teams }: Props) => {
  const sortedPlayers = useMemo(() => 
    [...players].sort((a, b) => 
      a.surname.localeCompare(b.surname) || a.name.localeCompare(b.name)
    ), [players]);

  const columns = useMemo<ColumnDef<Player>[]>(() => [
    { header: '№', accessorFn: (_, i) => i + 1 },
    { header: 'Фамилия', accessorKey: 'surname' },
    { header: 'Имя', accessorKey: 'name' },
    { header: 'Рейтинг', accessorKey: 'rating' },
    { 
      header: 'Команда', 
      accessorKey: 'teamId',
      cell: ({ row }) => teams.find(t => t.id === row.original.teamId)?.name || 'Неизвестно'
    }
  ], [teams]);

  return <TableComponent data={sortedPlayers} columns={columns} />;
};