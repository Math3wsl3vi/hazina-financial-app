'use client';
import InvestmentForm from '@/components/invest/InvestmentForm';
import InvestmentList from '@/components/invest/InvestmentList';
import { useInvestments } from '@/hooks/useInvestments';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';
import { InvestmentEntry } from '@/lib/types';

export default function InvestmentsPage() {
  const { currentUser } = useAuth();
  const { investments, loading, addInvestment, deleteInvestment } = useInvestments();

  const handleInvest = async (newInvestment: Omit<InvestmentEntry,'id' | 'userId' | 'createdAt'>) => {
    if (!currentUser) {
      toast.error('You must be logged in to add investments');
      return;
    }

    try {
      await addInvestment(newInvestment);
      toast.success('Investment added successfully!');
    } catch (error) {
      console.error('Failed to add investment:', error);
      toast.error('Failed to add investment');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteInvestment(id);
      toast.success('Investment deleted!');
    } catch (error) {
      console.error('Failed to delete investment:', error);
      toast.error('Failed to delete investment');
    }
  };

  return (
    <div className="min-h-screen pt-4 pb-12 px-2 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="space-y-8">
          <InvestmentForm onInvest={handleInvest} />
          
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading your investments...</p>
            </div>
          ) : (
            <InvestmentList 
              investments={investments} 
              onDelete={handleDelete} 
            />
          )}
        </div>
      </div>
      <div className='h-[75px]'></div>
    </div>
  );
}