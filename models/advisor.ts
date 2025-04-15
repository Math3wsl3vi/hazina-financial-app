export interface Appointment {
    id: string;
    advisorId: string;
    userId: string;
    date: string;
    time: string;
    notes: string;
    status: 'scheduled' | 'completed' | 'cancelled';
    createdAt: Date;
  }