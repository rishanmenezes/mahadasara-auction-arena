
import React from 'react';
import { User, Gavel, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuction } from '@/context/AuctionContext';
import { Badge } from '@/components/ui/badge';

const PlayerShowcase = () => {
  const { currentPlayer, auctionState } = useAuction();

  if (!currentPlayer) {
    return (
      <Card className="bg-auction-dark border-gray-800 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-center text-2xl font-bold">Player Showcase</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center min-h-[400px]">
          <User className="h-24 w-24 text-gray-600 mb-4" />
          <p className="text-gray-400 text-lg">Select a player to start the auction</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-auction-dark to-[#232a3c] border-2 border-auction-accent/20 shadow-xl animate-fade-in rounded-xl overflow-hidden">
      <CardHeader className="pb-2 bg-auction-secondary/10 border-b border-auction-accent/20">
        <CardTitle className="text-center text-2xl font-bold text-white flex items-center justify-center gap-2">
          <Gavel className="h-6 w-6 text-auction-secondary" />
          Current Player
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="w-full md:w-1/3 flex justify-center">
            <div className="relative group">
              <div className="w-64 h-64 rounded-full overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.15)] border-4 border-auction-accent/30 transition-all duration-300 group-hover:border-auction-secondary/50">
                {currentPlayer.imageUrl ? (
                  <img 
                    src={currentPlayer.imageUrl} 
                    alt={currentPlayer.name} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <User className="h-32 w-32 text-gray-600" />
                )}
              </div>
              <Badge 
                className="absolute bottom-2 right-2 bg-auction-accent text-white px-3 py-1 rounded-full shadow-md border border-indigo-700"
              >
                {currentPlayer.position}
              </Badge>
            </div>
          </div>
          <div className="w-full md:w-2/3 text-center md:text-left">
            <h2 className="text-4xl font-bold mb-4 text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {currentPlayer.name}
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 mb-6">
              <Badge className="bg-auction-secondary hover:bg-amber-500 text-black px-4 py-2 text-lg font-semibold flex items-center gap-2 shadow-md">
                <DollarSign className="h-5 w-5" />
                Base Price: ₹{currentPlayer.basePrice}
              </Badge>
              
              {auctionState.currentBidAmount > 0 && (
                <Badge 
                  className={`bg-auction-highlight hover:bg-emerald-600 text-white px-4 py-2 text-lg font-semibold flex items-center gap-2 shadow-md ${
                    auctionState.currentBidAmount > currentPlayer.basePrice ? 'animate-pulse-bid' : ''
                  }`}
                >
                  <DollarSign className="h-5 w-5" />
                  Current Bid: ₹{auctionState.currentBidAmount}
                </Badge>
              )}
            </div>
            
            {auctionState.currentBidTeamId && (
              <div className="mt-4 bg-auction-dark/50 p-3 rounded-lg border border-auction-accent/20 inline-block">
                <span className="text-gray-400">Current Bidder: </span>
                <span className="text-auction-secondary font-bold">{auctionState.currentBidTeamId}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerShowcase;
