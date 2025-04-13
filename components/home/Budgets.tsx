'use client'
import React, { useState } from 'react'
import Image from 'next/image'

const budgetsData = [
  {
    title: 'Needs',
    percentage: 50,
    allocated: 25000,
    spent: 18000,
    icon: '/images/needs.png',
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
      <div className='flex justify-between items-center'>
        <h1 className='text-xl font-semibold font-poppins text-gray-800'>Budgets</h1>
        <button className='border border-gray-300 p-2 rounded-full px-3 font-poppins text-xs'>Show all</button>
      </div>

      <div className='mt-5 flex flex-col gap-4'>
        {budgetsData.map((category, index) => {
          const progress = (category.spent / category.allocated) * 100

          return (
            <div
              key={category.title}
              className='bg-slate-100 p-4 rounded-2xl shadow-sm'
            >
              <div
                className='flex items-center justify-between cursor-pointer'
                onClick={() => toggleSubcategories(index)}
              >
                <div className='flex items-center gap-4'>
                  <div className='bg-white rounded-xl w-14 h-14 flex items-center justify-center'>
                    <Image src={category.icon} alt={category.title} width={30} height={30} />
                  </div>
                  <div>
                    <h2 className='font-poppins font-medium text-lg'>{category.title} ({category.percentage}%)</h2>
                    <p className='text-gray-500 text-sm font-poppins'>
                      Ksh {category.spent} / {category.allocated}
                    </p>
                    <div className='w-full bg-gray-300 h-2 rounded-full mt-1'>
                      <div
                        className='bg-blue-600 h-2 rounded-full'
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
                <span className='text-sm text-blue-600 font-poppins'>
                  {openIndex === index ? 'Hide' : 'View'}
                </span>
              </div>

              {openIndex === index && (
                <div className='mt-3 ml-16'>
                  {category.subcategories.map((sub, i) => (
                    <div key={i} className='py-1 flex justify-between border-b border-dashed text-sm'>
                      <span className='font-poppins text-gray-700 text-sm'>{sub.title}</span>
                      <span className='text-gray-500'>Ksh {sub.spent}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
      <div className='h-[75px]'></div>
    </div>
  )
}

export default Budgets
