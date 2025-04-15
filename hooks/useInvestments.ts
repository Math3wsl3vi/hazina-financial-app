// hooks/useInvestments.ts
import { useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { InvestmentEntry } from '@/lib/types';
import { db } from '@/configs/firebaseConfig';

export function useInvestments() {
  const { currentUser } = useAuth();
  const [investments, setInvestments] = useState<InvestmentEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, 'investments'),
      where('userId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const investmentsData: InvestmentEntry[] = [];
      snapshot.forEach((doc) => {
        investmentsData.push({
          id: doc.id,
          ...doc.data()
        } as InvestmentEntry);
      });
      setInvestments(investmentsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const addInvestment = async (investment: Omit<InvestmentEntry, 'id' | 'userId' | 'createdAt'>) => {
    if (!currentUser) return;
    
    // Optimistic update
    const tempId = Date.now().toString();
    setInvestments(prev => [...prev, {
      ...investment,
      id: tempId,
      userId: currentUser.uid,
      createdAt: new Date().toISOString()
    }]);
  
    try {
      const docRef = await addDoc(collection(db, 'investments'), {
        ...investment,
        userId: currentUser.uid,
        createdAt: new Date().toISOString()
      });
      
      // Replace with actual document
      setInvestments(prev => prev.map(item => 
        item.id === tempId ? { ...item, id: docRef.id } : item
      ));
    } catch (error) {
      // Rollback on error
      setInvestments(prev => prev.filter(item => item.id !== tempId));
      throw error;
    }
  };

  const deleteInvestment = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'investments', id));
    } catch (error) {
      console.error('Error deleting investment:', error);
      throw error;
    }
  };

  return { investments, loading, addInvestment, deleteInvestment };
}