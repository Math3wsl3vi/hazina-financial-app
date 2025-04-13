"use client"
import SavingsForm from '@/components/savings/SavingsForm';
import SavingsList from '@/components/savings/SavingsList';
import { SavingsEntry } from '@/lib/types';
import { useState, useEffect } from 'react';

import { v4 as uuidv4 } from 'uuid';

export default function SavingsPage() {
  const [savings, setSavings] = useState<SavingsEntry[]>([]);

  // Load savings from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('hazina-savings');
    if (saved) {
      setSavings(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage whenever savings change
  useEffect(() => {
    localStorage.setItem('hazina-savings', JSON.stringify(savings));
  }, [savings]);

  const handleSave = (newSaving: Omit<SavingsEntry, 'id'>) => {
    setSavings([...savings, { ...newSaving, id: uuidv4() }]);
  };

  const handleDelete = (id: string) => {
    setSavings(savings.filter((entry) => entry.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 font-poppins">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Hazina Savings</h1>
          <p className="mt-2 text-lg text-gray-600">
            Track your savings and watch your money grow
          </p>
        </div>

        <div className="space-y-8">
          <SavingsForm onSave={handleSave} />
          <SavingsList savings={savings} onDelete={handleDelete} />
        </div>
      </div>
      <div className='h-[75px]'></div>
    </div>
  );
}