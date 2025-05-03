import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Sidebar = () => {
  return (
    <div className='hidden md:flex flex-col justify-start gap-8 p-6 fixed top-0 left-0 h-full w-[200px] bg-slate-50 shadow-md mt-[70px]'>
      <Link href='/home/home-personal' className='flex items-center gap-3 cursor-pointer'>
        <Image src='/images/budget.png' alt='budget' width={20} height={20}/>
        <span className='font-poppins text-sm font-semibold'>Budget</span>
      </Link>
      <Link href='/home/home-personal/savings' className='flex items-center gap-3 cursor-pointer'>
        <Image src='/images/piggy-bank.png' alt='savings' width={20} height={20}/>
        <span className='font-poppins text-sm font-semibold'>Savings</span>
      </Link>
      <Link href='/home/home-personal/invest' className='flex items-center gap-3 cursor-pointer'>
        <Image src='/images/profits.png' alt='invest' width={20} height={20}/>
        <span className='font-poppins text-sm font-semibold'>Invest</span>
      </Link>
      <Link href='/home/home-personal/debt' className='flex items-center gap-3 cursor-pointer'>
        <Image src='/images/debt.png' alt='debt' width={20} height={20}/>
        <span className='font-poppins text-sm font-semibold'>Debt</span>
      </Link>
      <Link href='/home/home-personal/advisors' className='flex items-center gap-3 cursor-pointer'>
        <Image src='/images/consulting.png' alt='advisors' width={20} height={20}/>
        <span className='font-poppins text-sm font-semibold'>Advisors</span>
      </Link>
    </div>
  )
}

export default Sidebar
