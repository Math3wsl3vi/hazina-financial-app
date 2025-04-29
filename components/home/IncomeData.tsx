"use client";

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { db } from '@/configs/firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';

interface BudgetTotals {
  income: number;
  expenses: number;
  balance: number;
  userId: string;
}

const IncomeData = () => {
  const [showBalance, setShowBalance] = useState(true);
  const [budgetTotals, setBudgetTotals] = useState<BudgetTotals>({
    income: 0,
    expenses: 0,
    balance: 0,
    userId: '',
  });
  const { currentUser } = useAuth();

  const toggleVisibility = () => setShowBalance(!showBalance);

  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = onSnapshot(doc(db, 'budgetTotals', currentUser.uid), (doc) => {
      if (doc.exists()) {
        setBudgetTotals(doc.data() as BudgetTotals);
      } else {
        // Set default values if no data exists
        setBudgetTotals({
          income: 0,
          expenses: 0,
          balance: 0,
          userId: currentUser.uid,
        });
      }
    }, (error) => {
      console.error('Error fetching budget totals:', error);
    });

    return () => unsubscribe();
  }, [currentUser]);

  return (
    <div className='flex flex-col gap-4 p-6 m-4 mt-10 rounded-2xl shadow-lg border border-green-100 bg-blue-50'>
      {/* Balance Section */}
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-md font-medium text-indigo-300 font-poppins'>Total Balance</h1>
          <p className='text-2xl font-semibold text-black font-poppins'>
            {showBalance ? `Ksh: ${budgetTotals.balance.toLocaleString()}` : '••••••'}
          </p>
        </div>
        <button 
          onClick={toggleVisibility} 
          className='text-blue-300 hover:text-blue-400 transition-colors'
          aria-label={showBalance ? 'Hide balance' : 'Show balance'}
        >
          {showBalance ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {/* Income & Expenses */}
      <div className='flex justify-between gap-4 w-full'>
        <div className='flex-1 bg-gradient-to-br from-green-100/40 to-emerald-50/70 rounded-xl p-4 flex flex-col items-center shadow-sm border border-emerald-900/30'>
          <h1 className='text-sm text-emerald-300 font-poppins'>Income</h1>
          <p className='text-lg font-semibold text-emerald-400 font-poppins'>
            + Ksh: {budgetTotals.income.toLocaleString()}
          </p>
        </div>
        <div className='flex-1 bg-gradient-to-br from-red-100/40 to-rose-50/70 rounded-xl p-4 flex flex-col items-center shadow-sm border border-rose-900/30'>
          <h1 className='text-sm text-rose-300 font-poppins'>Expenses</h1>
          <p className='text-lg font-semibold text-rose-400 font-poppins'>
            - Ksh: {budgetTotals.expenses.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default IncomeData;