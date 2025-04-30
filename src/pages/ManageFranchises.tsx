
import React, { useState } from 'react';
import { useAuction } from '@/context/AuctionContext';
import { Team } from '@/types/auction';
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
import { Search, Plus, Pencil, Trash2, ArrowLeft, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import TeamForm from '@/components/TeamForm';
import { Link } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const ManageFranchises = () => {
  const { teams, addTeam, updateTeam, deleteTeam } = useAuction();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [currentTeam, setCurrentTeam] = useState<Team | undefined>(undefined);
  const [deleteConfirm, setDeleteConfirm] = useState<Team | null>(null);
  
  const filteredTeams = searchTerm 
    ? teams.filter(team => 
        team.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : teams;

  const handleEditTeam = (team: Team) => {
    setCurrentTeam(team);
    setShowForm(true);
  };

  const handleAddTeam = () => {
    setCurrentTeam(undefined);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setCurrentTeam(undefined);
  };

  const handleSubmitForm = (team: Team) => {
    if (currentTeam) {
      updateTeam(team);
      toast({
        title: "Team Updated",
        description: `${team.name} has been updated successfully`,
      });
    } else {
      addTeam(team);
      toast({
        title: "Team Added",
        description: `${team.name} has been added successfully`,
      });
    }
    setShowForm(false);
    setCurrentTeam(undefined);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirm) {
      deleteTeam(deleteConfirm.id);
      toast({
        title: "Team Deleted",
        description: `${deleteConfirm.name} has been removed`,
      });
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-auction-primary">
      <header className="bg-auction-dark py-4 border-b border-gray-800">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Manage Franchises</h1>
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
          <TeamForm 
            team={currentTeam} 
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
                  placeholder="Search franchises..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-auction-secondary border-gray-700 text-white"
                />
              </div>
              <Button onClick={handleAddTeam} className="w-full md:w-auto primary-button">
                <Plus className="h-4 w-4 mr-2" />
                Add New Franchise
              </Button>
            </div>
            
            <div className="bg-auction-dark border border-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Logo</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Initial Purse</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Remaining</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Players</th>
                      <th className="py-3 px-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {filteredTeams.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-4 px-4 text-center text-gray-400">
                          No franchises found
                        </td>
                      </tr>
                    ) : (
                      filteredTeams.map((team) => (
                        <tr key={team.id} className="hover:bg-gray-800/50">
                          <td className="py-3 px-4">
                            <Avatar className="w-10 h-10 border border-gray-700">
                              {team.logoUrl ? (
                                <AvatarImage src={team.logoUrl} alt={team.name} className="object-cover" />
                              ) : (
                                <AvatarFallback className="bg-gray-800 text-white">
                                  <Building2 className="w-5 h-5" />
                                </AvatarFallback>
                              )}
                            </Avatar>
                          </td>
                          <td className="py-3 px-4 text-sm text-white">{team.name}</td>
                          <td className="py-3 px-4 text-sm text-gray-300">₹{team.initialPurse}</td>
                          <td className="py-3 px-4 text-sm text-auction-highlight">₹{team.remainingPurse}</td>
                          <td className="py-3 px-4 text-sm text-gray-300">{team.players.length}</td>
                          <td className="py-3 px-4 text-sm text-right">
                            <div className="flex justify-end space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8 w-8 p-0 border-gray-700"
                                onClick={() => handleEditTeam(team)}
                              >
                                <Pencil className="h-4 w-4 text-gray-300" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8 w-8 p-0 border-gray-700"
                                onClick={() => setDeleteConfirm(team)}
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
            <AlertDialogTitle className="text-white">Delete Franchise</AlertDialogTitle>
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

export default ManageFranchises;
