// types.ts
export type Frequency = 'daily' | 'weekly' | 'monthly';
export type InvestmentType = 'local' | 'global';
export type RiskLevel = 'low' | 'medium' | 'high';

export interface SavingsEntry {
  amount: number;
  category: string;
  date: string;
}

export interface InvestmentEntry {
  amount: number;
  frequency: Frequency;
  investmentType: InvestmentType;
  riskLevel: RiskLevel;
  id: string;
  userId: string;
  type: 'local' | 'global' | 'real-estate' | 'crypto' | 'other';
  name: string;
  date: string;
  returnRate?: number;
  notes?: string | null;
  createdAt: string;
}

export interface SavingsEntry {
    id: string;
    amount: number;
    category: string;
    date: string;
    notes?: string | '';
  }
  
  export type SavingsCategory =
    | 'General'
    | 'Emergency Fund'
    | 'Vacation'
    | 'Retirement'
    | 'Education'
    | 'Investment'
    | 'Other';

    export type DebtRepaymentStrategy = 
  | 'avalanche' 
  | 'snowball' 
  | 'consolidation';

export interface DebtEntry {
  id: string;
  name: string;
  amount: number;
  interestRate: number;
  minimumPayment: number;
  dueDate: string;
  strategy: DebtRepaymentStrategy;
  amountPaid: number;
  notes?: string;
}

export interface DebtRange {
  label: string;
  min: number;
  max: number;
}

export interface Advisor {
    id: string;
    name: string;
    specialization: string[];
    credentials: string;
    experience: number;
    rating: number;
    languages: string[];
    availability: Availability[];
    bio: string;
    imageUrl: string;
  }
  
  export interface Availability {
    date: string;
    slots: TimeSlot[];
  }
  
  export interface TimeSlot {
    time: string;
    booked: boolean;
  }
  
  export interface Appointment {
    id: string;
    advisorId: string;
    userId: string;
    date: string;
    time: string;
    notes: string;
    status: 'scheduled' | 'completed' | 'cancelled';
  }
  
  export interface FinancialHealth {
    score: number;
    debtToIncome: number;
    savingsRate: number;
    investmentDiversity: number;
    lastUpdated: string;
  }

  export interface Availability {
    date: string; // YYYY-MM-DD format
    slots: TimeSlot[];
  }
  
  export interface TimeSlot {
    start: string; // HH:MM format (24-hour)
    end: string;
    booked: boolean;
  }
  
  export interface CalendarDay {
    date: Date;
    isCurrentMonth: boolean;
    isToday: boolean;
    hasAvailability: boolean;
  }