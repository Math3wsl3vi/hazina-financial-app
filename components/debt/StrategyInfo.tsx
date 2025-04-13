import { DebtRepaymentStrategy } from "@/lib/types";

interface StrategyInfoProps {
  strategy: DebtRepaymentStrategy;
  isActive: boolean;
  onSelect: () => void;
}

const strategyDetails = {
  avalanche: {
    title: "Avalanche Method",
    description: "Pay off debts with the highest interest rates first while making minimum payments on others. Saves you the most money on interest.",
    bestFor: "Those who want to minimize total interest paid"
  },
  snowball: {
    title: "Snowball Method",
    description: "Pay off smallest debts first for quick wins while making minimum payments on others. Builds momentum.",
    bestFor: "Those who need motivation from quick successes"
  },
  consolidation: {
    title: "Consolidation",
    description: "Combine multiple debts into a single loan with one monthly payment, often at a lower interest rate.",
    bestFor: "Those with multiple high-interest debts who want simplification"
  }
};

export default function StrategyInfo({ strategy, isActive, onSelect }: StrategyInfoProps) {
  const detail = strategyDetails[strategy];

  return (
    <div 
      className={`p-4 border rounded-lg cursor-pointer transition-all ${isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
      onClick={onSelect}
    >
      <h3 className="font-bold text-lg">{detail.title}</h3>
      <p className="mt-2 text-gray-600">{detail.description}</p>
      <p className="mt-2 text-sm">
        <span className="font-medium">Best for:</span> {detail.bestFor}
      </p>
      {isActive && (
        <div className="mt-3 text-blue-600 font-medium">
          ✓ Selected strategy
        </div>
      )}
    </div>
  );
}