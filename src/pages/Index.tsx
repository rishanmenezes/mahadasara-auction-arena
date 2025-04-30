
import React from 'react';
import Header from '@/components/Header';
import PlayerShowcase from '@/components/PlayerShowcase';
import TeamDashboard from '@/components/TeamDashboard';
import AuctionControls from '@/components/AuctionControls';
import PlayersList from '@/components/PlayersList';
import AuctionHistory from '@/components/AuctionHistory';
import { Button } from '@/components/ui/button';
import { UserPlus, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Franchises</h2>
            <Link to="/manage-franchises">
              <Button className="primary-button">
                <Building2 className="h-4 w-4 mr-2" />
                Manage Franchises
              </Button>
            </Link>
          </div>
          <TeamDashboard />
        </div>
        
        {/* Players List */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Players</h2>
            <Link to="/manage-players">
              <Button className="primary-button">
                <UserPlus className="h-4 w-4 mr-2" />
                Manage Players
              </Button>
            </Link>
          </div>
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
