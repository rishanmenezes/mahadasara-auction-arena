
import React from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { v4 as uuidv4 } from 'uuid';

const playerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  basePrice: z.coerce.number().min(500, "Base price must be at least 500"),
  position: z.enum(['Batsman', 'Bowler', 'All-Rounder', 'Wicket-Keeper', 'Captain']),
  skills: z.string().transform(val => val.split(',').map(skill => skill.trim()).filter(Boolean)),
  battingAverage: z.coerce.number().optional(),
  bowlingAverage: z.coerce.number().optional(),
  matchesPlayed: z.coerce.number().optional(),
  runsScored: z.coerce.number().optional(),
  wicketsTaken: z.coerce.number().optional(),
});

type PlayerFormValues = z.infer<typeof playerSchema>;

interface PlayerFormProps {
  player?: Player;
  onSubmit: (player: Player) => void;
  onCancel: () => void;
}

const PlayerForm: React.FC<PlayerFormProps> = ({ player, onSubmit, onCancel }) => {
  const isEditing = !!player;
  
  const defaultValues: Partial<PlayerFormValues> = player
    ? {
        name: player.name,
        basePrice: player.basePrice,
        position: player.position,
        skills: player.skills.join(', '),
        battingAverage: player.stats.battingAverage,
        bowlingAverage: player.stats.bowlingAverage,
        matchesPlayed: player.stats.matchesPlayed,
        runsScored: player.stats.runsScored,
        wicketsTaken: player.stats.wicketsTaken,
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
      imageUrl: player?.imageUrl || '/placeholder.svg',
      basePrice: values.basePrice,
      position: values.position as PlayerPosition,
      skills: values.skills,
      stats: {
        battingAverage: values.battingAverage,
        bowlingAverage: values.bowlingAverage,
        matchesPlayed: values.matchesPlayed,
        runsScored: values.runsScored,
        wicketsTaken: values.wicketsTaken,
      },
      sold: player?.sold || false,
      soldTo: player?.soldTo,
      soldAmount: player?.soldAmount,
    };
    
    onSubmit(newPlayer);
  };

  return (
    <div className="bg-auction-dark border border-gray-800 rounded-lg p-4">
      <h2 className="text-xl font-bold text-white mb-4">
        {isEditing ? 'Edit Player' : 'Add New Player'}
      </h2>
      
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
          
          <FormField
            control={form.control}
            name="skills"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Skills (comma-separated)</FormLabel>
                <FormControl>
                  <Textarea placeholder="Opening Batsman, Right Handed, Medium Pacer" {...field} 
                    className="bg-auction-secondary border-gray-700 text-white resize-none h-20" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="matchesPlayed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Matches Played</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} className="bg-auction-secondary border-gray-700 text-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="battingAverage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Batting Average</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.1" {...field} className="bg-auction-secondary border-gray-700 text-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="bowlingAverage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Bowling Average</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.1" {...field} className="bg-auction-secondary border-gray-700 text-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="runsScored"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Runs Scored</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} className="bg-auction-secondary border-gray-700 text-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="wicketsTaken"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Wickets Taken</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} className="bg-auction-secondary border-gray-700 text-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
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
