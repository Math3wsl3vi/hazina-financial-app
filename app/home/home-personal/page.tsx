import Budgets from '@/components/home/Budgets'
import HelloSection from '@/components/home/HelloSection'
import IncomeData from '@/components/home/IncomeData'
import React from 'react'

  const Perosnal = () => {
    return (
      <div className='font-poppins'>
        {/* hello section */}
        <HelloSection/>
        {/*budget */}
        {/* <BudgetInputSection/> */}
        <IncomeData/>
        <Budgets/>
        <div className='h-[85px]'></div>
      </div>
    )
  }

  export default Perosnal