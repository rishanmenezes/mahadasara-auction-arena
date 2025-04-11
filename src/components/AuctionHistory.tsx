
import React from 'react';
import { useAuction } from '@/context/AuctionContext';
import { format } from 'date-fns';
import { 
  Tag, 
  CheckCircle2, 
  XCircle,
  Clock,
  ArrowRightCircle
} from 'lucide-react';

const AuctionHistory = () => {
  const { auctionState, teams } = useAuction();
  const history = auctionState.history;

  const getTeamName = (teamId?: string) => {
    if (!teamId) return '';
    const team = teams.find(t => t.id === teamId);
    return team ? team.name : 'Unknown Team';
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'sold':
        return <CheckCircle2 className="h-4 w-4 text-auction-highlight" />;
      case 'unsold':
        return <XCircle className="h-4 w-4 text-auction-danger" />;
      case 'bid':
        return <ArrowRightCircle className="h-4 w-4 text-auction-accent" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="bg-auction-dark border border-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-xl font-bold text-white flex items-center">
          <Tag className="h-5 w-5 mr-2" />
          Recent Activity
        </h2>
      </div>
      
      <div className="overflow-auto max-h-[400px]">
        {history.length === 0 ? (
          <div className="p-6 text-center text-gray-400">
            <p>No auction history yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {history.map((item) => (
              <div key={item.id} className="p-3 hover:bg-gray-800/50">
                <div className="flex items-start">
                  <div className="mr-3 mt-1">
                    {getActionIcon(item.action)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-medium text-white">
                        {item.action === 'sold' && (
                          <>
                            <span className="text-auction-highlight">{item.playerName}</span>
                            {' sold to '}
                            <span className="text-auction-secondary">{getTeamName(item.teamId)}</span>
                            {' for '}
                            <span className="text-auction-highlight">₹{item.amount}</span>
                          </>
                        )}
                        {item.action === 'unsold' && (
                          <>
                            <span className="text-auction-danger">{item.playerName}</span>
                            {' was marked as unsold'}
                          </>
                        )}
                        {item.action === 'bid' && (
                          <>
                            <span className="text-auction-secondary">{getTeamName(item.teamId)}</span>
                            {' placed a bid of '}
                            <span className="text-auction-accent">₹{item.amount}</span>
                            {' for '} 
                            <span>{item.playerName}</span>
                          </>
                        )}
                      </p>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {format(new Date(item.timestamp), 'HH:mm:ss')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuctionHistory;
