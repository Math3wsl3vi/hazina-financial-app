// components/InvestmentList.tsx

import { Frequency, InvestmentEntry, RiskLevel } from "@/lib/types";


interface InvestmentListProps {
  investments: InvestmentEntry[];
}

export default function InvestmentList({ investments }: InvestmentListProps) {
  const totalInvested = investments.reduce((sum, item) => sum + item.amount, 0);

  const getFrequencyLabel = (freq: Frequency): string => {
    const labels: Record<Frequency, string> = {
      daily: 'Daily',
      weekly: 'Weekly',
      monthly: 'Monthly'
    };
    return labels[freq];
  };

  const getRiskColor = (risk: RiskLevel): string => {
    const colors: Record<RiskLevel, string> = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };
    return colors[risk];
  };

  return (
    <div className="mt-8 font-poppins">
    <h2 className="text-xl font-semibold">Your Investments</h2>
    <p className="text-lg my-2">Total Invested: ${totalInvested.toFixed(2)}</p>
    
    <div className="mt-4 space-y-3">
      {investments.map((item, index) => (
        <div key={index} className="p-4 border rounded-md shadow-sm">
          <div className="flex justify-between">
            <p className="font-medium">Ksh {item.amount.toFixed(2)}</p>
            <div className="flex space-x-2">
              <span className={`px-2 py-1 text-xs rounded-full ${getRiskColor(item.riskLevel)}`}>
                {item.riskLevel}
              </span>
              <span className="px-2 py-1 text-xs bg-gray-100 rounded-full">
                {item.investmentType}
              </span>
              <span className="px-2 py-1 text-xs bg-blue-100 rounded-full">
                {getFrequencyLabel(item.frequency)}
              </span>
            </div>
          </div>
          {item.notes && <p className="mt-2 text-sm text-gray-600">Notes: {item.notes}</p>}
          <p className="mt-1 text-xs text-gray-500">
            {new Date(item.date).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  </div>
  );
}