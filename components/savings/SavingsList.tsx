import { SavingsEntry } from "@/lib/types";


interface SavingsListProps {
  savings: SavingsEntry[];
  onDelete: (id: string) => void;
}

export default function SavingsList({ savings, onDelete }: SavingsListProps) {
  const totalSavings = savings.reduce((sum, item) => sum + item.amount, 0);

  if (savings.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <p className="text-gray-500">No savings entries yet. Add your first entry!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-poppins">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2">Savings Summary</h2>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total Entries:</span>
          <span className="font-medium">{savings.length}</span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-gray-600">Total Saved:</span>
          <span className="text-2xl font-bold text-green-600">
            Ksh {totalSavings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Your Savings</h2>
        <div className="space-y-4">
          {savings.map((entry) => (
            <div key={entry.id} className="border-b pb-4 last:border-b-0">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-lg">
                    Ksh {entry.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-sm text-gray-600">{entry.category}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(entry.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                  {entry.notes && (
                    <p className="mt-1 text-sm text-gray-700">
                      <span className="font-medium capitalize">Note:</span> {entry.notes}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => onDelete(entry.id)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}