import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { TableComponent } from './TableComponent';
import { Team, Player, TournamentParams } from '../utils/types';

interface Props {
  teams: Team[];
  players: Player[];
  params?: TournamentParams;
}

export const TeamResultsTable = ({ teams, players, params }: Props) => {
  const columns = useMemo<ColumnDef<Team>[]>(() => [
    { header: '№', accessorFn: (_, i) => i + 1 },
    { header: 'Команда', accessorKey: 'name' },
    { header: 'Очки', accessorKey: 'points' },
    { 
      header: 'Учитываемые игроки', 
      accessorFn: (row) => {
        const teamPlayers = players
          .filter(p => p.teamId === row.id)
          .sort((a, b) => b.points - a.points)
          .slice(0, params?.countedMembers || 4);
        return teamPlayers.map(p => `${p.surname} ${p.name} (${p.points})`).join(', ');
      }
    }
  ], [players, params]);

  const data = useMemo(() => 
    [...teams].sort((a, b) => b.points - a.points), 
    [teams]
  );

  return <TableComponent data={data} columns={columns} />;
};