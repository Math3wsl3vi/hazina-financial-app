import { SavingsCategory, SavingsEntry } from '@/lib/types';
import { useState, useEffect } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

// Interface for storing savings history in local storage
interface SavingsRecord {
  date: string;
}

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
  const [streak, setStreak] = useState<number>(0);
  const [streakBroken, setStreakBroken] = useState<boolean>(false);
  const [savingsHistory, setSavingsHistory] = useState<SavingsRecord[]>([]);

  // Load savings history from local storage on mount
  useEffect(() => {
    const storedHistory = localStorage.getItem("savingsHistory");
    if (storedHistory) {
      const history: SavingsRecord[] = JSON.parse(storedHistory);
      setSavingsHistory(history);
      calculateStreak(history);
    }
  }, []);

  // Save savings history to local storage whenever it updates
  useEffect(() => {
    localStorage.setItem("savingsHistory", JSON.stringify(savingsHistory));
    calculateStreak(savingsHistory);
  }, [savingsHistory]);

  // Function to calculate streak and check if it's broken
  const calculateStreak = (history: SavingsRecord[]) => {
    if (history.length === 0) {
      setStreak(0);
      setStreakBroken(false);
      return;
    }

    // Sort history by date (newest first)
    const sortedHistory = history
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    let currentStreak = 1;
    let streakIsBroken = false;
    const now = new Date();
    const oneDayInMs = 24 * 60 * 60 * 1000; // 1 day in milliseconds

    // Remove duplicates by date (keep only the latest entry per day)
    const uniqueDates = Array.from(new Set(sortedHistory.map(record => record.date.split('T')[0])))
      .map(date => sortedHistory.find(record => record.date.split('T')[0] === date)!);

    for (let i = 0; i < uniqueDates.length - 1; i++) {
      const currentDate = new Date(uniqueDates[i].date);
      const nextDate = new Date(uniqueDates[i + 1].date);

      // Check if the current savings entry is within 1 day of the previous one
      const timeDiff = currentDate.getTime() - nextDate.getTime();
      if (timeDiff <= oneDayInMs * 1.1) { // Allow 10% buffer for flexibility
        currentStreak++;
      } else {
        break;
      }

      // Check if the streak is broken by comparing the latest entry to now
      const timeSinceLastEntry = now.getTime() - currentDate.getTime();
      if (timeSinceLastEntry > oneDayInMs * 1.1) {
        streakIsBroken = true;
      }
    }

    setStreak(currentStreak);
    setStreakBroken(streakIsBroken);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    const savingsData = {
      amount: parseFloat(amount),
      category,
      date,
      notes: notes.trim() || ''
    };

    // Add the new savings entry to history
    const newRecord: SavingsRecord = {
      date: savingsData.date,
    };
    setSavingsHistory((prev) => [...prev, newRecord]);

    onSave(savingsData);

    // Reset form
    setAmount('');
    setNotes('');
    setCategory('General');
    setDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <div className="space-y-4 font-poppins">
      {/* Streak Display */}
      <div
        className={`rounded-xl p-6 shadow-sm transition-all duration-300 ${
          streakBroken
            ? "bg-red-50 border border-red-200"
            : "bg-blue-50 border border-blue-200"
        }`}
      >
        <div className="flex items-center gap-3">
          <span
            className={`text-2xl ${
              streakBroken ? "text-red-500" : "text-blue-600"
            }`}
          >
            {streakBroken ? "⚠️" : "💰"}
          </span>
          <h3 className="text-xl font-semibold text-gray-800">
            Your Daily Savings Streak: {streak}
          </h3>
        </div>
        {streakBroken ? (
          <p className="mt-3 text-sm text-red-700">
            Streak Broken! You missed a daily savings entry. Start again and
            build that habit 💪
          </p>
        ) : (
          <p className="mt-3 text-sm text-blue-700">
            Awesome!{" You've"} saved every day. Keep it up and watch your wealth
            grow 📈
          </p>
        )}
      </div>

      {/* Savings Form */}
      <div className="bg-blue-50 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Add New Savings</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700"
            >
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
            <Label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
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
            <Label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700"
            >
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
            <Label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700"
            >
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
            className="w-full bg-black text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out"
          >
            Add Savings
          </button>
        </form>
      </div>
    </div>
  );
}