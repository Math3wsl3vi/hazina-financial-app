import { FinancialHealth } from "@/lib/types";

interface FinancialHealthCardProps {
  health: FinancialHealth;
}

export default function FinancialHealthCard({ health }: FinancialHealthCardProps) {
  const getHealthStatus = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  const getStatusColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Your Financial Health</h2>
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-sm text-gray-500">Overall Score</span>
          <div className={`text-3xl font-bold ${getStatusColor(health.score)}`}>
            {health.score}/100
          </div>
        </div>
        <div className="text-right">
          <span className="text-sm text-gray-500">Status</span>
          <div className={`text-xl font-medium ${getStatusColor(health.score)}`}>
            {getHealthStatus(health.score)}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Debt-to-Income Ratio</span>
            <span className="text-sm">{health.debtToIncome}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${Math.min(health.debtToIncome, 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {health.debtToIncome > 40 ? 'Consider reducing debt' : 'Healthy ratio'}
          </p>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Savings Rate</span>
            <span className="text-sm">{health.savingsRate}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-green-600 h-2.5 rounded-full" 
              style={{ width: `${Math.min(health.savingsRate * 2, 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {health.savingsRate < 15 ? 'Try to save more' : 'Good savings habit'}
          </p>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Investment Diversity</span>
            <span className="text-sm">{health.investmentDiversity}/10</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-purple-600 h-2.5 rounded-full" 
              style={{ width: `${health.investmentDiversity * 10}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {health.investmentDiversity < 5 ? 'Consider diversifying' : 'Well diversified'}
          </p>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 text-sm text-gray-500">
        Last updated: {new Date(health.lastUpdated).toLocaleDateString()}
      </div>
    </div>
  );
}