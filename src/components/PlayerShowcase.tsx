
import React from 'react';
import { User } from 'lucide-react';
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
    <Card className="bg-auction-dark border-gray-800 shadow-lg animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-center text-2xl font-bold text-white">
          Current Player
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3 flex justify-center">
            <div className="relative">
              <div className="w-64 h-64 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center">
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
                className="absolute bottom-2 right-2 bg-auction-accent text-white px-3 py-1 rounded-full"
              >
                {currentPlayer.position}
              </Badge>
            </div>
          </div>
          <div className="w-full md:w-2/3">
            <h2 className="text-3xl font-bold mb-2 text-white">{currentPlayer.name}</h2>
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-auction-secondary text-auction-dark">Base Price: ₹{currentPlayer.basePrice}</Badge>
              {auctionState.currentBidAmount > 0 && (
                <Badge 
                  className={`bg-auction-highlight text-white ${
                    auctionState.currentBidAmount > currentPlayer.basePrice ? 'animate-pulse-bid' : ''
                  }`}
                >
                  Current Bid: ₹{auctionState.currentBidAmount}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerShowcase;
