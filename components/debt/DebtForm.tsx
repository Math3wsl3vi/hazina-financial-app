import { useState, useEffect } from 'react';
import StrategyInfo from './StrategyInfo';
import { DebtEntry, DebtRepaymentStrategy } from '@/lib/types';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

interface DebtFormProps {
  initialData?: Partial<DebtEntry>;
  onSubmit: (debt: Omit<DebtEntry, 'id'>) => void;
  onCancel?: () => void;
}

const defaultDebt: Omit<DebtEntry, 'id'> = {
  name: '',
  amount: 0,
  interestRate: 0,
  minimumPayment: 0,
  dueDate: new Date().toISOString().split('T')[0],
  strategy: 'avalanche',
  amountPaid: 0,
  notes: ''
};

export default function DebtForm({ initialData, onSubmit, onCancel }: DebtFormProps) {
  const [debt, setDebt] = useState<Omit<DebtEntry, 'id'>>({ ...defaultDebt, ...initialData });
  const [isEditing, setIsEditing] = useState(!!initialData);

  useEffect(() => {
    if (initialData) {
      setDebt({ ...defaultDebt, ...initialData });
      setIsEditing(true);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDebt({
      ...debt,
      [name]: name.includes('amount') || name.includes('Rate') || name.includes('Payment') 
        ? parseFloat(value) || 0
        : value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(debt);
    if (!isEditing) {
      setDebt(defaultDebt);
    }
  };

  const selectStrategy = (strategy: DebtRepaymentStrategy) => {
    setDebt({ ...debt, strategy });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md font-poppins">
      <h2 className="text-xl font-semibold mb-4">
        {isEditing ? 'Edit Debt' : 'Add New Debt'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="block text-sm font-medium text-gray-700">
              Debt Name
            </Label>
            <Input
              type="text"
              name="name"
              value={debt.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              required
            />
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700">
              Total Amount (Ksh)
            </Label>
            <Input
              type="number"
              name="amount"
              step="0.01"
              value={debt.amount === 0 ? '' : debt.amount}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              required
            />
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700">
              Interest Rate (%)
            </Label>
            <Input
              type="number"
              name="interestRate"
              max="100"
              step="0.01"
              value={debt.interestRate === 0? '':debt.interestRate}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              required
            />
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700">
              Minimum Payment (Ksh)
            </Label>
            <Input
              type="number"
              name="minimumPayment"
              step="0.01"
              value={debt.minimumPayment === 0? '':debt.minimumPayment}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              required
            />
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700">
              Due Date
            </Label>
            <Input
              type="date"
              name="dueDate"
              value={debt.dueDate}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              required
            />
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700">
              Amount Paid (Ksh)
            </Label>
            <Input
              type="number"
              name="amountPaid"
              step="0.01"
              value={debt.amountPaid === 0? '':debt.amountPaid}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              required
            />
          </div>
        </div>

        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-2">
            Repayment Strategy
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['avalanche', 'snowball', 'consolidation'] as DebtRepaymentStrategy[]).map((strategy) => (
              <StrategyInfo
                key={strategy}
                strategy={strategy}
                isActive={debt.strategy === strategy}
                onSelect={() => selectStrategy(strategy)}
              />
            ))}
          </div>
        </div>

        <div>
          <Label className="block text-sm font-medium text-gray-700">
            Notes (Optional)
          </Label>
          <Textarea
            name="notes"
            rows={3}
            value={debt.notes || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          />
        </div>

        <div className="flex justify-end space-x-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700"
          >
            {isEditing ? 'Update Debt' : 'Add Debt'}
          </button>
        </div>
      </form>
    </div>
  );
}