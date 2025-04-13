import { DebtRange } from "@/lib/types";

interface DebtRangeSelectorProps {
  ranges: DebtRange[];
  selectedRange: DebtRange | null;
  onSelect: (range: DebtRange) => void;
}

export default function DebtRangeSelector({ ranges, selectedRange, onSelect }: DebtRangeSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-700">Select your debt range:</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {ranges.map((range) => (
          <button
            key={range.label}
            onClick={() => onSelect(range)}
            className={`p-3 border rounded-md text-center transition-colors ${
              selectedRange?.label === range.label
                ? 'bg-blue-100 border-blue-500'
                : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}
          >
            <span className="font-medium">{range.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}