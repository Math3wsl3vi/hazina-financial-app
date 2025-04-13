import { useState } from 'react';
import { addMonths, subMonths, format, isToday} from 'date-fns';
import { Availability, CalendarDay } from '@/lib/types';


interface CalendarProps {
  availability: Availability[];
  selectedDate: string | null;
  onDateSelect: (date: string) => void;
}

export default function Calendar({ availability, selectedDate, onDateSelect }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Generate days for the calendar view
  const generateCalendarDays = (): CalendarDay[] => {
    const days: CalendarDay[] = [];
    const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    
    // Add days from previous month
    const startDay = startDate.getDay();
    for (let i = 0; i < startDay; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() - (startDay - i));
      days.push({
        date,
        isCurrentMonth: false,
        isToday: isToday(date),
        hasAvailability: false
      });
    }

    // Add days for current month
    for (let i = 1; i <= endDate.getDate(); i++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
      const dateString = format(date, 'yyyy-MM-dd');
      const hasAvailability = availability.some(avail => avail.date === dateString && avail.slots.some(slot => !slot.booked));
      
      days.push({
        date,
        isCurrentMonth: true,
        isToday: isToday(date),
        hasAvailability
      });
    }

    // Add days from next month
    const endDay = endDate.getDay();
    for (let i = 1; i < 7 - endDay; i++) {
      const date = new Date(endDate);
      date.setDate(date.getDate() + i);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: isToday(date),
        hasAvailability: false
      });
    }

    return days;
  };

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const calendarDays = generateCalendarDays();

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <button
          onClick={prevMonth}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-lg font-semibold">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <button
          onClick={nextMonth}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="bg-gray-100 py-2 text-center text-xs font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {calendarDays.map((day, idx) => {
          const dateString = format(day.date, 'yyyy-MM-dd');
          const isSelected = selectedDate === dateString;
          
          return (
            <button
              key={idx}
              onClick={() => day.hasAvailability && onDateSelect(dateString)}
              disabled={!day.hasAvailability}
              className={`relative h-16 bg-white hover:bg-gray-50 focus:z-10 
                ${day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                ${isSelected ? 'bg-blue-50 border-2 border-blue-500' : ''}
                ${day.hasAvailability ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}
              `}
            >
              <time
                dateTime={format(day.date, 'yyyy-MM-dd')}
                className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full 
                  ${day.isToday ? 'bg-blue-600 text-white' : ''}
                  ${isSelected && !day.isToday ? 'text-blue-600' : ''}
                `}
              >
                {format(day.date, 'd')}
              </time>
              {day.hasAvailability && (
                <div className="mx-auto mt-1 h-1 w-1 rounded-full bg-blue-600"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}