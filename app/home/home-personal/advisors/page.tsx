"use client"
import AdvisorCard from '@/components/advisor/AdvisorCard';
import BookingModal from '@/components/advisor/BookingModal';
import FinancialHealthCard from '@/components/advisor/FinancialHealthCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Advisor, Appointment, Availability, FinancialHealth, TimeSlot } from '@/lib/types';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';


const sampleAdvisors: Advisor[] = [
  {
    id: '1',
    name: 'Erick Kinuthia',
    specialization: ['Retirement Planning', 'Tax Strategies', 'Estate Planning'],
    credentials: 'CFP®, CPA',
    experience: 2,
    rating: 4.8,
    languages: ['English', 'Swahili'],
    availability: generateAvailability(30),
    bio: 'Certified Financial Planner with 2 years of experience helping clients achieve their retirement goals through comprehensive tax and estate planning strategies.',
    imageUrl: '/images/advisor1.jpg',
  },
  {
    id: '1',
    name: 'Erick Kinuthia',
    specialization: ['Retirement Planning', 'Tax Strategies', 'Estate Planning'],
    credentials: 'CFP®, CPA',
    experience: 2,
    rating: 4.8,
    languages: ['English', 'Swahili'],
    availability: generateAvailability(30),
    bio: 'Certified Financial Planner with 2 years of experience helping clients achieve their retirement goals through comprehensive tax and estate planning strategies.',
    imageUrl: '/images/advisor1.jpg',
  },
  // Add more advisors...
];

function generateAvailability(daysToGenerate: number): Availability[] {
  const availability: Availability[] = [];
  const now = new Date();
  
  for (let i = 1; i <= daysToGenerate; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() + i);
    
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    
    const dateString = format(date, 'yyyy-MM-dd');
    const slots: TimeSlot[] = [];
    
    // Generate morning slots
    for (let hour = 9; hour <= 11; hour++) {
      slots.push({
        start: `${hour}:00`,
        end: `${hour + 1}:00`,
        time: `${hour}:00 - ${hour + 1}:00`, // ← Added
        booked: Math.random() < 0.3
      });
      
    }
    
    // Generate afternoon slots
    for (let hour = 13; hour <= 16; hour++) {
      slots.push({
        start: `${hour}:00`,
        end: `${hour + 1}:00`,
        time: `${hour}:00 - ${hour + 1}:00`, // ← Added
        booked: Math.random() < 0.3
      });
      
    }
    
    availability.push({
      date: dateString,
      slots
    });
  }
  
  return availability;
}

const initialFinancialHealth: FinancialHealth = {
  score: 72,
  debtToIncome: 28,
  savingsRate: 18,
  investmentDiversity: 7,
  lastUpdated: new Date().toISOString(),
};

export default function AdvisorPage() {
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAdvisor, setSelectedAdvisor] = useState<Advisor | null>(null);
  const [financialHealth, setFinancialHealth] = useState<FinancialHealth>(initialFinancialHealth);
  const [searchTerm, setSearchTerm] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState<string>('');

  useEffect(() => {
    // In a real app, you would fetch advisors from an API
    setAdvisors(sampleAdvisors);
    
    // Load appointments from localStorage
    const savedAppointments = localStorage.getItem('hazina-appointments');
    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('hazina-appointments', JSON.stringify(appointments));
  }, [appointments]);

  const handleBookAppointment = (advisor: Advisor) => {
    setSelectedAdvisor(advisor);
  };

  const handleConfirmBooking = (date: string, time: string, notes: string) => {
    if (!selectedAdvisor) return;
    
    const newAppointment: Appointment = {
      id: uuidv4(),
      advisorId: selectedAdvisor.id,
      userId: 'current-user-id', // In a real app, use actual user ID
      date,
      time,
      notes,
      status: 'scheduled',
    };
    
    setAppointments([...appointments, newAppointment]);
    setSelectedAdvisor(null);
    console.log(setFinancialHealth)
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
            <FinancialHealthCard health={financialHealth} />
            
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