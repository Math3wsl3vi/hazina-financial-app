import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const BusinessBottomBar = () => {
  return (
    <div className='flex items-center justify-between md:px-10 fixed bottom-0 px-5 py-5 bg-slate-50  w-full md:hidden '>
        <Link href='/home/home-business' className='flex items-center justify-center flex-col gap-2 cursor-pointer'>
            <Image src='/images/tracker.png' alt='budget' width={20} height={20}/>
            <h1 className='font-poppins text-sm font-semibold'>Trackers</h1>
        </Link>
      <Link href='/home/home-business/invoice' className='flex items-center justify-center flex-col gap-2 cursor-pointer'>
            <Image src='/images/invoice.png' alt='budget' width={20} height={20}/>
            <h1 className='font-poppins text-sm font-semibold'>invoicing</h1>
        </Link>
      <Link href='/home/home-business/reports' className='flex items-center justify-center flex-col gap-2 cursor-pointer'>
            <Image src='/images/report.png' alt='budget' width={20} height={20}/>
            <h1 className='font-poppins text-sm font-semibold'>Reports</h1>
        </Link>
      <Link href='/home/home-business/inventory' className='flex items-center justify-center flex-col gap-2 cursor-pointer'>
            <Image src='/images/inventory.png' alt='budget' width={20} height={20}/>
            <h1 className='font-poppins text-sm font-semibold'>Inventory</h1>
        </Link>
      <Link href='/home/home-business/consultants' className='flex items-center justify-center flex-col gap-2 cursor-pointer'>
            <Image src='/images/consulting.png' alt='budget' width={20} height={20}/>
            <h1 className='font-poppins text-sm font-semibold'>Consultants</h1>
        </Link>
    </div>
  )
}

export default BusinessBottomBar