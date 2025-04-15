import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { SavingsEntry } from '../models/savings';
import { FirestoreService } from '@/service/firestoreService';

export function useSavings() {
  const { currentUser } = useAuth();
  const [savings, setSavings] = useState<SavingsEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const fetchSavings = async () => {
      setLoading(true);
      try {
        const savingsData = await FirestoreService.getDocumentsByField(
          'savings',
          'userId',
          currentUser.uid
        );
        setSavings(savingsData as SavingsEntry[]);
      } catch (error) {
        console.error('Error fetching savings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavings();
  }, [currentUser]);

  const addSaving = async (saving: Omit<SavingsEntry, 'id' | 'userId' | 'createdAt'>) => {
    if (!currentUser) return;
    
    try {
      await FirestoreService.addDocument('savings', {
        ...saving,
        userId: currentUser.uid
      });
    } catch (error) {
      console.error('Error adding saving:', error);
      throw error;
    }
  };

  return { savings, loading, addSaving };
}