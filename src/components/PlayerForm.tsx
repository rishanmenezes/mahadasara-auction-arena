
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Player, PlayerPosition } from '@/types/auction';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { v4 as uuidv4 } from 'uuid';
import ImageUploader from '@/components/ImageUploader';

const playerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  basePrice: z.coerce.number().min(500, "Base price must be at least 500"),
  position: z.enum(['Batsman', 'Bowler', 'All-Rounder', 'Wicket-Keeper', 'Captain']),
});

type PlayerFormValues = z.infer<typeof playerSchema>;

interface PlayerFormProps {
  player?: Player;
  onSubmit: (player: Player) => void;
  onCancel: () => void;
}

const PlayerForm: React.FC<PlayerFormProps> = ({ player, onSubmit, onCancel }) => {
  const isEditing = !!player;
  const [imageUrl, setImageUrl] = useState<string | undefined>(player?.imageUrl);
  
  const defaultValues: Partial<PlayerFormValues> = player
    ? {
        name: player.name,
        basePrice: player.basePrice,
        position: player.position,
      }
    : {
        basePrice: 1000,
        position: 'Batsman',
      };

  const form = useForm<PlayerFormValues>({
    resolver: zodResolver(playerSchema),
    defaultValues,
  });

  const handleSubmit = (values: PlayerFormValues) => {
    const newPlayer: Player = {
      id: player?.id || uuidv4(),
      name: values.name,
      imageUrl: imageUrl || '/placeholder.svg',
      basePrice: values.basePrice,
      position: values.position as PlayerPosition,
      skills: player?.skills || [],
      stats: {
        battingAverage: player?.stats.battingAverage,
        bowlingAverage: player?.stats.bowlingAverage,
        matchesPlayed: player?.stats.matchesPlayed,
        runsScored: player?.stats.runsScored,
        wicketsTaken: player?.stats.wicketsTaken,
      },
      sold: player?.sold || false,
      soldTo: player?.soldTo,
      soldAmount: player?.soldAmount,
    };
    
    onSubmit(newPlayer);
  };

  const handleImageUpload = (imageData: string) => {
    setImageUrl(imageData);
  };

  return (
    <div className="bg-auction-dark border border-gray-800 rounded-lg p-4">
      <h2 className="text-xl font-bold text-white mb-4">
        {isEditing ? 'Edit Player' : 'Add New Player'}
      </h2>
      
      <div className="mb-6 flex justify-center">
        <ImageUploader 
          currentImage={imageUrl} 
          onImageUpload={handleImageUpload} 
          size="lg" 
          shape="circle"
          className="border-4 border-auction-accent/30 shadow-[0_0_15px_rgba(79,70,229,0.15)]"
        />
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Name</FormLabel>
                <FormControl>
                  <Input placeholder="Player name" {...field} className="bg-auction-secondary border-gray-700 text-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="basePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Base Price (₹)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="1000" {...field} className="bg-auction-secondary border-gray-700 text-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Position</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-auction-secondary border-gray-700 text-white">
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-auction-dark border-gray-700 text-white">
                    <SelectItem value="Batsman">Batsman</SelectItem>
                    <SelectItem value="Bowler">Bowler</SelectItem>
                    <SelectItem value="All-Rounder">All-Rounder</SelectItem>
                    <SelectItem value="Wicket-Keeper">Wicket-Keeper</SelectItem>
                    <SelectItem value="Captain">Captain</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="border-gray-700 text-gray-300 hover:text-white"
            >
              Cancel
            </Button>
            <Button type="submit" className="primary-button">
              {isEditing ? 'Update Player' : 'Add Player'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PlayerForm;
