
import React from 'react';
import { useAuction } from '@/context/AuctionContext';
import { Player } from '@/types/auction';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  User,
  CircleDollarSign, 
  Filter 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const PlayersList = () => {
  const { players, teams, startAuction } = useAuction();
  const [filteredPlayers, setFilteredPlayers] = React.useState<Player[]>(players);
  const [filterType, setFilterType] = React.useState<string>("All");

  React.useEffect(() => {
    if (filterType === "All") {
      setFilteredPlayers(players);
    } else if (filterType === "Sold") {
      setFilteredPlayers(players.filter(player => player.sold));
    } else if (filterType === "Unsold") {
      setFilteredPlayers(players.filter(player => player.sold === false));
    } else if (filterType === "Upcoming") {
      setFilteredPlayers(players.filter(player => !player.sold && player.soldTo === undefined));
    } else if (filterType.startsWith("Position:")) {
      const position = filterType.split(":")[1].trim();
      setFilteredPlayers(players.filter(player => player.position === position));
    }
  }, [filterType, players]);

  const getTeamName = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    return team ? team.name : "Unknown Team";
  };

  return (
    <div className="bg-auction-dark border border-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 border-b border-gray-800 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Players</h2>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-8 border-gray-700 text-gray-300">
              <Filter className="h-4 w-4 mr-1" />
              {filterType}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-auction-dark border-gray-700 text-white">
            <DropdownMenuLabel>Filter By</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-700" />
            <DropdownMenuItem onClick={() => setFilterType("All")}>
              All Players
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterType("Sold")}>
              Sold Players
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterType("Unsold")}>
              Unsold Players
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterType("Upcoming")}>
              Upcoming Players
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-700" />
            <DropdownMenuItem onClick={() => setFilterType("Position: Batsman")}>
              Batsmen
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterType("Position: Bowler")}>
              Bowlers
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterType("Position: All-Rounder")}>
              All-Rounders
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterType("Position: Wicket-Keeper")}>
              Wicket-Keepers
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterType("Position: Captain")}>
              Captains
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="overflow-auto max-h-[400px]">
        <table className="min-w-full">
          <thead className="bg-gray-800">
            <tr>
              <th className="py-2 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
              <th className="py-2 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Position</th>
              <th className="py-2 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Base</th>
              <th className="py-2 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              <th className="py-2 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filteredPlayers.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-4 px-4 text-center text-gray-400">
                  No players found matching the filter
                </td>
              </tr>
            ) : (
              filteredPlayers.map((player) => (
                <tr key={player.id} className="hover:bg-gray-800/50">
                  <td className="py-2 px-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center mr-2">
                        {player.imageUrl ? (
                          <img src={player.imageUrl} alt={player.name} className="h-8 w-8 rounded-full object-cover" />
                        ) : (
                          <User className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-white">{player.name}</span>
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <Badge variant="outline" className="border-gray-700 text-gray-300">
                      {player.position}
                    </Badge>
                  </td>
                  <td className="py-2 px-4">
                    <div className="flex items-center text-gray-300">
                      <CircleDollarSign className="h-3 w-3 mr-1" />
                      <span className="text-sm">₹{player.basePrice}</span>
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    {player.sold ? (
                      <div className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 text-auction-highlight mr-1" />
                        <span className="text-sm text-auction-highlight">
                          Sold to {getTeamName(player.soldTo || "")} (₹{player.soldAmount})
                        </span>
                      </div>
                    ) : player.soldTo === undefined ? (
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-400">Upcoming</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <XCircle className="h-4 w-4 text-auction-danger mr-1" />
                        <span className="text-sm text-auction-danger">Unsold</span>
                      </div>
                    )}
                  </td>
                  <td className="py-2 px-4">
                    <Button
                      onClick={() => startAuction(player.id)}
                      disabled={player.sold}
                      className="h-8 text-xs primary-button"
                    >
                      {player.sold ? 'Sold' : 'Auction'}
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlayersList;
