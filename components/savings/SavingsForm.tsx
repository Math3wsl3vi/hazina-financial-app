import { SavingsCategory, SavingsEntry } from '@/lib/types';
import { useState } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

interface SavingsFormProps {
  onSave: (entry: Omit<SavingsEntry, 'id'>) => void;
}

const categories: SavingsCategory[] = [
  'General',
  'Emergency Fund',
  'Vacation',
  'Retirement',
  'Education',
  'Investment',
  'Other'
];

export default function SavingsForm({ onSave }: SavingsFormProps) {
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<SavingsCategory>('General');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    onSave({
      amount: parseFloat(amount),
      category,
      date,
      notes: notes.trim() ||''
    });

    // Reset form
    setAmount('');
    setNotes('');
    setCategory('General');
    setDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md font-poppins">
      <h2 className="text-xl font-semibold mb-4">Add New Savings</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Amount (Ksh)
          </Label>
          <Input
            type="number"
            id="amount"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
            required
          />
        </div>

        <div>
          <Label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </Label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as SavingsCategory)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Date
          </Label>
          <Input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
            required
          />
        </div>

        <div>
          <Label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notes (Optional)
          </Label>
          <Textarea
            id="notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out"
        >
          Add Savings
        </button>
      </form>
    </div>
  );
}