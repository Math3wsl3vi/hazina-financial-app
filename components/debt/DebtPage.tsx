"use client"
import DebtForm from '@/components/debt/DebtForm';
import DebtList from '@/components/debt/DebtList';
import DebtRangeSelector from '@/components/debt/DebtRangeSelector';
import { DebtEntry, DebtRange } from '@/lib/types';
import { useState } from 'react';
import { useDebts } from '@/hooks/useDebts';
import { toast } from 'react-hot-toast';

const debtRanges: DebtRange[] = [
  { label: 'Under 500K', min: 0, max: 499999 },
  { label: '500K - 1M', min: 500000, max: 999999 },
  { label: '1M - 2M', min: 1000000, max: 2000000 },
  { label: '2M - 5M', min: 2000000, max: 5000000 },
  { label: 'Over 5M', min: 5000001, max: Infinity }
];

export default function DebtPage() {
  const { debts, loading, addDebt, updateDebt, deleteDebt } = useDebts();
  const [editingDebt, setEditingDebt] = useState<DebtEntry | null>(null);
  const [selectedRange, setSelectedRange] = useState<DebtRange | null>(null);

  const handleAddDebt = async (newDebt: Omit<DebtEntry, 'id'>) => {
    try {
      await addDebt(newDebt);
      toast.success('Debt added successfully!');
    } catch (error) {
      toast.error('Failed to add debt');
      console.error(error);
    }
  };

  const handleUpdateDebt = async (updatedDebt: Omit<DebtEntry, 'id'>) => {
    if (!editingDebt) return;
    try {
      await updateDebt(editingDebt.id, updatedDebt);
      toast.success('Debt updated successfully!');
      setEditingDebt(null);
    } catch (error) {
      toast.error('Failed to update debt');
      console.error(error);
    }
  };

  const handleDeleteDebt = async (id: string) => {
    try {
      await deleteDebt(id);
      toast.success('Debt deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete debt');
      console.error(error);
    }
  };

  const handleRangeSelect = (range: DebtRange) => {
    setSelectedRange(range);
  };

  const filteredDebts = selectedRange
    ? debts.filter(debt => debt.amount >= selectedRange.min && debt.amount <= selectedRange.max)
    : debts;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 font-poppins">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-600">Loading your debts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 font-poppins">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Hazina Debt Management</h1>
          <p className="mt-2 text-lg text-gray-600">
            Track and manage your debts effectively
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Debt Overview</h2>
              <DebtRangeSelector
                ranges={debtRanges}
                selectedRange={selectedRange}
                onSelect={handleRangeSelect}
              />
            </div>

            <DebtList
              debts={filteredDebts}
              onEdit={setEditingDebt}
              onDelete={handleDeleteDebt}
            />
          </div>

          <div>
            <DebtForm
              initialData={editingDebt || undefined}
              onSubmit={editingDebt ? handleUpdateDebt : handleAddDebt}
              onCancel={() => setEditingDebt(null)}
            />

            {!editingDebt && (
              <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-semibold text-lg mb-3">Debt Repayment Strategies</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-800">Avalanche Method</h4>
                    <p className="mt-1 text-sm text-blue-700">
                      Pay highest interest debts first. Saves the most on interest payments.
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-800">Snowball Method</h4>
                    <p className="mt-1 text-sm text-green-700">
                      Pay smallest debts first for psychological wins. Builds momentum.
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-800">Consolidation</h4>
                    <p className="mt-1 text-sm text-purple-700">
                      Combine multiple debts into one payment, often at lower interest.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className='h-[75px]'></div>
    </div>
  );
}