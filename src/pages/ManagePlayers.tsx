
import React, { useState } from 'react';
import { useAuction } from '@/context/AuctionContext';
import { Player } from '@/types/auction';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Search, Plus, Pencil, Trash2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import PlayerForm from '@/components/PlayerForm';
import { Link } from 'react-router-dom';

const ManagePlayers = () => {
  const { players, addPlayer, updatePlayer, deletePlayer } = useAuction();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState<Player | undefined>(undefined);
  const [deleteConfirm, setDeleteConfirm] = useState<Player | null>(null);
  
  const filteredPlayers = searchTerm 
    ? players.filter(player => 
        player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.position.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : players;

  const handleEditPlayer = (player: Player) => {
    setCurrentPlayer(player);
    setShowForm(true);
  };

  const handleAddPlayer = () => {
    setCurrentPlayer(undefined);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setCurrentPlayer(undefined);
  };

  const handleSubmitForm = (player: Player) => {
    if (currentPlayer) {
      updatePlayer(player);
      toast({
        title: "Player Updated",
        description: `${player.name} has been updated successfully`,
      });
    } else {
      addPlayer(player);
      toast({
        title: "Player Added",
        description: `${player.name} has been added successfully`,
      });
    }
    setShowForm(false);
    setCurrentPlayer(undefined);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirm) {
      deletePlayer(deleteConfirm.id);
      toast({
        title: "Player Deleted",
        description: `${deleteConfirm.name} has been removed`,
      });
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-auction-primary">
      <header className="bg-auction-dark py-4 border-b border-gray-800">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Manage Players</h1>
          <Link to="/">
            <Button variant="outline" className="border-gray-700 text-gray-300">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Auction
            </Button>
          </Link>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-6">
        {showForm ? (
          <PlayerForm 
            player={currentPlayer} 
            onSubmit={handleSubmitForm} 
            onCancel={handleCancelForm} 
          />
        ) : (
          <>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <div className="relative w-full md:w-auto flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search players..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-auction-secondary border-gray-700 text-white"
                />
              </div>
              <Button onClick={handleAddPlayer} className="w-full md:w-auto primary-button">
                <Plus className="h-4 w-4 mr-2" />
                Add New Player
              </Button>
            </div>
            
            <div className="bg-auction-dark border border-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Position</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Base Price</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="py-3 px-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {filteredPlayers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-4 px-4 text-center text-gray-400">
                          No players found
                        </td>
                      </tr>
                    ) : (
                      filteredPlayers.map((player) => (
                        <tr key={player.id} className="hover:bg-gray-800/50">
                          <td className="py-3 px-4 text-sm text-white">{player.name}</td>
                          <td className="py-3 px-4 text-sm text-gray-300">{player.position}</td>
                          <td className="py-3 px-4 text-sm text-gray-300">₹{player.basePrice}</td>
                          <td className="py-3 px-4 text-sm">
                            {player.sold ? (
                              <span className="text-auction-highlight">Sold</span>
                            ) : (
                              <span className="text-gray-400">Available</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-sm text-right">
                            <div className="flex justify-end space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8 w-8 p-0 border-gray-700"
                                onClick={() => handleEditPlayer(player)}
                              >
                                <Pencil className="h-4 w-4 text-gray-300" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8 w-8 p-0 border-gray-700"
                                onClick={() => setDeleteConfirm(player)}
                                disabled={player.sold}
                              >
                                <Trash2 className="h-4 w-4 text-auction-danger" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
      
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent className="bg-auction-dark border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Player</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              Are you sure you want to delete {deleteConfirm?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-700 text-gray-300">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-auction-danger text-white hover:bg-auction-danger/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManagePlayers;
