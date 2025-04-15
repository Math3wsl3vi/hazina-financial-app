export interface SavingsEntry {
    id: string;
    userId: string;
    amount: number;
    category: string;
    date: string;
    notes?: string | '';
    createdAt: Date;
  }