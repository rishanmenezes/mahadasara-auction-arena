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
  addPlayer: (player: Player) => void;
  updatePlayer: (player: Player) => void;
  deletePlayer: (playerId: string) => void;
  addTeam: (team: Team) => void;
  updateTeam: (team: Team) => void;
  deleteTeam: (teamId: string) => void;
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
        currentPlayerId: null, // Reset current player after sale
        currentBidAmount: 0,    // Reset bid amount
        currentBidTeamId: null, // Reset team
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
        currentPlayerId: null, // Reset current player after marking unsold
        currentBidAmount: 0,    // Reset bid amount
        currentBidTeamId: null, // Reset team
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
      if (state.history.length === 0) {
        return state;
      }
      
      const newHistory = [...state.history];
      const lastAction = newHistory.shift();
      
      if (!lastAction) {
        return state;
      }
      
      if (lastAction.action === 'bid') {
        const previousBid = newHistory.find(item => 
          item.playerId === lastAction.playerId && item.action === 'bid'
        );
        
        if (previousBid) {
          return {
            ...state,
            currentBidAmount: previousBid.amount || 0,
            currentBidTeamId: previousBid.teamId || null,
            history: newHistory,
          };
        } else {
          return {
            ...state,
            currentBidAmount: 0,
            currentBidTeamId: null,
            history: newHistory,
          };
        }
      } else if (lastAction.action === 'sold' || lastAction.action === 'unsold') {
        return {
          ...state,
          currentPlayerId: lastAction.playerId,
          isAuctionInProgress: true,
          history: newHistory,
        };
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

  const currentPlayer = auctionState.currentPlayerId
    ? players.find(player => player.id === auctionState.currentPlayerId) || null
    : null;

  useEffect(() => {
    if (auctionState.history.length === 0) return;
    
    const latestHistoryItem = auctionState.history[0];
    
    if (!latestHistoryItem.playerName || 
        (latestHistoryItem.teamId && !latestHistoryItem.teamName)) {
      
      const player = players.find(p => p.id === latestHistoryItem.playerId);
      const playerName = player ? player.name : 'Unknown Player';
      
      let teamName = '';
      if (latestHistoryItem.teamId) {
        const team = teams.find(t => t.id === latestHistoryItem.teamId);
        teamName = team ? team.name : 'Unknown Team';
      }
      
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
      
      dispatch({
        type: 'UPDATE_HISTORY',
        payload: { history: updatedHistory }
      });
    }
  }, [auctionState.history, players, teams]);

  const startAuction = (playerId: string) => {
    const player = players.find(p => p.id === playerId);
    if (!player) return;
    
    if (player.sold) {
      toast({
        title: "Cannot Auction Player",
        description: `${player.name} has already been sold`,
        variant: "destructive",
      });
      return;
    }
    
    dispatch({ type: 'START_AUCTION', payload: { playerId } });
    toast({
      title: "Auction Started",
      description: `${player.name} is now up for auction at a base price of ₹${player.basePrice}`,
    });
  };

  const placeBid = (teamId: string) => {
    if (!auctionState.isAuctionInProgress || !currentPlayer) return;
    
    const team = teams.find(t => t.id === teamId);
    if (!team) return;
    
    const bidIncrement = 500;
    const newBidAmount = auctionState.currentBidAmount === 0
      ? currentPlayer.basePrice
      : auctionState.currentBidAmount + bidIncrement;
    
    if (auctionState.currentBidTeamId === teamId) {
      toast({
        title: "Already Highest Bidder",
        description: `${team.name} is already the highest bidder.`,
        variant: "destructive",
      });
      return;
    }
    
    if (team.remainingPurse < newBidAmount) {
      toast({
        title: "Insufficient Funds",
        description: `${team.name} doesn't have enough funds to place this bid.`,
        variant: "destructive",
      });
      return;
    }
    
    dispatch({
      type: 'PLACE_BID',
      payload: { teamId, bidAmount: newBidAmount }
    });
    
    toast({
      title: "New Bid",
      description: `${team.name} bids ₹${newBidAmount} for ${currentPlayer.name}`,
    });
  };

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

  const markAsUnsold = () => {
    if (!auctionState.isAuctionInProgress || !currentPlayer) return;
    
    const updatedPlayers = players.map(p => {
      if (p.id === currentPlayer.id) {
        return {
          ...p,
          sold: false,
          soldTo: undefined,
          soldAmount: undefined
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
    
    if (lastAction.action === 'sold') {
      const teamId = lastAction.teamId;
      const playerId = lastAction.playerId;
      const amount = lastAction.amount || 0;
      
      if (!teamId) return;
      
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
    }
    
    dispatch({ type: 'UNDO_LAST_ACTION' });
    
    toast({
      title: "Action Undone",
      description: "The last action has been reversed.",
    });
  };

  const resetAuction = () => {
    setPlayers(mockPlayers);
    setTeams(mockTeams);
    dispatch({ type: 'RESET_AUCTION' });
    
    toast({
      title: "Auction Reset",
      description: "The auction has been completely reset.",
    });
  };

  const addPlayer = (player: Player) => {
    setPlayers(prevPlayers => [...prevPlayers, player]);
  };

  const updatePlayer = (updatedPlayer: Player) => {
    if (auctionState.currentPlayerId === updatedPlayer.id && auctionState.isAuctionInProgress) {
      toast({
        title: "Cannot Update Player",
        description: "Cannot update a player during an active auction",
        variant: "destructive",
      });
      return;
    }
    
    setPlayers(prevPlayers => 
      prevPlayers.map(player => 
        player.id === updatedPlayer.id ? updatedPlayer : player
      )
    );

    if (updatedPlayer.sold && updatedPlayer.soldTo) {
      setTeams(prevTeams => 
        prevTeams.map(team => {
          if (team.id === updatedPlayer.soldTo) {
            return {
              ...team,
              players: team.players.map(player => 
                player.id === updatedPlayer.id ? updatedPlayer : player
              )
            };
          }
          return team;
        })
      );
    }
  };

  const deletePlayer = (playerId: string) => {
    if (auctionState.currentPlayerId === playerId && auctionState.isAuctionInProgress) {
      toast({
        title: "Cannot Delete Player",
        description: "Cannot delete a player during an active auction",
        variant: "destructive",
      });
      return;
    }
    
    const playerToDelete = players.find(p => p.id === playerId);
    
    if (playerToDelete?.sold) {
      toast({
        title: "Cannot Delete Player",
        description: "Cannot delete a player who has been sold",
        variant: "destructive",
      });
      return;
    }
    
    setPlayers(prevPlayers => prevPlayers.filter(player => player.id !== playerId));
  };

  const addTeam = (team: Team) => {
    setTeams(prevTeams => [...prevTeams, team]);
  };

  const updateTeam = (updatedTeam: Team) => {
    if (auctionState.isAuctionInProgress && 
        auctionState.currentBidTeamId === updatedTeam.id) {
      toast({
        title: "Cannot Update Team",
        description: "Cannot update a team during an active auction",
        variant: "destructive",
      });
      return;
    }
    
    setTeams(prevTeams => 
      prevTeams.map(team => 
        team.id === updatedTeam.id ? updatedTeam : team
      )
    );
  };

  const deleteTeam = (teamId: string) => {
    if (auctionState.isAuctionInProgress && 
        auctionState.currentBidTeamId === teamId) {
      toast({
        title: "Cannot Delete Team",
        description: "Cannot delete a team during an active auction",
        variant: "destructive",
      });
      return;
    }
    
    const team = teams.find(t => t.id === teamId);
    if (team && team.players.length > 0) {
      toast({
        title: "Cannot Delete Team",
        description: "Cannot delete a team that has players",
        variant: "destructive",
      });
      return;
    }
    
    setTeams(prevTeams => prevTeams.filter(team => team.id !== teamId));
  };

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
    addPlayer,
    updatePlayer,
    deletePlayer,
    addTeam,
    updateTeam,
    deleteTeam,
  };

  return <AuctionContext.Provider value={value}>{children}</AuctionContext.Provider>;
}

export const useAuction = () => {
  const context = useContext(AuctionContext);
  if (context === undefined) {
    throw new Error('useAuction must be used within an AuctionProvider');
  }
  return context;
};
