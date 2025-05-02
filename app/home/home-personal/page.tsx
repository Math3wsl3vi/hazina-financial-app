import Budgets from '@/components/home/Budgets'
import HelloSection from '@/components/home/HelloSection'
import IncomeData from '@/components/home/IncomeData'
import React from 'react'

  const Perosnal = () => {
    return (
      <div className='font-poppins p-2'>
        {/* hello section */}
        <HelloSection/>
        {/*budget */}
        {/* <BudgetInputSection/> */}
        <div className='md:flex md:items-start md:gap-10 p-2'>
        <IncomeData/>
        <Budgets/>
        </div>
        
        <div className='h-[85px]'></div>
      </div>
    )
  }

  export default Perosnal