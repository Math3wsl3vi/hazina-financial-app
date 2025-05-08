"use client";
import AdvisorCard from "@/components/advisor/AdvisorCard";
import BookingModal from "@/components/advisor/BookingModal";

import { useAdvisors } from "@/hooks/useAdvisor";
import { useFinancialHealth } from "@/hooks/useFinancialHealth";
import { Advisor } from "@/lib/types";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/configs/firebaseConfig'; 
import { Button } from '@/components/ui/button';

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

export default function Consultants() {
  const { advisors, loading: advisorsLoading } = useAdvisors();
  const { loading: healthLoading } = useFinancialHealth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null); // Track loading state for actions
  const [actionError, setActionError] = useState<string | null>(null); // Track errors for actions
  const [selectedAdvisor, setSelectedAdvisor] = useState<Advisor | null>(null);

  // Fetch appointments from Firestore with advisorType = "business"
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setAppointmentsLoading(true);
        const appointmentsQuery = query(
          collection(db, 'appointments'),
          where('advisorType', '==', 'business')
        );
        const querySnapshot = await getDocs(appointmentsQuery);
        const appointmentData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Appointment[];
        setAppointments(appointmentData);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setActionError('Failed to load appointments. Please try again.');
      } finally {
        setAppointmentsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleBookAppointment = (advisor: Advisor) => {
    setSelectedAdvisor(advisor);
  };

  const handleConfirmBooking = async (
    date: string,
    time: string,
    notes: string
  ) => {
    if (!selectedAdvisor) return;

    try {
      const newAppointment = {
        advisorId: selectedAdvisor.id,
        advisorName: selectedAdvisor.name,
        uid: "current-user-id",
        date,
        time,
        notes,
        status: "scheduled",
        createdAt: new Date().toISOString(),
        advisorType: "business",
      };
      // Since we're not using a hook, add the appointment to Firestore directly
      const appointmentRef = doc(collection(db, 'appointments'));
      await updateDoc(appointmentRef, newAppointment);
      // Update local state to reflect the new appointment
      setAppointments((prev) => [...prev, { id: appointmentRef.id, ...newAppointment }]);
      toast.success("Appointment booked successfully!");
      setSelectedAdvisor(null);
    } catch (error) {
      toast.error("Failed to book appointment");
      console.error(error);
    }
  };

  // Function to update appointment status
  const updateAppointmentStatus = async (appointmentId: string, newStatus: 'scheduled' | 'cancelled') => {
    setActionLoading(appointmentId);
    setActionError(null);

    try {
      const appointmentRef = doc(db, 'appointments', appointmentId);
      await updateDoc(appointmentRef, { status: newStatus });
      // Update local state to reflect the change
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === appointmentId ? { ...appt, status: newStatus } : appt
        )
      );
      toast.success(`Appointment ${newStatus} successfully!`);
    } catch (error) {
      console.error(`Error updating appointment status to ${newStatus}:`, error);
      setActionError(`Failed to update appointment status to ${newStatus}. Please try again.`);
    } finally {
      setActionLoading(null);
    }
  };

  if (advisorsLoading || appointmentsLoading || healthLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-poppins">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-600">Loading advisor data...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-poppins">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Hazina Advisor Hub
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Get personalized advice from certified financial advisors
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">
                Upcoming Appointments
              </h2>
              {appointments.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  No upcoming appointments
                </p>
              ) : (
                  <div>
                    {appointments.map((appointment) => {
                      const advisor = advisors.find(
                        (a) => a.id === appointment.advisorId
                      );
                      return (
                        <div key={appointment.id} className={
                          appointment.status === 'scheduled'
                            ? 'border-green-600'
                            : appointment.status === 'cancelled'
                            ? 'border-red-600'
                            : 'border-blue-600'
                        }>
                          <h1>{advisor?.name}</h1>
                         <div className="flex justify-between">
                         <p>{new Date(appointment.date).toLocaleDateString()}</p>
                         <p>{appointment.time}</p>
                         </div>
                         <div className="flex  justify-between mt-5">
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
                            </div>
                        </div>
                      );
                    })}
                  </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            {advisors.length === 0 ? (
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <p className="text-gray-500">
                  No advisors available at the moment
                </p>
              </div>
            ) : (
              advisors.map((advisor) => (
                <AdvisorCard
                  key={advisor.id}
                  advisor={advisor}
                  onBook={() => handleBookAppointment(advisor)}
                />
              ))
            )}
          </div>
        </div>

        {actionError && (
          <div className="mt-4 text-red-500 text-sm text-center">{actionError}</div>
        )}
      </div>

      {selectedAdvisor && (
        <BookingModal
          advisor={selectedAdvisor}
          onClose={() => setSelectedAdvisor(null)}
          onConfirm={handleConfirmBooking}
        />
      )}

      <div className="h-[75px]"></div>
    </div>
  );
}