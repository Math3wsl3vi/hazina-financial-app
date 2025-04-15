import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { FinancialHealth } from '@/lib/types';
import { db } from '@/configs/firebaseConfig';

export function useFinancialHealth() {
  const { currentUser } = useAuth();
  const [financialHealth, setFinancialHealth] = useState<FinancialHealth | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = onSnapshot(
      doc(db, 'financialHealth', currentUser.uid),
      (doc) => {
        if (doc.exists()) {
          setFinancialHealth(doc.data() as FinancialHealth);
        }
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  return { financialHealth, loading };
}