
export type PlayerPosition = 'Batsman' | 'Bowler' | 'All-Rounder' | 'Wicket-Keeper' | 'Captain';

export type Player = {
  id: string;
  name: string;
  imageUrl: string;
  basePrice: number;
  position: PlayerPosition;
  skills: string[];
  stats: {
    battingAverage?: number;
    bowlingAverage?: number;
    matchesPlayed?: number;
    runsScored?: number;
    wicketsTaken?: number;
  };
  sold: boolean;
  soldTo?: string;
  soldAmount?: number;
};

export type Team = {
  id: string;
  name: string;
  logoUrl: string;
  color: string;
  initialPurse: number;
  remainingPurse: number;
  players: Player[];
};

export type Bid = {
  id: string;
  playerId: string;
  teamId: string;
  amount: number;
  timestamp: Date;
};

export type AuctionHistoryItem = {
  id: string;
  playerId: string;
  playerName: string;
  action: 'sold' | 'unsold' | 'bid';
  teamId?: string;
  teamName?: string;
  amount?: number;
  timestamp: Date;
};

export type AuctionState = {
  currentPlayerId: string | null;
  currentBidAmount: number;
  currentBidTeamId: string | null;
  isAuctionInProgress: boolean;
  history: AuctionHistoryItem[];
};
