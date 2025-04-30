
import React from 'react';
import { useAuction } from '@/context/AuctionContext';
import { CircleDollarSign, Building2 } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const TeamDashboard = () => {
  const { teams, auctionState, placeBid } = useAuction();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {teams.map((team) => (
        <div
          key={team.id}
          className={`bg-auction-dark border ${
            auctionState.currentBidTeamId === team.id
              ? 'border-auction-secondary'
              : 'border-gray-800'
          } rounded-lg p-4 shadow-lg transition-all duration-300 hover:shadow-xl`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <Avatar className="w-12 h-12 mr-3 border-2 border-gray-700">
                {team.logoUrl ? (
                  <AvatarImage src={team.logoUrl} alt={team.name} className="object-cover" />
                ) : (
                  <AvatarFallback className="bg-gray-800 text-white">
                    <Building2 className="w-6 h-6" />
                  </AvatarFallback>
                )}
              </Avatar>
              <h3 className="font-semibold text-white">{team.name}</h3>
            </div>
            <span
              className={`text-sm font-bold ${
                team.remainingPurse < 5000
                  ? 'text-auction-danger'
                  : 'text-auction-highlight'
              }`}
            >
              <CircleDollarSign className="inline-block w-4 h-4 mr-1" />
              ₹{team.remainingPurse}
            </span>
          </div>

          <div className="mt-2">
            <div className="text-xs text-gray-400 mb-1">
              Players: <span className="text-white">{team.players.length}</span>
            </div>
            <div className="text-xs text-gray-400">
              Spent:{' '}
              <span className="text-white">
                ₹{team.initialPurse - team.remainingPurse}
              </span>
            </div>
          </div>

          <div className="mt-3">
            <button
              onClick={() => placeBid(team.id)}
              disabled={!auctionState.isAuctionInProgress}
              className="w-full py-1 text-sm font-semibold rounded-full transition-colors
                bg-auction-accent hover:bg-auction-accent/80 text-white
                disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              Place Bid
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeamDashboard;
