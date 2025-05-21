import { Player, TournamentParams } from './types';

export const groupByPoints = (players: Player[]): Player[][] => {
  const groups = new Map<number, Player[]>();
  players.forEach(player => {
    const group = groups.get(player.points) || [];
    group.push(player);
    groups.set(player.points, group);
  });
  return Array.from(groups.values())
    .map(group => group.sort((a, b) => b.rating - a.rating))
    .sort((a, b) => b[0].points - a[0].points);
};

export const calculatePairScore = (p1: Player, p2: Player): number => {
  const ratingDiff = Math.abs(p1.rating - p2.rating);
  const pointsDiff = Math.abs(p1.points - p2.points);
  const previousEncounters = p1.opponents.filter(id => id === p2.id).length;
  const colorBalance = Math.abs(p1.colorPreference - p2.colorPreference);
  
  return 1000 
    - ratingDiff * 10 
    - pointsDiff * 100 
    - previousEncounters * 500 
    - colorBalance * 50;
};

export const generateInitialPlayers = (params: TournamentParams): Player[] => {
  return Array.from({ length: params.playerCount }, (_, i) => ({
    id: i + 1,
    name: `Игрок ${i + 1}`, // Добавлен номер игрока
    surname: `Фамилия ${i + 1}`,
    rating: 1500 + Math.floor(Math.random() * 500),
    teamId: (i % params.teamCount) + 1,
    points: 0,
    ratingChange: 0,
    opponents: [],
    colorPreference: 0
  }));
};