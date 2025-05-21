import { ColumnDef } from "@tanstack/react-table";

export interface Player {
  id: number;
  name: string;
  surname: string;
  rating: number;
  teamId: number;
  points: number;
  ratingChange: number;
  opponents: number[];
  colorPreference: number;
}

export interface Team {
  id: number;
  name: string;
  points: number;
}

export interface TournamentParams {
  playerCount: number;
  teamCount: number;
  rounds: number;
  countedMembers: number;
  maxRepeatMatches: number;
}

export interface Pairing {
  board: number;
  white: Player;
  black: Player;
  result: GameResult;
}

export interface GameResult {
  result: string;
}
// Добавляем экспорт TableProps
export interface TableProps {
  data: any[];
  columns: ColumnDef<any>[];
}
export type ViewMode = 'pairings' | 'startList' | 'alphabetical' | 'finalStandings' | 'teamResults' | 'playerEdit' | 'roundHistory';