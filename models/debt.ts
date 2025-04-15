export interface DebtEntry {
    id: string;
    userId: string;
    name: string;
    amount: number;
    interestRate: number;
    minimumPayment: number;
    dueDate: string;
    strategy: 'avalanche' | 'snowball' | 'consolidation';
    amountPaid: number;
    notes?: string;
    createdAt: Date;
  }