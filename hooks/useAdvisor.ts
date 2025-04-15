import { useState, useEffect } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { Advisor } from '@/lib/types';
import { db } from '@/configs/firebaseConfig';

export function useAdvisors() {
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'advisors'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const advisorsData: Advisor[] = [];
      snapshot.forEach((doc) => {
        advisorsData.push({
          id: doc.id,
          ...doc.data()
        } as Advisor);
      });
      setAdvisors(advisorsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { advisors, loading };
}