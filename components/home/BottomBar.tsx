import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const BottomBar = () => {
  return (
    <div className='flex items-center justify-between md:px-10 px-5 py-5 bg-slate-50 fixed bottom-0 w-full md:hidden '>
        <Link href='/home/home-personal' className='flex items-center justify-center flex-col gap-2 cursor-pointer'>
            <Image src='/images/budget.png' alt='budget' width={20} height={20}/>
            <h1 className='font-poppins text-sm font-semibold'>Budget</h1>
        </Link>
      <Link href='/home/home-personal/savings' className='flex items-center justify-center flex-col gap-2 cursor-pointer'>
            <Image src='/images/piggy-bank.png' alt='budget' width={20} height={20}/>
            <h1 className='font-poppins text-sm font-semibold'>Savings</h1>
        </Link>
      <Link href='/home/home-personal/invest' className='flex items-center justify-center flex-col gap-2 cursor-pointer'>
            <Image src='/images/profits.png' alt='budget' width={20} height={20}/>
            <h1 className='font-poppins text-sm font-semibold'>Invest</h1>
        </Link>
      <Link href='/home/home-personal/debt' className='flex items-center justify-center flex-col gap-2 cursor-pointer'>
            <Image src='/images/debt.png' alt='budget' width={20} height={20}/>
            <h1 className='font-poppins text-sm font-semibold'>Debt</h1>
        </Link>
      <Link href='/home/home-personal/advisors' className='flex items-center justify-center flex-col gap-2 cursor-pointer'>
            <Image src='/images/consulting.png' alt='budget' width={20} height={20}/>
            <h1 className='font-poppins text-sm font-semibold'>Advisors</h1>
        </Link>
    </div>
  )
}

export default BottomBar