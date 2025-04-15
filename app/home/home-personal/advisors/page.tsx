"use client";
import AdvisorCard from '@/components/advisor/AdvisorCard';
import BookingModal from '@/components/advisor/BookingModal';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdvisors } from '@/hooks/useAdvisor';
import { useAppointments } from '@/hooks/useAppointments';
import { useFinancialHealth } from '@/hooks/useFinancialHealth';
import { Advisor } from '@/lib/types';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function AdvisorPage() {
  const { advisors, loading: advisorsLoading } = useAdvisors();
  const { appointments, loading: appointmentsLoading, bookAppointment } = useAppointments();
  const { loading: healthLoading } = useFinancialHealth();
  const [selectedAdvisor, setSelectedAdvisor] = useState<Advisor | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState<string>('');

  const handleBookAppointment = (advisor: Advisor) => {
    setSelectedAdvisor(advisor);
  };

  const handleConfirmBooking = async (date: string, time: string, notes: string) => {
    if (!selectedAdvisor) return;
    
    try {
      await bookAppointment({
        advisorId: selectedAdvisor.id,
        advisorName: selectedAdvisor.name,
        userId: 'current-user-id', // Will be replaced by auth context
        date,
        time,
        notes,
        status: 'scheduled',
        createdAt: new Date().toISOString()
      });
      toast.success('Appointment booked successfully!');
      setSelectedAdvisor(null);
    } catch (error) {
      toast.error('Failed to book appointment');
      console.error(error);
    }
  };

  const filteredAdvisors = advisors.filter(advisor => {
    const matchesSearch = advisor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         advisor.bio.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialization = specializationFilter === '' || 
                                 advisor.specialization.includes(specializationFilter);
    
    return matchesSearch && matchesSpecialization;
  });

  const specializations = Array.from(
    new Set(advisors.flatMap(advisor => advisor.specialization))
  );

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
          <h1 className="text-3xl font-bold text-gray-900">Hazina Advisor Hub</h1>
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
              <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
              {appointments.length === 0 ? (
                <p className="text-gray-500 text-sm">No upcoming appointments</p>
              ) : (
                <div className="space-y-4">
                  {appointments.map(appointment => {
                    const advisor = advisors.find(a => a.id === appointment.advisorId);
                    return (
                      <div key={appointment.id} className="border-b pb-4 last:border-b-0">
                        <p className="font-medium">{advisor?.name}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="w-full md:w-1/2">
                  <Label htmlFor="search" className="sr-only">Search</Label>
                  <Input
                    type="text"
                    id="search"
                    placeholder="Search advisors..."
                    className="w-full border border-gray-300 rounded-md py-2 px-4"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <Label htmlFor="specialization" className="sr-only">Specialization</Label>
                  <select
                    id="specialization"
                    className="w-full border border-gray-300 rounded-md py-2 px-4"
                    value={specializationFilter}
                    onChange={(e) => setSpecializationFilter(e.target.value)}
                  >
                    <option value="">All Specializations</option>
                    {specializations.map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {filteredAdvisors.length === 0 ? (
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                  <p className="text-gray-500">No advisors match your search criteria</p>
                </div>
              ) : (
                filteredAdvisors.map(advisor => (
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
      </div>

      {selectedAdvisor && (
        <BookingModal
          advisor={selectedAdvisor}
          onClose={() => setSelectedAdvisor(null)}
          onConfirm={handleConfirmBooking}
        />
      )}

      <div className='h-[75px]'></div>
    </div>
  );
}