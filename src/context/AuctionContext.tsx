
import React, { createContext, useContext, useReducer, useState, useEffect } from 'react';
import { 
  Player, 
  Team, 
  AuctionState, 
  AuctionHistoryItem, 
  Bid 
} from '../types/auction';
import { mockPlayers, mockTeams, mockAuctionHistory } from '../data/mockData';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';

// Define context types
type AuctionContextType = {
  players: Player[];
  teams: Team[];
  auctionState: AuctionState;
  currentPlayer: Player | null;
  startAuction: (playerId: string) => void;
  placeBid: (teamId: string) => void;
  sellPlayer: () => void;
  markAsUnsold: () => void;
  nextPlayer: () => void;
  undoLastAction: () => void;
  resetAuction: () => void;
};

// Create context
const AuctionContext = createContext<AuctionContextType | undefined>(undefined);

// Define actions for reducer
type AuctionAction = 
  | { type: 'START_AUCTION'; payload: { playerId: string } }
  | { type: 'PLACE_BID'; payload: { teamId: string; bidAmount: number } }
  | { type: 'SELL_PLAYER'; payload: { teamId: string; amount: number; playerId: string } }
  | { type: 'MARK_UNSOLD'; payload: { playerId: string } }
  | { type: 'NEXT_PLAYER' }
  | { type: 'UNDO_LAST_ACTION' }
  | { type: 'RESET_AUCTION' }
  | { type: 'UPDATE_HISTORY'; payload: { history: AuctionHistoryItem[] } };

// Initial state
const initialAuctionState: AuctionState = {
  currentPlayerId: null,
  currentBidAmount: 0,
  currentBidTeamId: null,
  isAuctionInProgress: false,
  history: [...mockAuctionHistory],
};

// Reducer function
const auctionReducer = (state: AuctionState, action: AuctionAction): AuctionState => {
  switch (action.type) {
    case 'START_AUCTION':
      return {
        ...state,
        currentPlayerId: action.payload.playerId,
        currentBidAmount: 0,
        currentBidTeamId: null,
        isAuctionInProgress: true,
      };
    case 'PLACE_BID':
      const newBidHistory: AuctionHistoryItem = {
        id: uuidv4(),
        playerId: state.currentPlayerId!,
        playerName: '', // Will be filled in by the effect
        action: 'bid',
        teamId: action.payload.teamId,
        teamName: '', // Will be filled in by the effect
        amount: action.payload.bidAmount,
        timestamp: new Date(),
      };
      return {
        ...state,
        currentBidAmount: action.payload.bidAmount,
        currentBidTeamId: action.payload.teamId,
        history: [newBidHistory, ...state.history],
      };
    case 'SELL_PLAYER':
      const sellHistory: AuctionHistoryItem = {
        id: uuidv4(),
        playerId: action.payload.playerId,
        playerName: '', // Will be filled in by the effect
        action: 'sold',
        teamId: action.payload.teamId,
        teamName: '', // Will be filled in by the effect
        amount: action.payload.amount,
        timestamp: new Date(),
      };
      return {
        ...state,
        isAuctionInProgress: false,
        history: [sellHistory, ...state.history],
      };
    case 'MARK_UNSOLD':
      const unsoldHistory: AuctionHistoryItem = {
        id: uuidv4(),
        playerId: action.payload.playerId,
        playerName: '', // Will be filled in by the effect
        action: 'unsold',
        timestamp: new Date(),
      };
      return {
        ...state,
        isAuctionInProgress: false,
        history: [unsoldHistory, ...state.history],
      };
    case 'NEXT_PLAYER':
      return {
        ...state,
        currentPlayerId: null,
        currentBidAmount: 0,
        currentBidTeamId: null,
        isAuctionInProgress: false,
      };
    case 'UNDO_LAST_ACTION':
      // Remove the last history item
      const newHistory = [...state.history];
      if (newHistory.length > 0) {
        newHistory.shift();
      }
      return {
        ...state,
        history: newHistory,
      };
    case 'UPDATE_HISTORY':
      return {
        ...state,
        history: action.payload.history
      };
    case 'RESET_AUCTION':
      return initialAuctionState;
    default:
      return state;
  }
};

// Create the provider
export function AuctionProvider({ children }: { children: React.ReactNode }) {
  const [players, setPlayers] = useState<Player[]>(mockPlayers);
  const [teams, setTeams] = useState<Team[]>(mockTeams);
  const [auctionState, dispatch] = useReducer(auctionReducer, initialAuctionState);
  const { toast } = useToast();

  // Find the current player based on the auction state
  const currentPlayer = auctionState.currentPlayerId
    ? players.find(player => player.id === auctionState.currentPlayerId) || null
    : null;

  // Fill in missing data in auction history items
  useEffect(() => {
    if (auctionState.history.length === 0) return;
    
    // Get the most recent history item
    const latestHistoryItem = auctionState.history[0];
    
    // Only process if the names are empty
    if (!latestHistoryItem.playerName || 
        (latestHistoryItem.teamId && !latestHistoryItem.teamName)) {
      
      // Find the player name
      const player = players.find(p => p.id === latestHistoryItem.playerId);
      const playerName = player ? player.name : 'Unknown Player';
      
      // Find the team name if applicable
      let teamName = '';
      if (latestHistoryItem.teamId) {
        const team = teams.find(t => t.id === latestHistoryItem.teamId);
        teamName = team ? team.name : 'Unknown Team';
      }
      
      // Update the history item with the names
      const updatedHistory = auctionState.history.map((item, index) => {
        if (index === 0) {
          return {
            ...item,
            playerName,
            teamName: teamName || item.teamName
          };
        }
        return item;
      });
      
      // Update the state with the complete history
      dispatch({
        type: 'UPDATE_HISTORY',
        payload: { history: updatedHistory }
      });
    }
  }, [auctionState.history, players, teams]);

  // Start the auction for a player
  const startAuction = (playerId: string) => {
    const player = players.find(p => p.id === playerId);
    if (!player) return;
    
    dispatch({ type: 'START_AUCTION', payload: { playerId } });
    toast({
      title: "Auction Started",
      description: `${player.name} is now up for auction at a base price of ₹${player.basePrice}`,
    });
  };

  // Place a bid
  const placeBid = (teamId: string) => {
    if (!auctionState.isAuctionInProgress || !currentPlayer) return;
    
    const team = teams.find(t => t.id === teamId);
    if (!team) return;
    
    // Calculate the new bid amount
    const bidIncrement = 500;
    const newBidAmount = auctionState.currentBidAmount === 0
      ? currentPlayer.basePrice
      : auctionState.currentBidAmount + bidIncrement;
    
    // Validate the team can afford the bid
    if (team.remainingPurse < newBidAmount) {
      toast({
        title: "Insufficient Funds",
        description: `${team.name} doesn't have enough funds to place this bid.`,
        variant: "destructive",
      });
      return;
    }
    
    // Update the state
    dispatch({
      type: 'PLACE_BID',
      payload: { teamId, bidAmount: newBidAmount }
    });
    
    toast({
      title: "New Bid",
      description: `${team.name} bids ₹${newBidAmount} for ${currentPlayer.name}`,
    });
  };

  // Sell a player to the highest bidder
  const sellPlayer = () => {
    if (!auctionState.isAuctionInProgress || !currentPlayer || !auctionState.currentBidTeamId) {
      toast({
        title: "Cannot Sell Player",
        description: "There must be an active bid to sell a player.",
        variant: "destructive",
      });
      return;
    }
    
    const team = teams.find(t => t.id === auctionState.currentBidTeamId);
    if (!team) return;
    
    // Update team's purse and player list
    const updatedTeams = teams.map(t => {
      if (t.id === team.id) {
        return {
          ...t,
          remainingPurse: t.remainingPurse - auctionState.currentBidAmount,
          players: [...t.players, {...currentPlayer, sold: true, soldTo: t.id, soldAmount: auctionState.currentBidAmount}]
        };
      }
      return t;
    });
    
    // Update player status
    const updatedPlayers = players.map(p => {
      if (p.id === currentPlayer.id) {
        return {
          ...p,
          sold: true,
          soldTo: team.id,
          soldAmount: auctionState.currentBidAmount
        };
      }
      return p;
    });
    
    // Update state
    setTeams(updatedTeams);
    setPlayers(updatedPlayers);
    
    dispatch({
      type: 'SELL_PLAYER',
      payload: {
        teamId: team.id,
        amount: auctionState.currentBidAmount,
        playerId: currentPlayer.id
      }
    });
    
    toast({
      title: "Player Sold",
      description: `${currentPlayer.name} sold to ${team.name} for ₹${auctionState.currentBidAmount}`,
    });
  };

  // Mark a player as unsold
  const markAsUnsold = () => {
    if (!auctionState.isAuctionInProgress || !currentPlayer) return;
    
    // Update player status
    const updatedPlayers = players.map(p => {
      if (p.id === currentPlayer.id) {
        return {
          ...p,
          sold: false
        };
      }
      return p;
    });
    
    setPlayers(updatedPlayers);
    
    dispatch({
      type: 'MARK_UNSOLD',
      payload: { playerId: currentPlayer.id }
    });
    
    toast({
      title: "Player Unsold",
      description: `${currentPlayer.name} has been marked as unsold`,
    });
  };

  // Move to next player
  const nextPlayer = () => {
    if (auctionState.isAuctionInProgress) {
      toast({
        title: "Finish Current Auction",
        description: "Please complete or cancel the current player auction first.",
        variant: "destructive",
      });
      return;
    }
    
    dispatch({ type: 'NEXT_PLAYER' });
    
    toast({
      title: "Ready for Next Player",
      description: "Select the next player to auction",
    });
  };

  // Undo the last action
  const undoLastAction = () => {
    if (auctionState.history.length === 0) {
      toast({
        title: "Nothing to Undo",
        description: "There are no recent actions to undo.",
        variant: "destructive",
      });
      return;
    }
    
    const lastAction = auctionState.history[0];
    
    // Handle different types of actions
    if (lastAction.action === 'sold') {
      // Undo a player sale
      const teamId = lastAction.teamId;
      const playerId = lastAction.playerId;
      const amount = lastAction.amount || 0;
      
      // Restore team's purse and remove player
      const updatedTeams = teams.map(t => {
        if (t.id === teamId) {
          return {
            ...t,
            remainingPurse: t.remainingPurse + amount,
            players: t.players.filter(p => p.id !== playerId)
          };
        }
        return t;
      });
      
      // Restore player status
      const updatedPlayers = players.map(p => {
        if (p.id === playerId) {
          return {
            ...p,
            sold: false,
            soldTo: undefined,
            soldAmount: undefined
          };
        }
        return p;
      });
      
      setTeams(updatedTeams);
      setPlayers(updatedPlayers);
    } else if (lastAction.action === 'unsold') {
      // Undo marking a player as unsold (nothing needs to be done for the player state)
    }
    
    // Update the auction state
    dispatch({ type: 'UNDO_LAST_ACTION' });
    
    toast({
      title: "Action Undone",
      description: "The last action has been reversed.",
    });
  };

  // Reset the auction
  const resetAuction = () => {
    setPlayers(mockPlayers);
    setTeams(mockTeams);
    dispatch({ type: 'RESET_AUCTION' });
    
    toast({
      title: "Auction Reset",
      description: "The auction has been completely reset.",
    });
  };

  // Fill in missing data in auction history items
  useEffect(() => {
    // This would be a more efficient approach in a real application
    // but for this demo, we'll keep it simple
  }, [auctionState.history]);

  const value = {
    players,
    teams,
    auctionState,
    currentPlayer,
    startAuction,
    placeBid,
    sellPlayer,
    markAsUnsold,
    nextPlayer,
    undoLastAction,
    resetAuction,
  };

  return <AuctionContext.Provider value={value}>{children}</AuctionContext.Provider>;
}

// Create a hook to use the auction context
export const useAuction = () => {
  const context = useContext(AuctionContext);
  if (context === undefined) {
    throw new Error('useAuction must be used within an AuctionProvider');
  }
  return context;
};
