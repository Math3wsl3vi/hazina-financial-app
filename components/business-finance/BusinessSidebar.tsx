import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const BusinessSidebar = () => {
  return (
    <div className='hidden md:flex flex-col justify-start gap-8 p-6 absolute top-0 left-0 h-full w-[200px] bg-slate-50 shadow-md mt-[70px]'>
       <Link href='/home/home-business' className='flex items-center py-2 gap-3 cursor-pointer'>
            <Image src='/images/tracker.png' alt='budget' width={20} height={20}/>
            <h1 className='font-poppins text-sm font-semibold'>Trackers</h1>
        </Link>
      <Link href='/home/home-business/invoice' className='flex items-center py-2 gap-3 cursor-pointer'>
            <Image src='/images/invoice.png' alt='budget' width={20} height={20}/>
            <h1 className='font-poppins text-sm font-semibold'>invoicing</h1>
        </Link>
      <Link href='/home/home-business/reports' className='flex items-center py-2 gap-3 cursor-pointer'>
            <Image src='/images/report.png' alt='budget' width={20} height={20}/>
            <h1 className='font-poppins text-sm font-semibold'>Reports</h1>
        </Link>
      <Link href='/home/home-business/inventory' className='flex items-center py-2 gap-3 cursor-pointer'>
            <Image src='/images/inventory.png' alt='budget' width={20} height={20}/>
            <h1 className='font-poppins text-sm font-semibold'>Inventory</h1>
        </Link>
      <Link href='/home/home-business/consultants' className='flex items-center py-2 gap-3 cursor-pointer'>
            <Image src='/images/consulting.png' alt='budget' width={20} height={20}/>
            <h1 className='font-poppins text-sm font-semibold'>Consultants</h1>
        </Link>
    </div>
  )
}

export default BusinessSidebar
