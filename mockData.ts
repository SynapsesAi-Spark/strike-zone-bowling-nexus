
import { GameType, Frame } from './types';

export interface GameRecord {
  id: string;
  score: number;
  type: GameType;
  category: 'Casual' | 'League' | 'Tournament' | 'Practice';
  date: string;
  timestamp: number;
  location: string;
  strikes: number;
  spares: number;
  frames: Frame[];
}

export interface Achievement {
  id: string;
  title: string;
  desc: string;
  date: string | null;
  icon: string;
  earned: boolean;
  gameId?: string; // Links to a specific milestone game
}

// Helper to generate mock frames for a given score
const generateMockFrames = (targetScore: number, type: GameType): Frame[] => {
  return Array(10).fill(null).map((_, i) => ({
    balls: type === '5-pin' ? [3, 2, null] : [7, '/', null],
    score: Math.floor(targetScore / 10),
    cumulativeScore: Math.floor((targetScore / 10) * (i + 1))
  }));
};

export const MOCK_GAMES: GameRecord[] = [
  { id: '20', score: 180, type: '10-pin', category: 'Casual', date: 'Jan 04, 2026', timestamp: 1736000000000, location: 'Splitsville Entertainment', strikes: 4, spares: 5, frames: generateMockFrames(180, '10-pin') },
  { id: '19', score: 175, type: '5-pin', category: 'Practice', date: 'Jan 02, 2026', timestamp: 1735820000000, location: 'Bowlerama Barrie', strikes: 3, spares: 6, frames: generateMockFrames(175, '5-pin') },
  { id: '18', score: 213, type: '10-pin', category: 'League', date: 'Dec 30, 2025', timestamp: 1735580000000, location: 'Splitsville Entertainment', strikes: 7, spares: 2, frames: generateMockFrames(213, '10-pin') },
  { id: '17', score: 198, type: '10-pin', category: 'League', date: 'Dec 29, 2025', timestamp: 1735490000000, location: 'Splitsville Entertainment', strikes: 6, spares: 3, frames: generateMockFrames(198, '10-pin') },
  { id: '16', score: 187, type: '5-pin', category: 'League', date: 'Dec 28, 2025', timestamp: 1735400000000, location: 'Playdium Mississauga', strikes: 5, spares: 4, frames: generateMockFrames(187, '5-pin') },
  { id: '15', score: 268, type: '10-pin', category: 'Tournament', date: 'Dec 27, 2025', timestamp: 1735310000000, location: 'Splitsville Entertainment', strikes: 9, spares: 1, frames: generateMockFrames(268, '10-pin') },
  { id: '14', score: 150, type: '5-pin', category: 'Casual', date: 'Dec 24, 2025', timestamp: 1735050000000, location: 'Bowlerama Barrie', strikes: 2, spares: 5, frames: generateMockFrames(150, '5-pin') },
  { id: '13', score: 165, type: '10-pin', category: 'Practice', date: 'Dec 23, 2025', timestamp: 1734960000000, location: 'Splitsville Entertainment', strikes: 4, spares: 4, frames: generateMockFrames(165, '10-pin') },
  { id: '12', score: 210, type: '10-pin', category: 'Tournament', date: 'Dec 21, 2025', timestamp: 1734790000000, location: 'Playdium Mississauga', strikes: 6, spares: 4, frames: generateMockFrames(210, '10-pin') },
  { id: '11', score: 195, type: '5-pin', category: 'League', date: 'Dec 19, 2025', timestamp: 1734620000000, location: 'Bowlerama Barrie', strikes: 6, spares: 3, frames: generateMockFrames(195, '5-pin') },
  { id: '10', score: 172, type: '10-pin', category: 'Casual', date: 'Dec 17, 2025', timestamp: 1734450000000, location: 'Splitsville Entertainment', strikes: 5, spares: 3, frames: generateMockFrames(172, '10-pin') },
  { id: '09', score: 140, type: '5-pin', category: 'Practice', date: 'Dec 16, 2025', timestamp: 1734360000000, location: 'Playdium Mississauga', strikes: 2, spares: 4, frames: generateMockFrames(140, '5-pin') },
  { id: '08', score: 189, type: '10-pin', category: 'League', date: 'Dec 14, 2025', timestamp: 1734190000000, location: 'Splitsville Entertainment', strikes: 6, spares: 2, frames: generateMockFrames(189, '10-pin') },
  { id: '07', score: 155, type: '10-pin', category: 'Practice', date: 'Dec 12, 2025', timestamp: 1734010000000, location: 'Playdium Mississauga', strikes: 3, spares: 5, frames: generateMockFrames(155, '10-pin') },
  { id: '06', score: 160, type: '5-pin', category: 'League', date: 'Dec 10, 2025', timestamp: 1733840000000, location: 'Bowlerama Barrie', strikes: 4, spares: 4, frames: generateMockFrames(160, '5-pin') },
  { id: '05', score: 145, type: '10-pin', category: 'Casual', date: 'Dec 08, 2025', timestamp: 1733670000000, location: 'Splitsville Entertainment', strikes: 3, spares: 4, frames: generateMockFrames(145, '10-pin') },
  { id: '04', score: 130, type: '5-pin', category: 'Practice', date: 'Dec 05, 2025', timestamp: 1733410000000, location: 'Splitsville Entertainment', strikes: 1, spares: 3, frames: generateMockFrames(130, '5-pin') },
  { id: '03', score: 155, type: '10-pin', category: 'League', date: 'Dec 03, 2025', timestamp: 1733240000000, location: 'Bowlerama Barrie', strikes: 4, spares: 3, frames: generateMockFrames(155, '10-pin') },
  { id: '02', score: 142, type: '5-pin', category: 'Casual', date: 'Dec 01, 2025', timestamp: 1733070000000, location: 'Playdium Mississauga', strikes: 2, spares: 5, frames: generateMockFrames(142, '5-pin') },
  { id: '01', score: 128, type: '10-pin', category: 'Practice', date: 'Nov 29, 2025', timestamp: 1732900000000, location: 'Splitsville Entertainment', strikes: 2, spares: 4, frames: generateMockFrames(128, '10-pin') }
];

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  { id: 'a1', title: '100 Game', desc: 'Score 100+ points in any game', date: 'Nov 29/25', earned: true, icon: '🎯', gameId: '01' },
  { id: 'a2', title: '200 Game', desc: 'Score 200+ points in any game', date: 'Dec 21/25', earned: true, icon: '🔥', gameId: '12' },
  { id: 'a3', title: '250 Game', desc: 'Score 250+ points in any game', date: 'Dec 27/25', earned: true, icon: '⭐', gameId: '15' },
  { id: 'a4', title: 'Turkey', desc: 'Throw 3 strikes in a row', date: 'Dec 29/25', earned: true, icon: '🎳', gameId: '17' },
  { id: 'a5', title: 'Clean Game', desc: 'Complete a game with no open frames', date: 'Jan 02/26', earned: true, icon: '🧼', gameId: '19' },
  { id: 'a6', title: 'King of 5-Pin', desc: 'Average 180+ over 5 games of 5-Pin', date: 'Jan 04/26', earned: true, icon: '👑', gameId: '20' },
  { id: 'a7', title: '300 Game', desc: 'Score a perfect 300 game', date: null, earned: false, icon: '💎' },
  { id: 'a8', title: 'Hambone', desc: 'Throw 4 strikes in a row', date: null, earned: false, icon: '🥓' }
];
