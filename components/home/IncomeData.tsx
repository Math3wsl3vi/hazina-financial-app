'use client'

import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

const IncomeData = () => {
  const [showBalance, setShowBalance] = useState(true)

  const toggleVisibility = () => setShowBalance(!showBalance)

  return (
    <div className='flex flex-col gap-4 p-6 bg-indigo-950/80 m-4 rounded-2xl shadow-lg border border-indigo-900/50 backdrop-blur-sm'>
      {/* Balance Section */}
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-md font-medium text-indigo-300 font-poppins'>Total Balance</h1>
          <p className='text-2xl font-semibold text-white font-poppins'>
            {showBalance ? 'Ksh: 14,000' : '••••••'}
          </p>
        </div>
        <button 
          onClick={toggleVisibility} 
          className='text-indigo-300 hover:text-white transition-colors'
          aria-label={showBalance ? 'Hide balance' : 'Show balance'}
        >
          {showBalance ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {/* Income & Expenses */}
      <div className='flex justify-between gap-4 w-full'>
        <div className='flex-1 bg-gradient-to-br from-emerald-900/40 to-emerald-950/70 rounded-xl p-4 flex flex-col items-center shadow-sm border border-emerald-900/30'>
          <h1 className='text-sm text-emerald-300 font-poppins'>Income</h1>
          <p className='text-lg font-semibold text-emerald-400 font-poppins'>+ Ksh: 30,000</p>
        </div>
        <div className='flex-1 bg-gradient-to-br from-rose-900/40 to-rose-950/70 rounded-xl p-4 flex flex-col items-center shadow-sm border border-rose-900/30'>
          <h1 className='text-sm text-rose-300 font-poppins'>Expenses</h1>
          <p className='text-lg font-semibold text-rose-400 font-poppins'>- Ksh: 16,000</p>
        </div>
      </div>    
    </div>
  )
}

export default IncomeData