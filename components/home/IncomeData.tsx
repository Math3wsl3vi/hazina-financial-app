'use client'

import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

const IncomeData = () => {
  const [showBalance, setShowBalance] = useState(true)

  const toggleVisibility = () => setShowBalance(!showBalance)

  return (
    <div className='flex flex-col gap-4 p-4 bg-gray-800 m-4 rounded-2xl shadow-lg'>
      {/* Balance Section */}
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-md font-medium text-gray-400 font-poppins'>Balance</h1>
          <p className='text-2xl font-semibold text-white font-poppins'>
            {showBalance ? 'Ksh: 14,000' : '••••••'}
          </p>
        </div>
        <button onClick={toggleVisibility} className='text-white'>
          {showBalance ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {/* Income & Expenses */}
      <div className='flex justify-between gap-4 w-full'>
        <div className='flex-1 bg-gray-700 rounded-xl p-4 flex flex-col items-center shadow-sm'>
          <h1 className='text-sm text-gray-300 font-poppins'>Income</h1>
          <p className='text-lg font-semibold text-green-400 font-poppins'>Ksh: 30,000</p>
        </div>
        <div className='flex-1 bg-gray-700 rounded-xl p-4 flex flex-col items-center shadow-sm'>
          <h1 className='text-sm text-gray-300 font-poppins'>Expenses</h1>
          <p className='text-lg font-semibold text-red-400 font-poppins'>Ksh: 16,000</p>
        </div>
      </div>    
    </div>
  )
}

export default IncomeData
