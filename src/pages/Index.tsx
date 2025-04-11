
import React from 'react';
import Header from '@/components/Header';
import PlayerShowcase from '@/components/PlayerShowcase';
import TeamDashboard from '@/components/TeamDashboard';
import AuctionControls from '@/components/AuctionControls';
import PlayersList from '@/components/PlayersList';
import AuctionHistory from '@/components/AuctionHistory';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-auction-primary">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Player Showcase - Current Player */}
          <div className="lg:col-span-2">
            <PlayerShowcase />
          </div>
          
          {/* Auction History */}
          <div>
            <AuctionHistory />
          </div>
        </div>
        
        {/* Auction Controls */}
        <div className="mb-6">
          <AuctionControls />
        </div>
        
        {/* Team Dashboard */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4 text-white">Franchises</h2>
          <TeamDashboard />
        </div>
        
        {/* Players List */}
        <div className="mb-6">
          <PlayersList />
        </div>
      </main>
      
      <footer className="bg-auction-dark py-4 border-t border-gray-800 text-center text-gray-400 text-sm">
        <div className="container mx-auto px-4">
          <p>Mahadasara College Sports Auction Platform &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
