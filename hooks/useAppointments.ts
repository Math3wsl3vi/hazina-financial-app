import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { Appointment } from '@/lib/types';
import { db } from '@/configs/firebaseConfig';

export function useAppointments() {
  const { currentUser } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, 'appointments'),
      where('userId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const appointmentsData: Appointment[] = [];
      snapshot.forEach((doc) => {
        appointmentsData.push({
          id: doc.id,
          ...doc.data()
        } as Appointment);
      });
      setAppointments(appointmentsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const bookAppointment = async (appointment: Omit<Appointment, 'id'>) => {
    try {
      await addDoc(collection(db, 'appointments'), appointment);
    } catch (error) {
      console.error('Error booking appointment:', error);
      throw error;
    }
  };

  return { appointments, loading, bookAppointment };
}