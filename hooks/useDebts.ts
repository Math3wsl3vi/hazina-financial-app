import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { DebtEntry } from '../models/debt';
import { FirestoreService } from '@/service/firestoreService';

export function useDebt() {
  const { currentUser } = useAuth();
  const [debts, setDebts] = useState<DebtEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const fetchDebts = async () => {
      setLoading(true);
      try {
        const debtsData = await FirestoreService.getDocumentsByField(
          'debts',
          'userId',
          currentUser.uid
        );
        setDebts(debtsData as DebtEntry[]);
      } catch (error) {
        console.error('Error fetching debts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDebts();
  }, [currentUser]);

  const addDebt = async (debt: Omit<DebtEntry, 'id' | 'userId' | 'createdAt'>) => {
    if (!currentUser) return;
    
    try {
      await FirestoreService.addDocument('debts', {
        ...debt,
        userId: currentUser.uid
      });
    } catch (error) {
      console.error('Error adding debt:', error);
      throw error;
    }
  };

  return { debts, loading, addDebt };
}