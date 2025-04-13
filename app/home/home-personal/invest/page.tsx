'use client'
import InvestmentForm from '@/components/invest/InvestmentForm';
import InvestmentList from '@/components/invest/InvestmentList';
import { InvestmentEntry } from '@/lib/types';
import { useState, useEffect } from 'react';

export default function Home() {
  const [investments, setInvestments] = useState<InvestmentEntry[]>([]);

  // Load data from localStorage
  useEffect(() => {
    const savedInvestments = localStorage.getItem('hazina-investments');
    if (savedInvestments) setInvestments(JSON.parse(savedInvestments));
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('hazina-investments', JSON.stringify(investments));
  }, [investments]);

  const handleInvest = (newInvestment: InvestmentEntry) => {
    setInvestments([...investments, newInvestment]);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-4 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="space-y-8">
          <InvestmentForm onInvest={handleInvest} />
          <InvestmentList investments={investments} />
        </div>
      </div>
      <div className='h-[75px]'></div>
    </div>
  );
}
