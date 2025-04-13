
import { DebtEntry } from '@/lib/types';
import { format } from 'date-fns';

interface DebtListProps {
  debts: DebtEntry[];
  onEdit: (debt: DebtEntry) => void;
  onDelete: (id: string) => void;
}

export default function DebtList({ debts, onEdit, onDelete }: DebtListProps) {
  const totalDebt = debts.reduce((sum, debt) => sum + debt.amount, 0);
  const totalPaid = debts.reduce((sum, debt) => sum + debt.amountPaid, 0);
  const remainingDebt = totalDebt - totalPaid;

  if (debts.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <p className="text-gray-500">No debt entries yet. Add your first debt!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Debt Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 bg-red-50 rounded-lg">
            <p className="text-sm text-red-600">Total Debt</p>
            <p className="text-2xl font-bold">Ksh {totalDebt.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-600">Amount Paid</p>
            <p className="text-2xl font-bold">Ksh {totalPaid.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-600">Remaining</p>
            <p className="text-2xl font-bold">Ksh {remainingDebt.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Your Debts</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interest</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Strategy</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {debts.map((debt) => (
                <tr key={debt.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium">{debt.name}</div>
                    {debt.notes && (
                      <div className="text-sm text-gray-500">{debt.notes}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>Ksh {debt.amount.toLocaleString()}</div>
                    <div className="text-sm text-green-600">
                      Paid: Ksh {debt.amountPaid.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {debt.interestRate}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {format(new Date(debt.dueDate), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 capitalize">
                      {debt.strategy}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onEdit(debt)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(debt.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}