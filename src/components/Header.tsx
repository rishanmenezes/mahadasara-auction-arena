
import React from 'react';
import { Trophy } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-auction-dark py-4 border-b border-gray-800">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Trophy className="h-8 w-8 text-auction-secondary" />
          <h1 className="text-2xl font-bold text-white">
            <span className="text-auction-secondary">Mahadasara</span> Auction Arena
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-300">Welcome to the Sports Auction</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
