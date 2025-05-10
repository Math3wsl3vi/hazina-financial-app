"use client";

import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy, Timestamp, deleteDoc, doc, where } from 'firebase/firestore';
import { db } from '@/configs/firebaseConfig';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

interface FinancialRecord {
  id: string;
  type: 'income' | 'expense';
  note: string;
  amount: number;
  createdAt?: Timestamp;
  userId: string;
}

const TrackerPage = () => {
  const [incomeNote, setIncomeNote] = useState('');
  const [incomeAmount, setIncomeAmount] = useState('');
  const [incomeError, setIncomeError] = useState('');
  const [incomeSuccess, setIncomeSuccess] = useState('');

  const [expenseNote, setExpenseNote] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseError, setExpenseError] = useState('');
  const [expenseSuccess, setExpenseSuccess] = useState('');

  const [incomeRecords, setIncomeRecords] = useState<FinancialRecord[]>([]);
  const [expenseRecords, setExpenseRecords] = useState<FinancialRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const { currentUser, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;

    console.log("Auth state:", currentUser ? `User: ${currentUser.uid}` : "No user");

    if (!currentUser) {
      setLoading(false);
      return;
    }

    try {
      const recordsQuery = query(
        collection(db, 'financialRecords'),
        where('userId', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      );

      console.log("Setting up Firebase listener for:", currentUser.uid);

      const unsubscribe = onSnapshot(recordsQuery, (snapshot) => {
        console.log(`Received ${snapshot.docs.length} records from Firestore`);

        const records: FinancialRecord[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            type: data.type,
            note: data.note,
            amount: data.amount,
            createdAt: data.createdAt,
            userId: data.userId
          } as FinancialRecord;
        });

        const incomes = records.filter((record) => record.type === 'income');
        const expenses = records.filter((record) => record.type === 'expense');

        console.log(`Filtered ${incomes.length} income records and ${expenses.length} expense records`);

        setIncomeRecords(incomes);
        setExpenseRecords(expenses);
        setLoading(false);
      }, (error) => {
        console.error('Error fetching records:', error);
        setLoading(false);
      });

      return () => {
        console.log("Unsubscribing from Firebase listener");
        unsubscribe();
      };
    } catch (error) {
      console.error("Error setting up Firebase listener:", error);
      setLoading(false);
    }
  }, [currentUser, authLoading]);

  const handleAddIncome = async (e: React.FormEvent) => {
    e.preventDefault();
    setIncomeError('');
    setIncomeSuccess('');

    if (!currentUser) {
      setIncomeError('You must be logged in to add income.');
      return;
    }

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
      console.log("Adding income record:", { note: incomeNote, amount });

      await addDoc(collection(db, 'financialRecords'), {
        type: 'income',
        note: incomeNote,
        amount: amount,
        userId: currentUser.uid,
        createdAt: serverTimestamp(),
      });

      setIncomeSuccess('Income added successfully!');
      setIncomeNote('');
      setIncomeAmount('');
    } catch (error) {
      console.error('Error adding income:', error);
      setIncomeError('Failed to add income. Please try again.');
    }
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setExpenseError('');
    setExpenseSuccess('');

    if (!currentUser) {
      setExpenseError('You must be logged in to add expense.');
      return;
    }

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
      console.log("Adding expense record:", { note: expenseNote, amount });

      await addDoc(collection(db, 'financialRecords'), {
        type: 'expense',
        note: expenseNote,
        amount: amount,
        userId: currentUser.uid,
        createdAt: serverTimestamp(),
      });

      setExpenseSuccess('Expense added successfully!');
      setExpenseNote('');
      setExpenseAmount('');
    } catch (error) {
      console.error('Error adding expense:', error);
      setExpenseError('Failed to add expense. Please try again.');
    }
  };

  const handleDeleteRecord = async (recordId: string) => {
    if (!currentUser) return;

    try {
      console.log("Deleting record:", recordId);
      await deleteDoc(doc(db, 'financialRecords', recordId));
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  // Helper function to format Timestamp to readable date
  const formatDate = (timestamp: Timestamp | null | undefined) => {
    if (!timestamp) {
      return "No date";
    }
    return timestamp.toDate().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (authLoading || loading) {
    return (
      <div className="p-4 flex justify-center items-center min-h-[300px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
          <p>Loading records...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="p-5 max-w-md mx-auto font-poppins">
        <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-700">
            Please sign in to track your income and expenses.
          </p>
        </div>
      </div>
    );
  }

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
              placeholder="Enter note (e.g., Revenue)"
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
            Add Income
          </Button>
        </form>
        <div className="mt-4">
          <h3 className="font-poppins text-sm font-medium mb-2">Recent Income</h3>
          {incomeRecords.length === 0 ? (
            <p className="text-sm text-gray-500">No income records yet.</p>
          ) : (
            <ul className="space-y-2">
              {incomeRecords.map((record) => (
                <li
                  key={record.id}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-2 bg-green-50 rounded-md"
                >
                  <div className="flex-1">
                    <span className="text-sm">{record.note || "Unnamed"}</span>
                    <p className="text-xs text-gray-500">
                      {formatDate(record.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                    <span className="text-sm font-semibold">
                      KES {(record.amount || 0).toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleDeleteRecord(record.id)}
                      className="bg-transparent text-red-500 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200 p-1 rounded-md h-6 w-6 flex items-center justify-center"
                      aria-label="Delete record"
                    >
                      -
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Expense Section */}
      <div>
        <h2 className="font-poppins text-xl font-semibold mb-4">Expense </h2>
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
              placeholder="Enter note (e.g., Advertising Cost)"
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
            Add Expense
          </Button>
        </form>
        <div className="mt-4">
          <h3 className="font-poppins text-sm font-medium mb-2">Recent Expenses</h3>
          {expenseRecords.length === 0 ? (
            <p className="text-sm text-gray-500">No expense records yet.</p>
          ) : (
            <ul className="space-y-2">
              {expenseRecords.map((record) => (
                <li
                  key={record.id}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-2 bg-red-50 rounded-md"
                >
                  <div className="flex-1">
                    <span className="text-sm">{record.note || "Unnamed"}</span>
                    <p className="text-xs text-gray-500">
                      {formatDate(record.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                    <span className="text-sm font-semibold">
                      KES {(record.amount || 0).toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleDeleteRecord(record.id)}
                      className="bg-transparent text-red-500 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200 p-1 rounded-md h-6 w-6 flex items-center justify-center"
                      aria-label="Delete record"
                    >
                      -
                    </button>
                  </div>
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