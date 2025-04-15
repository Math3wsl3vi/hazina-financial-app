'use client';

import SavingsForm from '@/components/savings/SavingsForm';
import SavingsList from '@/components/savings/SavingsList';
import { useSavings } from '@/hooks/useSavings';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';
import { SavingsEntry } from '@/lib/types';

export default function SavingsPage() {
  const { currentUser } = useAuth();
  const { savings, loading, addSaving, deleteSaving } = useSavings();

  const handleSave = async (newSaving: Omit<SavingsEntry, 'id'>) => {
    if (!currentUser) {
      toast.error('You must be logged in to save');
      return;
    }

    try {
      await addSaving(newSaving);
      toast.success('Saved successfully!');
    } catch (error) {
      console.error('Firestore error:', error);
      toast.error('Failed to save. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSaving(id);
      toast.success('Entry deleted');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 font-poppins">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Hazina Savings</h1>
          <p className="mt-2 text-lg text-gray-600">
            Track your savings and watch your money grow
          </p>
        </div>

        <div className="space-y-8">
          <SavingsForm onSave={handleSave} />
          
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading your savings...</p>
            </div>
          ) : (
            <SavingsList 
              savings={savings} 
              onDelete={handleDelete} 
            />
          )}
        </div>
      </div>
      <div className="h-[75px]"></div>
    </div>
  );
}