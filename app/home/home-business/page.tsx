"use client";
import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/configs/firebaseConfig';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface FinancialRecord {
  id: string;
  type: 'income' | 'expense';
  note: string;
  amount: number;
  createdAt: Timestamp 
}

const TrackerPage = () => {
  // State for Income form
  const [incomeNote, setIncomeNote] = useState('');
  const [incomeAmount, setIncomeAmount] = useState('');
  const [incomeError, setIncomeError] = useState('');
  const [incomeSuccess, setIncomeSuccess] = useState('');

  // State for Expense form
  const [expenseNote, setExpenseNote] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseError, setExpenseError] = useState('');
  const [expenseSuccess, setExpenseSuccess] = useState('');

  // State to store fetched records
  const [incomeRecords, setIncomeRecords] = useState<FinancialRecord[]>([]);
  const [expenseRecords, setExpenseRecords] = useState<FinancialRecord[]>([]);

  // Fetch records from Firestore in real-time
  useEffect(() => {
    // Query for income records, ordered by createdAt (newest first)
    const incomeQuery = query(
      collection(db, 'financialRecords'),
      orderBy('createdAt', 'desc')
    );

    // Real-time listener for records
    const unsubscribe = onSnapshot(incomeQuery, (snapshot) => {
      const records: FinancialRecord[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FinancialRecord[];

      // Filter for income and expense
      setIncomeRecords(records.filter((record) => record.type === 'income'));
      setExpenseRecords(records.filter((record) => record.type === 'expense'));
    }, (error) => {
      console.error('Error fetching records:', error);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  // Function to handle adding income
  const handleAddIncome = async (e: React.FormEvent) => {
    e.preventDefault();
    setIncomeError('');
    setIncomeSuccess('');

    if (!incomeNote || !incomeAmount) {
      setIncomeError('Please fill in all fields');
      return;
    }

    const amount = Number(incomeAmount);
    if (isNaN(amount) || amount <= 0) {
      setIncomeError('Amount must be a positive number');
      return;
    }

    try {
      await addDoc(collection(db, 'financialRecords'), {
        type: 'income',
        note: incomeNote,
        amount: amount,
        createdAt: serverTimestamp(),
      });
      setIncomeSuccess('Income added successfully!');
      setIncomeNote('');
      setIncomeAmount('');
    } catch (error) {
      setIncomeError('Failed to add income. Please try again.');
      console.error('Error adding income:', error);
    }
  };

  // Function to handle adding expense
  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setExpenseError('');
    setExpenseSuccess('');

    if (!expenseNote || !expenseAmount) {
      setExpenseError('Please fill in all fields');
      return;
    }

    const amount = Number(expenseAmount);
    if (isNaN(amount) || amount <= 0) {
      setExpenseError('Amount must be a positive number');
      return;
    }

    try {
      await addDoc(collection(db, 'financialRecords'), {
        type: 'expense',
        note: expenseNote,
        amount: amount,
        createdAt: serverTimestamp(),
      });
      setExpenseSuccess('Expense added successfully!');
      setExpenseNote('');
      setExpenseAmount('');
    } catch (error) {
      setExpenseError('Failed to add expense. Please try again.');
      console.error('Error adding expense:', error);
    }
  };

  return (
    <div className="p-5 max-w-md mx-auto font-poppins">
      {/* Income Section */}
      <div className="mb-8">
        <h2 className="font-poppins text-xl font-semibold mb-4">Income</h2>
        <form onSubmit={handleAddIncome} className="space-y-4">
          <div>
            <Label htmlFor="incomeNote" className="block text-sm font-medium">
              Note
            </Label>
            <Input
              id="incomeNote"
              type="text"
              value={incomeNote}
              onChange={(e) => setIncomeNote(e.target.value)}
              className="w-full"
              placeholder="Enter note (e.g., Salary)"
            />
          </div>
          <div>
            <Label htmlFor="incomeAmount" className="block text-sm font-medium">
              Amount
            </Label>
            <Input
              id="incomeAmount"
              type="number"
              step="0.01"
              min="0"
              value={incomeAmount}
              onChange={(e) => setIncomeAmount(e.target.value)}
              className="w-full"
              placeholder="Enter amount"
            />
          </div>
          {incomeError && (
            <p className="text-xs text-red-500">{incomeError}</p>
          )}
          {incomeSuccess && (
            <p className="text-xs text-green-500">{incomeSuccess}</p>
          )}
          <Button type="submit" className="w-full">
            Add
          </Button>
        </form>

        {/* Display Income Records */}
        <div className="mt-4">
          <h3 className="font-poppins text-sm font-medium mb-2">Recent Income</h3>
          {incomeRecords.length === 0 ? (
            <p className="text-sm text-gray-500">No income records yet.</p>
          ) : (
            <ul className="space-y-2">
              {incomeRecords.map((record) => (
                <li
                  key={record.id}
                  className="flex justify-between p-2 bg-gray-100 rounded-md"
                >
                  <span className="text-sm">{record.note}</span>
                  <span className="text-sm font-semibold">
                    KES {record.amount.toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Expense Section */}
      <div>
        <h2 className="font-poppins text-xl font-semibold mb-4">Expense</h2>
        <form onSubmit={handleAddExpense} className="space-y-4">
          <div>
            <Label htmlFor="expenseNote" className="block text-sm font-medium">
              Note
            </Label>
            <Input
              id="expenseNote"
              type="text"
              value={expenseNote}
              onChange={(e) => setExpenseNote(e.target.value)}
              className="w-full"
              placeholder="Enter note (e.g., Groceries)"
            />
          </div>
          <div>
            <Label htmlFor="expenseAmount" className="block text-sm font-medium">
              Amount
            </Label>
            <Input
              id="expenseAmount"
              type="number"
              step="0.01"
              min="0"
              value={expenseAmount}
              onChange={(e) => setExpenseAmount(e.target.value)}
              className="w-full"
              placeholder="Enter amount"
            />
          </div>
          {expenseError && (
            <p className="text-xs text-red-500">{expenseError}</p>
          )}
          {expenseSuccess && (
            <p className="text-xs text-green-500">{expenseSuccess}</p>
          )}
          <Button type="submit" className="w-full">
            Add
          </Button>
        </form>

        {/* Display Expense Records */}
        <div className="mt-4">
          <h3 className="font-poppins text-sm font-medium mb-2">Recent Expenses</h3>
          {expenseRecords.length === 0 ? (
            <p className="text-sm text-gray-500">No expense records yet.</p>
          ) : (
            <ul className="space-y-2">
              {expenseRecords.map((record) => (
                <li
                  key={record.id}
                  className="flex justify-between p-2 bg-gray-100 rounded-md"
                >
                  <span className="text-sm">{record.note}</span>
                  <span className="text-sm font-semibold">
                    KES {record.amount.toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className='h-[105px]'></div>
    </div>
  );
};

export default TrackerPage;