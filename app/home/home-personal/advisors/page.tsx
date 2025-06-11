"use client";
import AdvisorCard from "@/components/advisor/AdvisorCard";
import BookingModal from "@/components/advisor/BookingModal";

import { useAdvisors } from "@/hooks/useAdvisor";
import { useFinancialHealth } from "@/hooks/useFinancialHealth";
import { Advisor } from "@/lib/types";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { collection, query, where, getDocs, doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/configs/firebaseConfig';
import { auth } from '@/configs/firebaseConfig'; // Import Firebase Auth
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Appointment {
  id: string;
  advisorId: string;
  advisorName: string;
  advisorType: 'personal' | 'personal';
  createdAt: string;
  date: string;
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  time: string;
  uid: string;
  userEmail?: string; // Added to store user email
  userName?: string; // Added to store user display name
}

export default function Consultants() {
  const { advisors, loading: advisorsLoading } = useAdvisors();
  const { loading: healthLoading } = useFinancialHealth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [selectedAdvisor, setSelectedAdvisor] = useState<Advisor | null>(null);
  const [showAllAppointments, setShowAllAppointments] = useState(false);


  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setAppointmentsLoading(true);
        const appointmentsQuery = query(
          collection(db, 'appointments'),
          where('advisorType', '==', 'personal')
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
      // Get the current user from Firebase Auth
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Create a reference for the new appointment document
      const appointmentRef = doc(collection(db, 'appointments'));

      // Include user data in the newAppointment object
      const newAppointment: Appointment = {
        id: appointmentRef.id,
        advisorId: selectedAdvisor.id,
        advisorName: selectedAdvisor.name,
        uid: user.uid, // Use actual user ID
        userEmail: user.email || undefined, // Include user email if available
        userName: user.displayName || undefined, // Include user display name if available
        date,
        time,
        notes,
        status: "scheduled",
        createdAt: new Date().toISOString(),
        advisorType: "personal",
      };

      // Save the appointment to Firebase
      await setDoc(appointmentRef, newAppointment);

      // Update the state with the new appointment
      setAppointments((prev) => [...prev, newAppointment]);
      toast.success("Appointment booked successfully!");
      setSelectedAdvisor(null);
    } catch (error) {
      toast.error("Failed to book appointment");
      console.error("Error booking appointment:", error);
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, newStatus: 'scheduled' | 'cancelled') => {
    setActionLoading(appointmentId);
    setActionError(null);

    try {
      const appointmentRef = doc(db, 'appointments', appointmentId);
      await updateDoc(appointmentRef, { status: newStatus });
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

  const displayedAppointments = showAllAppointments 
    ? appointments 
    : appointments.slice(0, 3);

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
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Upcoming Appointments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {appointments.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">
                    No upcoming appointments
                  </p>
                ) : (
                  <div className="space-y-4">
                    {displayedAppointments
                        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                        .map((appointment) => {
                          const advisor = advisors.find((a) => a.id === appointment.advisorId);
                          return (
                            <div 
                              key={appointment.id} 
                              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                            >
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{advisor?.name || appointment.advisorName}</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                  {new Date(appointment.date).toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </p>
                                <p className="text-sm text-gray-500">{appointment.time}</p>
                                {appointment.notes && (
                                  <p className="text-sm text-gray-600 mt-2">
                                    Notes: {appointment.notes}
                                  </p>
                                )}
                              </div>
                              <div className="flex flex-col items-end">
                                <Badge 
                                  variant={
                                    appointment.status === 'scheduled' ? 'default' :
                                    appointment.status === 'cancelled' ? 'destructive' :
                                    'secondary'
                                  }
                                  className="mb-2"
                                >
                                  {appointment.status}
                                </Badge>
                                <div className="flex gap-2">
                                  {appointment.status !== 'scheduled' && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => updateAppointmentStatus(appointment.id, 'scheduled')}
                                      disabled={actionLoading === appointment.id}
                                    >
                                      {actionLoading === appointment.id ? 'Processing...' : 'Reschedule'}
                                    </Button>
                                  )}
                                  {appointment.status !== 'cancelled' && (
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                                      disabled={actionLoading === appointment.id}
                                    >
                                      {actionLoading === appointment.id ? 'Processing...' : 'Cancel'}
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {appointments.length > 3 && (
                      <div className="text-center mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowAllAppointments(!showAllAppointments)}
                        >
                          {showAllAppointments ? 'Show Less' : 'Show More'}
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
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