// hooks/useSavings.ts
import { useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { SavingsEntry } from '@/lib/types';
import { db } from '@/configs/firebaseConfig';

export function useSavings() {
  const { currentUser } = useAuth();
  const [savings, setSavings] = useState<SavingsEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, 'savings'),
      where('userId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const savingsData: SavingsEntry[] = [];
      snapshot.forEach((doc) => {
        savingsData.push({
          id: doc.id,
          ...doc.data()
        } as SavingsEntry);
      });
      setSavings(savingsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const addSaving = async (saving: Omit<SavingsEntry, 'id'>) => {
    if (!currentUser) return;
    
    try {
      await addDoc(collection(db, 'savings'), {
        ...saving,
        userId: currentUser.uid,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error adding document: ', error);
      throw error;
    }
  };

  const deleteSaving = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'savings', id));
    } catch (error) {
      console.error('Error deleting document: ', error);
      throw error;
    }
  };

  return { savings, loading, addSaving, deleteSaving };
}