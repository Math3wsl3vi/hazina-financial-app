import { useState } from 'react';
import Calendar from './Calendar';
import TimeSlotSelector from './TimeSlotSelector';
import { Advisor } from '@/lib/types';
import { Textarea } from '../ui/textarea';

interface BookingModalProps {
  advisor: Advisor;
  onClose: () => void;
  onConfirm: (date: string, time: string, notes: string) => void;
}

export default function BookingModal({ advisor, onClose, onConfirm }: BookingModalProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [notes, setNotes] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<'date' | 'time' | 'details'>('date');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDate && selectedTime) {
      onConfirm(selectedDate, selectedTime, notes);
    }
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setCurrentStep('time');
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setCurrentStep('details');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold">Book with {advisor.name}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              &times;
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-between my-6">
            <div className={`flex-1 text-center ${currentStep === 'date' ? 'font-medium text-blue-600' : 'text-gray-500'}`}>
              1. Select Date
            </div>
            <div className={`flex-1 text-center ${currentStep === 'time' ? 'font-medium text-blue-600' : 'text-gray-500'}`}>
              2. Choose Time
            </div>
            <div className={`flex-1 text-center ${currentStep === 'details' ? 'font-medium text-blue-600' : 'text-gray-500'}`}>
              3. Confirm
            </div>
          </div>

          {currentStep === 'date' && (
            <Calendar 
              availability={advisor.availability} 
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
            />
          )}

          {currentStep === 'time' && (
            <div className="space-y-6">
              <button 
                onClick={() => setCurrentStep('date')}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to calendar
              </button>
              <TimeSlotSelector
                availability={advisor.availability}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onTimeSelect={handleTimeSelect}
              />
            </div>
          )}

          {currentStep === 'details' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <button 
                  onClick={() => setCurrentStep('time')}
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to time selection
                </button>
                
                <div className="bg-blue-50 p-4 rounded-md">
                  <h3 className="font-medium">Appointment Details</h3>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium">
                        {selectedDate && new Date(selectedDate).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Time</p>
                      <p className="font-medium">
                        {selectedTime && formatTime(selectedTime)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="notes" className="block font-medium mb-2">
                  What would you like to discuss? (Optional)
                </label>
                <Textarea
                  id="notes"
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="Briefly describe your financial questions or goals..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function formatTime(timeString: string): string {
  const [hours, minutes] = timeString.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}