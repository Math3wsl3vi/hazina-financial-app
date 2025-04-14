'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { ChevronDown, ChevronUp } from 'lucide-react'

const budgetsData = [
  {
    title: 'Needs',
    percentage: 50,
    allocated: 25000,
    spent: 18000,
    icon: '/images/needs.png',
    color: 'bg-teal-100 border-teal-300 text-teal-800',
    progressColor: 'bg-teal-500',
    subcategories: [
      { title: 'Rent & Utilities', spent: 10000 },
      { title: 'Food', spent: 5000 },
      { title: 'Transport', spent: 3000 }
    ]
  },
  {
    title: 'Wants',
    percentage: 30,
    allocated: 15000,
    spent: 7000,
    icon: '/images/need.png',
    color: 'bg-amber-100 border-amber-300 text-amber-800',
    progressColor: 'bg-amber-500',
    subcategories: [
      { title: 'Subscriptions', spent: 3000 },
      { title: 'Shopping', spent: 4000 }
    ]
  },
  {
    title: 'Savings',
    percentage: 20,
    allocated: 10000,
    spent: 2000,
    icon: '/images/piggy-bank.png',
    color: 'bg-indigo-100 border-indigo-300 text-indigo-800',
    progressColor: 'bg-indigo-500',
    subcategories: [
      { title: 'MMF', spent: 1000 },
      { title: 'Emergency Fund', spent: 1000 }
    ]
  }
]

const Budgets = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleSubcategories = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className='p-4'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold font-poppins text-gray-800'>Budget Categories</h1>
        <button className='border border-blue-500 text-blue-500 hover:bg-blue-50 px-4 py-2 rounded-full font-poppins text-sm transition-colors'>
          View All
        </button>
      </div>

      <div className='flex flex-col gap-5'>
        {budgetsData.map((category, index) => {
          const progress = Math.min((category.spent / category.allocated) * 100, 100)
          const isOverBudget = category.spent > category.allocated

          return (
            <div
              key={category.title}
              className={`border rounded-2xl p-5 ${category.color} shadow-xs hover:shadow-sm transition-shadow`}
            >
              <div
                className='flex items-center justify-between cursor-pointer'
                onClick={() => toggleSubcategories(index)}
              >
                <div className='flex items-center gap-4 w-full'>
                  <div className={`rounded-xl w-16 h-16 flex items-center justify-center ${category.color.split(' ')[0]} border-2 ${category.color.split(' ')[1]}`}>
                    <Image 
                      src={category.icon} 
                      alt={category.title} 
                      width={32} 
                      height={32}
                      className='object-contain'
                    />
                  </div>
                  
                  <div className='flex-1'>
                    <div className='flex justify-between items-center'>
                      <h2 className='font-poppins font-bold text-lg'>{category.title}</h2>
                      <span className='text-sm font-medium'>
                        {category.spent.toLocaleString()}/{category.allocated.toLocaleString()} Ksh
                      </span>
                    </div>
                    
                    <div className='flex items-center gap-2 mt-1'>
                      <div className='w-full bg-white bg-opacity-70 h-3 rounded-full overflow-hidden'>
                        <div
                          className={`h-full rounded-full ${category.progressColor} ${isOverBudget ? '!bg-red-500' : ''}`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className='text-xs font-medium whitespace-nowrap'>
                        {category.percentage}%
                      </span>
                    </div>
                  </div>
                </div>

                <button className='ml-4 text-gray-500 hover:text-gray-700'>
                  {openIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>

              {openIndex === index && (
                <div className='mt-4 pl-20 space-y-3'>
                  {category.subcategories.map((sub, i) => (
                    <div key={i} className='flex justify-between items-center py-2 border-b border-gray-200 last:border-0'>
                      <span className='font-poppins text-gray-700'>{sub.title}</span>
                      <span className='font-medium'>
                        {sub.spent.toLocaleString()} Ksh
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Budgets