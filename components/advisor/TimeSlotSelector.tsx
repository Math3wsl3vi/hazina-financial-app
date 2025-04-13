import { Availability } from "@/lib/types";

interface TimeSlotSelectorProps {
  availability: Availability[];
  selectedDate: string | null;
  selectedTime: string | null;
  onTimeSelect: (time: string) => void;
}

export default function TimeSlotSelector({
  availability,
  selectedDate,
  selectedTime,
  onTimeSelect
}: TimeSlotSelectorProps) {
  const selectedDayAvailability = availability.find(avail => avail.date === selectedDate);

  if (!selectedDate || !selectedDayAvailability) {
    return (
      <div className="bg-white p-6 rounded-lg shadow text-center">
        <p className="text-gray-500">Please select a date to see available times</p>
      </div>
    );
  }

  const availableSlots = selectedDayAvailability.slots.filter(slot => !slot.booked);

  if (availableSlots.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow text-center">
        <p className="text-gray-500">No available time slots for this date</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4">
        Available times for {new Date(selectedDate).toLocaleDateString('en-US', { 
          weekday: 'long', 
          month: 'long', 
          day: 'numeric' 
        })}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {availableSlots.map((slot, idx) => (
          <button
            key={idx}
            onClick={() => onTimeSelect(slot.start)}
            className={`p-3 border rounded-md text-center transition-colors ${
              selectedTime === slot.start
                ? 'bg-blue-100 border-blue-500'
                : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}
          >
            {formatTime(slot.start)} - {formatTime(slot.end)}
          </button>
        ))}
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