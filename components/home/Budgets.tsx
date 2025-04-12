import Image from 'next/image'
import React from 'react'

const Budgets = () => {
  return (
    <div className='p-4'>
        <div className='flex justify-between px-2'>
            <h1 className='text-gray-800 font-poppins'>Budgets</h1>
            <button className='border border-gray-300 p-2 rounded-full px-3 font-poppins text-sm'>Show all</button>
        </div>
        <div className='flex px-3 mt-5 justify-between'>
        <div className='border p-4 bg-slate-50 rounded-2xl w-[48%]'>
            <div className='p-3 bg-white rounded-xl w-16 h-16 flex items-center justify-center'>
            <Image src='/images/money.png' alt='money' width={30} height={30}/>
            </div>
            <h1 className='font-poppins mt-5'>Fees</h1>
            <p className='font-poppins text-gray-400'>Ksh: 10,000</p>
        </div>
        <div className='border p-4 bg-slate-50 rounded-2xl w-[48%]'>
            <div className='p-3 bg-white rounded-xl w-16 h-16 flex items-center justify-center'>
            <Image src='/images/money.png' alt='money' width={30} height={30}/>
            </div>
            <h1 className='font-poppins mt-5'>Fees</h1>
            <p className='font-poppins text-gray-400'>Ksh: 10,000</p>
        </div>
        </div>
    </div>
  )
}

export default Budgets