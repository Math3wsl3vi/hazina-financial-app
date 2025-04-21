"use client";
import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, setDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '@/configs/firebaseConfig';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface FinancialRecord {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  createdAt:Timestamp;
}

interface InvoicingRecord {
  id: string;
  type: 'customer' | 'supplier';
  unpaidBalance?: number;
  amountDue?: number;
  createdAt:Timestamp;
}

interface InventoryRecord {
  id: string;
  type: 'in' | 'out';
  quantity: number;
  price: number;
  createdAt:Timestamp;
}

interface PayrollRecord {
  id: string;
  salaryAmount: number;
  createdAt:Timestamp;
}

interface FinancialSettings {
  landAndBuilding: number;
  plantPropertyEquipment: number;
  bankOverdraft: number;
  mortgage: number;
  retainedEarnings: number;
  ownerCapital: number;
  rent: number;
  transport: number;
  marketing: number;
  generalExpenses: number;
}

const FinancialReportPage = () => {
  // State to store fetched records
  const [financialRecords, setFinancialRecords] = useState<FinancialRecord[]>([]);
  const [invoicingRecords, setInvoicingRecords] = useState<InvoicingRecord[]>([]);
  const [inventoryRecords, setInventoryRecords] = useState<InventoryRecord[]>([]);
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
  const [financialSettings, setFinancialSettings] = useState<FinancialSettings>({
    landAndBuilding: 0,
    plantPropertyEquipment: 0,
    bankOverdraft: 0,
    mortgage: 0,
    retainedEarnings: 0,
    ownerCapital: 0,
    rent: 0,
    transport: 0,
    marketing: 0,
    generalExpenses: 0,
  });
  const [settingsError, setSettingsError] = useState('');
  const [settingsSuccess, setSettingsSuccess] = useState('');

  // Fetch records from Firestore in real-time
  useEffect(() => {
    // Financial Records
    const financialQuery = query(collection(db, 'financialRecords'), orderBy('createdAt', 'desc'));
    const unsubscribeFinancial = onSnapshot(financialQuery, (snapshot) => {
      const records: FinancialRecord[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FinancialRecord[];
      setFinancialRecords(records);
    }, (error) => console.error('Error fetching financial records:', error));

    // Invoicing Records
    const invoicingQuery = query(collection(db, 'invoicingRecords'), orderBy('createdAt', 'desc'));
    const unsubscribeInvoicing = onSnapshot(invoicingQuery, (snapshot) => {
      const records: InvoicingRecord[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as InvoicingRecord[];
      setInvoicingRecords(records);
    }, (error) => console.error('Error fetching invoicing records:', error));

    // Inventory Records
    const inventoryQuery = query(collection(db, 'inventoryRecords'), orderBy('createdAt', 'desc'));
    const unsubscribeInventory = onSnapshot(inventoryQuery, (snapshot) => {
      const records: InventoryRecord[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as InventoryRecord[];
      setInventoryRecords(records);
    }, (error) => console.error('Error fetching inventory records:', error));

    // Payroll Records
    const payrollQuery = query(collection(db, 'payrollRecords'), orderBy('createdAt', 'desc'));
    const unsubscribePayroll = onSnapshot(payrollQuery, (snapshot) => {
      const records: PayrollRecord[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as PayrollRecord[];
      setPayrollRecords(records);
    }, (error) => console.error('Error fetching payroll records:', error));

    // Financial Settings
    const settingsDocRef = doc(db, 'financialSettings', 'settings');
    const unsubscribeSettings = onSnapshot(settingsDocRef, (doc) => {
      if (doc.exists()) {
        setFinancialSettings(doc.data() as FinancialSettings);
      }
    }, (error) => console.error('Error fetching financial settings:', error));

    return () => {
      unsubscribeFinancial();
      unsubscribeInvoicing();
      unsubscribeInventory();
      unsubscribePayroll();
      unsubscribeSettings();
    };
  }, []);

  // Handle form submission for financial settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsError('');
    setSettingsSuccess('');

    const values: FinancialSettings = {
      landAndBuilding: Number(financialSettings.landAndBuilding),
      plantPropertyEquipment: Number(financialSettings.plantPropertyEquipment),
      bankOverdraft: Number(financialSettings.bankOverdraft),
      mortgage: Number(financialSettings.mortgage),
      retainedEarnings: Number(financialSettings.retainedEarnings),
      ownerCapital: Number(financialSettings.ownerCapital),
      rent: Number(financialSettings.rent),
      transport: Number(financialSettings.transport),
      marketing: Number(financialSettings.marketing),
      generalExpenses: Number(financialSettings.generalExpenses),
    };

    for (const key in values) {
      if (isNaN(values[key as keyof FinancialSettings]) || values[key as keyof FinancialSettings] < 0) {
        setSettingsError('All values must be non-negative numbers');
        return;
      }
    }

    try {
      await setDoc(doc(db, 'financialSettings', 'settings'), values);
      setSettingsSuccess('Settings saved successfully!');
    } catch (error) {
      setSettingsError('Failed to save settings. Please try again.');
      console.error('Error saving financial settings:', error);
    }
  };

  // Calculate Balance Sheet
  const calculateBalanceSheet = () => {
    // Fixed Assets
    const totalFixedAssets = financialSettings.landAndBuilding + financialSettings.plantPropertyEquipment;

    // Current Assets
    const cash = financialRecords.reduce((sum, record) => {
      return record.type === 'income' ? sum + record.amount : sum - record.amount;
    }, 0);
    const inventoryValue = inventoryRecords.reduce((sum, record) => {
      const value = record.quantity * record.price;
      return record.type === 'in' ? sum + value : sum - value;
    }, 0);
    const debtors = invoicingRecords
      .filter((record) => record.type === 'customer')
      .reduce((sum, record) => sum + (record.unpaidBalance || 0), 0);
    const totalCurrentAssets = cash + Math.max(inventoryValue, 0) + debtors;

    const totalAssets = totalFixedAssets + totalCurrentAssets;

    // Liabilities
    const creditors = invoicingRecords
      .filter((record) => record.type === 'supplier')
      .reduce((sum, record) => sum + (record.amountDue || 0), 0);
    const totalLiabilities = creditors + financialSettings.bankOverdraft + financialSettings.mortgage;

    // Capital
    const totalCapital = financialSettings.retainedEarnings + financialSettings.ownerCapital;

    const totalCapitalAndLiabilities = totalCapital + totalLiabilities;

    return {
      totalFixedAssets,
      landAndBuilding: financialSettings.landAndBuilding,
      plantPropertyEquipment: financialSettings.plantPropertyEquipment,
      totalCurrentAssets,
      cash,
      inventoryValue,
      debtors,
      totalAssets,
      totalLiabilities,
      creditors,
      bankOverdraft: financialSettings.bankOverdraft,
      mortgage: financialSettings.mortgage,
      totalCapital,
      retainedEarnings: financialSettings.retainedEarnings,
      ownerCapital: financialSettings.ownerCapital,
      totalCapitalAndLiabilities,
    };
  };

  // Calculate Profit & Loss
  const calculateProfitLoss = () => {
    // Income from Sales
    const incomeFromSales = inventoryRecords
      .filter((record) => record.type === 'out')
      .reduce((sum, record) => sum + record.quantity * record.price, 0);

    // Cost of Sales
    const openingInventory = 0; // Assume 0 for simplicity
    const purchases = inventoryRecords
      .filter((record) => record.type === 'in')
      .reduce((sum, record) => sum + record.quantity * record.price, 0);
    const closingInventory = inventoryRecords.reduce((sum, record) => {
      const value = record.quantity * record.price;
      return record.type === 'in' ? sum + value : sum - value;
    }, 0);
    const costOfSales = openingInventory + purchases - Math.max(closingInventory, 0);

    const grossProfit = incomeFromSales - costOfSales;

    // Operating Expenses
    const salaries = payrollRecords.reduce((sum, record) => sum + record.salaryAmount, 0);
    const totalOperatingExpenses =
      financialSettings.rent +
      financialSettings.transport +
      salaries +
      financialSettings.marketing +
      financialSettings.generalExpenses;

    const netProfit = grossProfit - totalOperatingExpenses;

    return {
      incomeFromSales,
      costOfSales,
      openingInventory,
      purchases,
      closingInventory,
      grossProfit,
      totalOperatingExpenses,
      rent: financialSettings.rent,
      transport: financialSettings.transport,
      salaries,
      marketing: financialSettings.marketing,
      generalExpenses: financialSettings.generalExpenses,
      netProfit,
    };
  };

  const balanceSheet = calculateBalanceSheet();
  const profitLoss = calculateProfitLoss();

  return (
    <div className="p-5 max-w-2xl mx-auto font-poppins">
      {/* Financial Settings Form */}
      <div className="mb-8">
        <h2 className="font-poppins text-xl font-semibold mb-4">Financial Settings</h2>
        <form onSubmit={handleSaveSettings} className="space-y-4">
          <h3 className="font-poppins text-lg font-medium mb-2">Balance Sheet Inputs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="landAndBuilding" className="block text-sm font-medium">
                Land & Building
              </Label>
              <Input
                id="landAndBuilding"
                type="number"
                step="0.01"
                min="0"
                value={financialSettings.landAndBuilding}
                onChange={(e) =>
                  setFinancialSettings({
                    ...financialSettings,
                    landAndBuilding: Number(e.target.value),
                  })
                }
                className="w-full"
                placeholder="Enter value"
              />
            </div>
            <div>
              <Label htmlFor="plantPropertyEquipment" className="block text-sm font-medium">
                Plant, Property & Equipment
              </Label>
              <Input
                id="plantPropertyEquipment"
                type="number"
                step="0.01"
                min="0"
                value={financialSettings.plantPropertyEquipment}
                onChange={(e) =>
                  setFinancialSettings({
                    ...financialSettings,
                    plantPropertyEquipment: Number(e.target.value),
                  })
                }
                className="w-full"
                placeholder="Enter value"
              />
            </div>
            <div>
              <Label htmlFor="bankOverdraft" className="block text-sm font-medium">
                Bank Overdraft
              </Label>
              <Input
                id="bankOverdraft"
                type="number"
                step="0.01"
                min="0"
                value={financialSettings.bankOverdraft}
                onChange={(e) =>
                  setFinancialSettings({
                    ...financialSettings,
                    bankOverdraft: Number(e.target.value),
                  })
                }
                className="w-full"
                placeholder="Enter value"
              />
            </div>
            <div>
              <Label htmlFor="mortgage" className="block text-sm font-medium">
                Mortgage
              </Label>
              <Input
                id="mortgage"
                type="number"
                step="0.01"
                min="0"
                value={financialSettings.mortgage}
                onChange={(e) =>
                  setFinancialSettings({
                    ...financialSettings,
                    mortgage: Number(e.target.value),
                  })
                }
                className="w-full"
                placeholder="Enter value"
              />
            </div>
            <div>
              <Label htmlFor="retainedEarnings" className="block text-sm font-medium">
                Retained Earnings
              </Label>
              <Input
                id="retainedEarnings"
                type="number"
                step="0.01"
                min="0"
                value={financialSettings.retainedEarnings}
                onChange={(e) =>
                  setFinancialSettings({
                    ...financialSettings,
                    retainedEarnings: Number(e.target.value),
                  })
                }
                className="w-full"
                placeholder="Enter value"
              />
            </div>
            <div>
              <Label htmlFor="ownerCapital" className="block text-sm font-medium">
                Owner Capital
              </Label>
              <Input
                id="ownerCapital"
                type="number"
                step="0.01"
                min="0"
                value={financialSettings.ownerCapital}
                onChange={(e) =>
                  setFinancialSettings({
                    ...financialSettings,
                    ownerCapital: Number(e.target.value),
                  })
                }
                className="w-full"
                placeholder="Enter value"
              />
            </div>
          </div>

          <h3 className="font-poppins text-lg font-medium mb-2 mt-4">Profit & Loss Inputs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rent" className="block text-sm font-medium">
                Rent
              </Label>
              <Input
                id="rent"
                type="number"
                step="0.01"
                min="0"
                value={financialSettings.rent}
                onChange={(e) =>
                  setFinancialSettings({
                    ...financialSettings,
                    rent: Number(e.target.value),
                  })
                }
                className="w-full"
                placeholder="Enter value"
              />
            </div>
            <div>
              <Label htmlFor="transport" className="block text-sm font-medium">
                Transport
              </Label>
              <Input
                id="transport"
                type="number"
                step="0.01"
                min="0"
                value={financialSettings.transport}
                onChange={(e) =>
                  setFinancialSettings({
                    ...financialSettings,
                    transport: Number(e.target.value),
                  })
                }
                className="w-full"
                placeholder="Enter value"
              />
            </div>
            <div>
              <Label htmlFor="marketing" className="block text-sm font-medium">
                Marketing
              </Label>
              <Input
                id="marketing"
                type="number"
                step="0.01"
                min="0"
                value={financialSettings.marketing}
                onChange={(e) =>
                  setFinancialSettings({
                    ...financialSettings,
                    marketing: Number(e.target.value),
                  })
                }
                className="w-full"
                placeholder="Enter value"
              />
            </div>
            <div>
              <Label htmlFor="generalExpenses" className="block text-sm font-medium">
                General Expenses
              </Label>
              <Input
                id="generalExpenses"
                type="number"
                step="0.01"
                min="0"
                value={financialSettings.generalExpenses}
                onChange={(e) =>
                  setFinancialSettings({
                    ...financialSettings,
                    generalExpenses: Number(e.target.value),
                  })
                }
                className="w-full"
                placeholder="Enter value"
              />
            </div>
          </div>
          {settingsError && <p className="text-xs text-red-500">{settingsError}</p>}
          {settingsSuccess && <p className="text-xs text-green-500">{settingsSuccess}</p>}
          <Button type="submit" className="w-full">Save Settings</Button>
        </form>
      </div>

      {/* Balance Sheet Section */}
      <div className="mb-8">
        <h2 className="font-poppins text-xl font-semibold mb-4">Balance Sheet</h2>
        <h3 className="font-poppins text-lg font-medium mb-2">Assets</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Fixed Assets</span>
            <span></span>
          </div>
          <div className="flex justify-between text-sm pl-4">
            <span>Land & Building</span>
            <span>KES {balanceSheet.landAndBuilding.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm pl-4">
            <span>Plant, Property & Equipment</span>
            <span>KES {balanceSheet.plantPropertyEquipment.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm font-semibold">
            <span>Total Fixed Assets</span>
            <span>KES {balanceSheet.totalFixedAssets.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span>Current Assets</span>
            <span></span>
          </div>
          <div className="flex justify-between text-sm pl-4">
            <span>Cash in Hand & at Bank</span>
            <span>KES {balanceSheet.cash.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm pl-4">
            <span>Inventory</span>
            <span>KES {Math.max(balanceSheet.inventoryValue, 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm pl-4">
            <span>Debtors</span>
            <span>KES {balanceSheet.debtors.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm font-semibold">
            <span>Total Current Assets</span>
            <span>KES {balanceSheet.totalCurrentAssets.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm font-bold mt-2">
            <span>Total Assets</span>
            <span>KES {balanceSheet.totalAssets.toFixed(2)}</span>
          </div>
        </div>

        <h3 className="font-poppins text-lg font-medium mb-2 mt-4">Liabilities</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm pl-4">
            <span>Creditors</span>
            <span>KES {balanceSheet.creditors.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm pl-4">
            <span>Bank Overdraft</span>
            <span>KES {balanceSheet.bankOverdraft.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm pl-4">
            <span>Mortgage</span>
            <span>KES {balanceSheet.mortgage.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm font-semibold">
            <span>Total Liabilities</span>
            <span>KES {balanceSheet.totalLiabilities.toFixed(2)}</span>
          </div>
        </div>

        <h3 className="font-poppins text-lg font-medium mb-2 mt-4">Capital</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm pl-4">
            <span>Retained Earnings</span>
            <span>KES {balanceSheet.retainedEarnings.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm pl-4">
            <span>Owner Capital</span>
            <span>KES {balanceSheet.ownerCapital.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm font-semibold">
            <span>Total Capital</span>
            <span>KES {balanceSheet.totalCapital.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm font-bold mt-2">
            <span>Total Capital & Liabilities</span>
            <span>KES {balanceSheet.totalCapitalAndLiabilities.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Profit & Loss Report Section */}
      <div>
        <h2 className="font-poppins text-xl font-semibold mb-4">Profit & Loss Report</h2>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Income from Sales</span>
            <span>KES {profitLoss.incomeFromSales.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Less: Cost of Sales</span>
            <span></span>
          </div>
          <div className="flex justify-between text-sm pl-4">
            <span>Opening Inventory</span>
            <span>KES {profitLoss.openingInventory.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm pl-4">
            <span>Purchases</span>
            <span>KES {profitLoss.purchases.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm pl-4">
            <span>Less: Closing Inventory</span>
            <span>KES {Math.max(profitLoss.closingInventory, 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm font-semibold">
            <span>Cost of Sales</span>
            <span>KES {profitLoss.costOfSales.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm font-bold">
            <span>Gross Profit</span>
            <span>KES {profitLoss.grossProfit.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span>Less: Operating Expenses</span>
            <span></span>
          </div>
          <div className="flex justify-between text-sm pl-4">
            <span>Rent</span>
            <span>KES {profitLoss.rent.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm pl-4">
            <span>Transport</span>
            <span>KES {profitLoss.transport.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm pl-4">
            <span>Salaries</span>
            <span>KES {profitLoss.salaries.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm pl-4">
            <span>Marketing</span>
            <span>KES {profitLoss.marketing.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm pl-4">
            <span>General Expenses</span>
            <span>KES {profitLoss.generalExpenses.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm font-semibold">
            <span>Total Operating Expenses</span>
            <span>KES {profitLoss.totalOperatingExpenses.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm font-bold mt-2">
            <span>Net Profit</span>
            <span>KES {profitLoss.netProfit.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <div className='h-[105px]'></div>
    </div>
  );
};

export default FinancialReportPage;