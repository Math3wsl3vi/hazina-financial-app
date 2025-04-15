// hooks/useDebts.ts
import { useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, where, updateDoc } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { DebtEntry } from '@/lib/types';
import { db } from '@/configs/firebaseConfig';

export function useDebts() {
  const { currentUser } = useAuth();
  const [debts, setDebts] = useState<DebtEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, 'debts'),
      where('userId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const debtsData: DebtEntry[] = [];
      snapshot.forEach((doc) => {
        debtsData.push({
          id: doc.id,
          ...doc.data()
        } as DebtEntry);
      });
      setDebts(debtsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const addDebt = async (debt: Omit<DebtEntry, 'id'>) => {
    if (!currentUser) return;
    
    try {
      await addDoc(collection(db, 'debts'), {
        ...debt,
        userId: currentUser.uid,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error adding debt:', error);
      throw error;
    }
  };

  const updateDebt = async (id: string, debt: Partial<DebtEntry>) => {
    try {
      await updateDoc(doc(db, 'debts', id), debt);
    } catch (error) {
      console.error('Error updating debt:', error);
      throw error;
    }
  };

  const deleteDebt = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'debts', id));
    } catch (error) {
      console.error('Error deleting debt:', error);
      throw error;
    }
  };

  return { debts, loading, addDebt, updateDebt, deleteDebt };
}