"use client";
import AdvisorCard from "@/components/advisor/AdvisorCard";
import BookingModal from "@/components/advisor/BookingModal";

import { useAdvisors } from "@/hooks/useAdvisor";
import { useAppointments } from "@/hooks/useAppointments";
import { useFinancialHealth } from "@/hooks/useFinancialHealth";
import { Advisor } from "@/lib/types";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function Consultants() {
  const { advisors, loading: advisorsLoading } = useAdvisors();
  const {
    appointments,
    loading: appointmentsLoading,
    bookAppointment,
  } = useAppointments();
  const { loading: healthLoading } = useFinancialHealth();
  const [selectedAdvisor, setSelectedAdvisor] = useState<Advisor | null>(null);

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
      await bookAppointment({
        advisorId: selectedAdvisor.id,
        advisorName: selectedAdvisor.name,
        userId: "current-user-id", 
        date,
        time,
        notes,
        status: "scheduled",
        createdAt: new Date().toISOString(),
      });
      toast.success("Appointment booked successfully!");
      setSelectedAdvisor(null);
    } catch (error) {
      toast.error("Failed to book appointment");
      console.error(error);
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
            Get personalized advice from certified financial experts
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
            {/* {financialHealth ? (
          <FinancialHealthCard health={financialHealth} />
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p>Financial health data not available</p>
          </div>
        )} */}

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">
                Upcoming Appointments
              </h2>
              {appointments.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  No upcoming appointments
                </p>
              ) : (
                <div className="space-y-4">
                  {appointments.map((appointment) => {
                    const advisor = advisors.find(
                      (a) => a.id === appointment.advisorId
                    );
                    return (
                      <div
                        key={appointment.id}
                        className="border-b pb-4 last:border-b-0"
                      >
                        <p className="font-medium">{advisor?.name}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(appointment.date).toLocaleDateString()} at{" "}
                          {appointment.time}
                        </p>
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
