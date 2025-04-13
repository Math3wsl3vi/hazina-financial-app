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
  notes: string;
  date: string;
}

export interface SavingsEntry {
    id: string;
    amount: number;
    category: string;
    date: string;
    notes?: string;
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