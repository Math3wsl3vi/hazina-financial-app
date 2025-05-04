"use client"
import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/configs/firebaseConfig'; // Adjust the import based on your Firebase setup
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'; // ShadCN UI Table components
import { Button } from '@/components/ui/button'; // ShadCN UI Button component

// Interface for appointment data in Firestore
interface Appointment {
  id: string;
  advisorId: string;
  advisorName: string;
  advisorType: 'business' | 'personal';
  createdAt: string;
  date: string;
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  time: string;
  uid: string;
}

const Appointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null); // Track loading state for actions
  const [actionError, setActionError] = useState<string | null>(null); // Track errors for actions

  // Fetch appointments from Firestore
  useEffect(() => {
    const appointmentsQuery = query(collection(db, 'appointments'));

    const unsubscribe = onSnapshot(appointmentsQuery, (snapshot) => {
      const appointmentData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Appointment[];
      setAppointments(appointmentData);
    }, (error) => {
      console.error('Error fetching appointments:', error);
      setActionError('Failed to load appointments. Please try again.');
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Filter appointments by advisorType
  const personalAppointments = appointments.filter(
    (appointment) => appointment.advisorType === 'personal'
  );
  const businessAppointments = appointments.filter(
    (appointment) => appointment.advisorType === 'business'
  );

  // Function to update appointment status
  const updateAppointmentStatus = async (appointmentId: string, newStatus: 'scheduled' | 'cancelled') => {
    setActionLoading(appointmentId); // Set loading state for the specific appointment
    setActionError(null); // Reset error state

    try {
      const appointmentRef = doc(db, 'appointments', appointmentId);
      await updateDoc(appointmentRef, { status: newStatus });
      // The onSnapshot listener will automatically update the UI with the new status
    } catch (error) {
      console.error(`Error updating appointment status to ${newStatus}:`, error);
      setActionError(`Failed to update appointment status to ${newStatus}. Please try again.`);
    } finally {
      setActionLoading(null); // Reset loading state
    }
  };

  // Function to render the appointments table
  const renderAppointmentsTable = (appointmentsList: Appointment[], title: string) => (
    <div className="flex-1 bg-gray-50 p-6 rounded-lg shadow">
      <h1 className="text-xl font-semibold mb-4">{title}</h1>
      {appointmentsList.length === 0 ? (
        <p className="text-gray-500">No appointments found.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Advisor</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointmentsList.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>{appointment.advisorName}</TableCell>
                <TableCell>{new Date(appointment.date).toLocaleDateString()}</TableCell>
                <TableCell>{appointment.time}</TableCell>
                <TableCell>{appointment.notes || 'N/A'}</TableCell>
                <TableCell>
                  <span
                    className={
                      appointment.status === 'scheduled'
                        ? 'text-green-600'
                        : appointment.status === 'cancelled'
                        ? 'text-red-600'
                        : 'text-blue-600'
                    }
                  >
                    {appointment.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {appointment.status !== 'scheduled' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateAppointmentStatus(appointment.id, 'scheduled')}
                        disabled={actionLoading === appointment.id}
                      >
                        {actionLoading === appointment.id ? 'Scheduling...' : 'Schedule'}
                      </Button>
                    )}
                    {appointment.status !== 'cancelled' && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                        disabled={actionLoading === appointment.id}
                      >
                        {actionLoading === appointment.id ? 'Cancelling...' : 'Cancel'}
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row p-5 w-full mx-auto font-poppins gap-8 mt-[100px]">
      {/* Personal Advisors Section */}
      {renderAppointmentsTable(personalAppointments, 'Personal Advisors')}

      {/* Business Advisors Section */}
      {renderAppointmentsTable(businessAppointments, 'Business Advisors')}

      {/* Error Message */}
      {actionError && (
        <div className="mt-4 text-red-500 text-sm">{actionError}</div>
      )}
    </div>
  );
};

export default Appointments;