
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Team } from '@/types/auction';
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
import { v4 as uuidv4 } from 'uuid';
import ImageUploader from '@/components/ImageUploader';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Building2 } from 'lucide-react';

const teamSchema = z.object({
  name: z.string().min(1, "Team name is required"),
  initialPurse: z.coerce.number().min(10000, "Initial purse must be at least 10,000"),
});

type TeamFormValues = z.infer<typeof teamSchema>;

interface TeamFormProps {
  team?: Team;
  onSubmit: (team: Team) => void;
  onCancel: () => void;
}

const TeamForm: React.FC<TeamFormProps> = ({ team, onSubmit, onCancel }) => {
  const isEditing = !!team;
  const [logoUrl, setLogoUrl] = useState<string | undefined>(team?.logoUrl);
  
  const defaultValues: Partial<TeamFormValues> = team
    ? {
        name: team.name,
        initialPurse: team.initialPurse,
      }
    : {
        initialPurse: 100000,
      };

  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamSchema),
    defaultValues,
  });

  const handleSubmit = (values: TeamFormValues) => {
    const newTeam: Team = {
      id: team?.id || uuidv4(),
      name: values.name,
      logoUrl: logoUrl || '/placeholder.svg',
      color: '#333333', // Default neutral color for all teams
      initialPurse: values.initialPurse,
      remainingPurse: team ? team.remainingPurse : values.initialPurse,
      players: team?.players || [],
    };
    
    onSubmit(newTeam);
  };

  const handleImageUpload = (imageData: string) => {
    setLogoUrl(imageData);
  };

  return (
    <div className="bg-auction-dark border border-gray-800 rounded-lg p-4">
      <h2 className="text-xl font-bold text-white mb-4">
        {isEditing ? 'Edit Team' : 'Add New Team'}
      </h2>
      
      <div className="mb-6 flex justify-center">
        <div className="flex flex-col items-center">
          <ImageUploader 
            currentImage={logoUrl} 
            onImageUpload={handleImageUpload} 
            size="lg" 
            shape="circle"
            className="border-2 border-gray-700 hover:border-white/40 transition-colors"
          />
          <span className="text-sm text-gray-400 mt-2">Click to upload team logo</span>
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Team Name</FormLabel>
                <FormControl>
                  <Input placeholder="Team name" {...field} className="bg-auction-secondary border-gray-700 text-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="initialPurse"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Initial Purse (₹)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="100000" {...field} className="bg-auction-secondary border-gray-700 text-white" />
                </FormControl>
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
              {isEditing ? 'Update Team' : 'Add Team'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default TeamForm;
