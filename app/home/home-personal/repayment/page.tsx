import Link from 'next/link';
import React from 'react';

const strategyDetails = {
  avalanche: {
    title: "Avalanche Method",
    description:
      "Pay off debts with the highest interest rates first while making minimum payments on others. Saves you the most money on interest.",
    bestFor: "Those who want to minimize total interest paid",
  },
  snowball: {
    title: "Snowball Method",
    description:
      "Pay off smallest debts first for quick wins while making minimum payments on others. Builds momentum.",
    bestFor: "Those who need motivation from quick successes",
  },
  consolidation: {
    title: "Consolidation",
    description:
      "Combine multiple debts into a single loan with one monthly payment, often at a lower interest rate.",
    bestFor: "Those with multiple high-interest debts who want simplification",
  },
};

const LoanRepaymentPage = () => {
  const strategies = Object.entries(strategyDetails); // [['avalanche', {...}], ...]

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-poppins">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Loan Repayment Strategies</h1>
          <p className="mt-4 text-lg text-gray-600">
            Choose a strategy that aligns with your financial goals and repayment capacity.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {strategies.map(([key, strategy]) => (
            <div key={key} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{strategy.title}</h2>
              <p className="text-gray-600 mb-4">{strategy.description}</p>
              <div className="bg-blue-50 p-3 rounded-md">
                <p className="text-sm text-blue-700">
                  <span className="font-medium">Best for:</span> {strategy.bestFor}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Important Repayment Information</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              <span className="font-medium text-gray-800">Due Dates:</span> Payments are typically due on the 1st of each month. Late payments may incur fees.
            </p>
            <p>
              <span className="font-medium text-gray-800">Early Repayment:</span> You can pay off your loan early without any prepayment penalties.
            </p>
            <p>
              <span className="font-medium text-gray-800">Need Help?</span> Book a session with our financial advisors. <Link href={'/home/home-personal/advisors'} className='underline text-blue-400'>Book Here</Link>
            </p>
          </div>
        </div>
      </div>
      <div className="h-[55px]"></div>
    </div>
  );
};

export default LoanRepaymentPage;
