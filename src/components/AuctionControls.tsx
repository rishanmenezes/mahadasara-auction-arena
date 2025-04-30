
import React from 'react';
import { 
  CheckCircle, 
  XCircle, 
  SkipForward, 
  Undo2, 
  RefreshCcw,
  AlertTriangle
} from 'lucide-react';
import { useAuction } from '@/context/AuctionContext';
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const AuctionControls = () => {
  const { 
    auctionState, 
    currentPlayer, 
    sellPlayer, 
    markAsUnsold, 
    nextPlayer, 
    undoLastAction,
    resetAuction
  } = useAuction();

  return (
    <div className="bg-auction-dark border border-gray-800 rounded-lg p-4 shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-center text-white">Auction Controls</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Button
          onClick={sellPlayer}
          disabled={!auctionState.isAuctionInProgress || !auctionState.currentBidTeamId}
          className="success-button flex items-center justify-center"
        >
          <CheckCircle className="mr-1 h-4 w-4" />
          <span>Sell</span>
        </Button>
        
        <Button
          onClick={markAsUnsold}
          disabled={!auctionState.isAuctionInProgress}
          className="danger-button flex items-center justify-center"
        >
          <XCircle className="mr-1 h-4 w-4" />
          <span>Unsold</span>
        </Button>
        
        <Button
          onClick={nextPlayer}
          disabled={auctionState.isAuctionInProgress}
          className="secondary-button flex items-center justify-center"
        >
          <SkipForward className="mr-1 h-4 w-4" />
          <span>Next</span>
        </Button>
        
        <Button
          onClick={undoLastAction}
          disabled={auctionState.history.length === 0}
          className="flex items-center justify-center border border-auction-secondary bg-transparent text-auction-secondary hover:bg-auction-secondary hover:text-auction-dark"
        >
          <Undo2 className="mr-1 h-4 w-4" />
          <span>Undo</span>
        </Button>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              className="flex items-center justify-center border border-auction-danger bg-transparent text-auction-danger hover:bg-auction-danger hover:text-white"
            >
              <RefreshCcw className="mr-1 h-4 w-4" />
              <span>Reset</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-auction-dark border-gray-700">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">Reset Auction?</AlertDialogTitle>
              <AlertDialogDescription>
                This will reset all auction data, team purses, and player statuses. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-gray-700 text-gray-300">Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={resetAuction}
                className="bg-auction-danger text-white hover:bg-red-600"
              >
                Reset
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      
      {auctionState.isAuctionInProgress && auctionState.currentBidTeamId && (
        <div className="mt-4 p-2 bg-auction-accent/20 rounded-md">
          <div className="flex items-center">
            <AlertTriangle className="text-auction-secondary h-5 w-5 mr-2" />
            <p className="text-sm text-gray-300">
              Current Bid: <span className="font-bold text-white">₹{auctionState.currentBidAmount}</span> by Team ID: {auctionState.currentBidTeamId}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuctionControls;
