"use client";
import React, { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  setDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/configs/firebaseConfig";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FinancialRecord {
  id: string;
  type: "income" | "expense";
  amount: number;
  createdAt: Timestamp;
  category?: string; // Added for better expense tracking
}

interface InvoicingRecord {
  id: string;
  type: "customer" | "supplier";
  amount: number;
  paidAmount?: number;
  status?: "paid" | "unpaid" | "partial";
  createdAt: Timestamp;
}

interface InventoryRecord {
  id: string;
  type: "in" | "out";
  quantity: number;
  price: number;
  itemName: string;
  createdAt: Timestamp;
}

interface PayrollRecord {
  id: string;
  salaryAmount: number;
  employeeName: string;
  createdAt: Timestamp;
}

interface FinancialSettings {
  // Fixed Assets
  landAndBuilding: number;
  plantPropertyEquipment: number;

  // Current Assets
  cashInHand: number;
  inventory: number;
  debtors: number;

  // Liabilities
  creditors: number;
  bankOverdraft: number;
  mortgage: number;

  // Capital
  retainedEarnings: number;
  ownerCapital: number;

  // Profit & Loss
  incomeFromSales: number;
  openingInventory: number;
  purchases: number;
  closingInventory: number;

  // Operating Expenses
  rent: number;
  transport: number;
  salaries: number;
  marketing: number;
  generalExpenses: number;
}

const FinancialReportPage = () => {
  const [financialRecords, setFinancialRecords] = useState<FinancialRecord[]>(
    []
  );
  const [invoicingRecords, setInvoicingRecords] = useState<InvoicingRecord[]>(
    []
  );
  const [inventoryRecords, setInventoryRecords] = useState<InventoryRecord[]>(
    []
  );
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
  const [financialSettings, setFinancialSettings] = useState<FinancialSettings>(
    {
      landAndBuilding: 0,
      plantPropertyEquipment: 0,
      cashInHand: 0,
      inventory: 0,
      debtors: 0,
      creditors: 0,
      bankOverdraft: 0,
      mortgage: 0,
      retainedEarnings: 0,
      ownerCapital: 0,
      incomeFromSales: 0,
      openingInventory: 0,
      purchases: 0,
      closingInventory: 0,
      rent: 0,
      transport: 0,
      salaries: 0,
      marketing: 0,
      generalExpenses: 0,
    }
  );

  const [settingsError, setSettingsError] = useState("");
  const [settingsSuccess, setSettingsSuccess] = useState("");

  // Fetch all records
  useEffect(() => {
    const financialQuery = query(
      collection(db, "financialRecords"),
      orderBy("createdAt", "desc")
    );
    const unsubscribeFinancial = onSnapshot(financialQuery, (snapshot) => {
      const records = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FinancialRecord[];
      setFinancialRecords(records);
    });

    const invoicingQuery = query(
      collection(db, "invoicingRecords"),
      orderBy("createdAt", "desc")
    );
    const unsubscribeInvoicing = onSnapshot(invoicingQuery, (snapshot) => {
      const records = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as InvoicingRecord[];
      setInvoicingRecords(records);
    });

    const inventoryQuery = query(
      collection(db, "inventoryRecords"),
      orderBy("createdAt", "desc")
    );
    const unsubscribeInventory = onSnapshot(inventoryQuery, (snapshot) => {
      const records = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as InventoryRecord[];
      setInventoryRecords(records);
    });

    const payrollQuery = query(
      collection(db, "payrollRecords"),
      orderBy("createdAt", "desc")
    );
    const unsubscribePayroll = onSnapshot(payrollQuery, (snapshot) => {
      const records = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as PayrollRecord[];
      setPayrollRecords(records);
    });

    const settingsDocRef = doc(db, "financialSettings", "settings");
    const unsubscribeSettings = onSnapshot(settingsDocRef, (doc) => {
      if (doc.exists()) {
        setFinancialSettings(doc.data() as FinancialSettings);
      }
    });

    return () => {
      unsubscribeFinancial();
      unsubscribeInvoicing();
      unsubscribeInventory();
      unsubscribePayroll();
      unsubscribeSettings();
    };
  }, []);

  // Enhanced balance sheet calculation
  const calculateBalanceSheet = () => {
    // Calculate Fixed Assets
    const fixedAssets = {
      landAndBuilding: financialSettings.landAndBuilding,
      plantPropertyEquipment: financialSettings.plantPropertyEquipment,
      total:
        financialSettings.landAndBuilding +
        financialSettings.plantPropertyEquipment,
    };

    // Calculate Current Assets
    const cashBalance = financialRecords.reduce((total, record) => {
      return record.type === "income"
        ? total + record.amount
        : total - record.amount;
    }, financialSettings.cashInHand);

    const inventoryValue = inventoryRecords.reduce((total, record) => {
      const value = record.quantity * record.price;
      return record.type === "in" ? total + value : total - value;
    }, financialSettings.inventory);

    const debtors = invoicingRecords
      .filter(
        (record) =>
          record.type === "customer" &&
          (record.status === "unpaid" || record.status === "partial")
      )
      .reduce((total, record) => {
        const unpaidAmount = record.amount - (record.paidAmount || 0);
        return total + unpaidAmount;
      }, financialSettings.debtors);

    const currentAssets = {
      cash: cashBalance,
      inventory: Math.max(0, inventoryValue),
      debtors: Math.max(0, debtors),
      total: cashBalance + Math.max(0, inventoryValue) + Math.max(0, debtors),
    };

    // Calculate Liabilities
    const creditors = invoicingRecords
      .filter(
        (record) =>
          record.type === "supplier" &&
          (record.status === "unpaid" || record.status === "partial")
      )
      .reduce((total, record) => {
        const unpaidAmount = record.amount - (record.paidAmount || 0);
        return total + unpaidAmount;
      }, financialSettings.creditors);

    const liabilities = {
      creditors: creditors,
      bankOverdraft: financialSettings.bankOverdraft,
      mortgage: financialSettings.mortgage,
      total:
        creditors +
        financialSettings.bankOverdraft +
        financialSettings.mortgage,
    };

    // Calculate Capital
    const capital = {
      retainedEarnings: financialSettings.retainedEarnings,
      ownerCapital: financialSettings.ownerCapital,
      total:
        financialSettings.retainedEarnings + financialSettings.ownerCapital,
    };

    // Totals
    const totalAssets = fixedAssets.total + currentAssets.total;
    const totalLiabilitiesAndCapital = liabilities.total + capital.total;

    return {
      fixedAssets,
      currentAssets,
      liabilities,
      capital,
      totalAssets,
      totalLiabilitiesAndCapital,
      balanceCheck: totalAssets === totalLiabilitiesAndCapital,
    };
  };

  // Enhanced profit and loss calculation
  const calculateProfitAndLoss = () => {
    // Revenue
    const salesRevenue = inventoryRecords
      .filter((record) => record.type === "out")
      .reduce((total, record) => total + record.quantity * record.price, 0);

    // Cost of Goods Sold
    const openingInventory = financialSettings.openingInventory;
    const purchases = inventoryRecords
      .filter((record) => record.type === "in")
      .reduce((total, record) => total + record.quantity * record.price, 0);
    const closingInventory = inventoryRecords.reduce((total, record) => {
      const value = record.quantity * record.price;
      return record.type === "in" ? total + value : total - value;
    }, openingInventory + purchases);

    const cogs = openingInventory + purchases - Math.max(0, closingInventory);

    // Gross Profit
    const grossProfit = salesRevenue - cogs;

    // Operating Expenses
    const payrollExpenses = payrollRecords.reduce(
      (total, record) => total + record.salaryAmount,
      0
    );
    const operatingExpenses = {
      rent: financialSettings.rent,
      transport: financialSettings.transport,
      salaries: payrollExpenses,
      marketing: financialSettings.marketing,
      generalExpenses: financialSettings.generalExpenses,
      total:
        financialSettings.rent +
        financialSettings.transport +
        payrollExpenses +
        financialSettings.marketing +
        financialSettings.generalExpenses,
    };

    // Net Profit
    const netProfit = grossProfit - operatingExpenses.total;

    return {
      salesRevenue,
      cogs: {
        openingInventory,
        purchases,
        closingInventory: Math.max(0, closingInventory),
        total: cogs,
      },
      grossProfit,
      operatingExpenses,
      netProfit,
    };
  };

  const balanceSheet = calculateBalanceSheet();
  const profitAndLoss = calculateProfitAndLoss();

  // Handle settings save
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsError("");
    setSettingsSuccess("");

    try {
      await setDoc(doc(db, "financialSettings", "settings"), financialSettings);
      setSettingsSuccess("Financial settings saved successfully!");
      setTimeout(() => setSettingsSuccess(""), 3000);
    } catch (error) {
      setSettingsError("Failed to save financial settings");
      console.error("Error saving settings:", error);
    }
  };

  // Render UI
  return (
    <div className="p-5 max-w-4xl mx-auto font-poppins">
      {/* Settings Form */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Financial Settings</h2>
        <form
          onSubmit={handleSaveSettings}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="border p-2 bg-green-50 rounded-md py-4">
          {/* Fixed Assets */}
          <div className="space-y-2">
            <h3 className="font-medium">Fixed Assets</h3>
            <div>
              <Label>Land & Building</Label>
              <Input 
              className="bg-white"
                type="number"
                value={financialSettings.landAndBuilding}
                onChange={(e) =>
                  setFinancialSettings({
                    ...financialSettings,
                    landAndBuilding: Number(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <Label>Plant, Property & Equipment</Label>
              <Input 
              className="bg-white"
                type="number"
                value={financialSettings.plantPropertyEquipment}
                onChange={(e) =>
                  setFinancialSettings({
                    ...financialSettings,
                    plantPropertyEquipment: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>

          {/* Current Assets */}
          <div className="space-y-2">
            <h3 className="font-medium">Current Assets</h3>
            <div>
              <Label>Cash in Hand</Label>
              <Input 
              className="bg-white"
                type="number"
                value={financialSettings.cashInHand}
                onChange={(e) =>
                  setFinancialSettings({
                    ...financialSettings,
                    cashInHand: Number(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <Label>Inventory</Label>
              <Input 
              className="bg-white"
                type="number"
                value={financialSettings.inventory}
                onChange={(e) =>
                  setFinancialSettings({
                    ...financialSettings,
                    inventory: Number(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <Label>Debtors</Label>
              <Input 
              className="bg-white"
                type="number"
                value={financialSettings.debtors}
                onChange={(e) =>
                  setFinancialSettings({
                    ...financialSettings,
                    debtors: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>

          {/* Liabilities */}
          <div className="space-y-2">
            <h3 className="font-medium">Liabilities</h3>
            <div>
              <Label>Creditors</Label>
              <Input 
              className="bg-white"
                type="number"
                value={financialSettings.creditors}
                onChange={(e) =>
                  setFinancialSettings({
                    ...financialSettings,
                    creditors: Number(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <Label>Bank Overdraft</Label>
              <Input 
              className="bg-white"
                type="number"
                value={financialSettings.bankOverdraft}
                onChange={(e) =>
                  setFinancialSettings({
                    ...financialSettings,
                    bankOverdraft: Number(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <Label>Mortgage</Label>
              <Input 
              className="bg-white"
                type="number"
                value={financialSettings.mortgage}
                onChange={(e) =>
                  setFinancialSettings({
                    ...financialSettings,
                    mortgage: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>

          {/* Capital */}
          <div className="space-y-2">
            <h3 className="font-medium">Capital</h3>
            <div>
              <Label>Retained Earnings</Label>
              <Input 
              className="bg-white"
                type="number"
                value={financialSettings.retainedEarnings}
                onChange={(e) =>
                  setFinancialSettings({
                    ...financialSettings,
                    retainedEarnings: Number(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <Label>Owner Capital</Label>
              <Input 
              className="bg-white"
                type="number"
                value={financialSettings.ownerCapital}
                onChange={(e) =>
                  setFinancialSettings({
                    ...financialSettings,
                    ownerCapital: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>
          </div>


          <div className="border p-2 rounded-md bg-blue-50 py-4">
            {/* Profit & Loss */}
            <div className="space-y-2 ">
              <h3 className="font-medium text-2xl">Profit & Loss</h3>
              <div>
                <Label>Opening Inventory</Label>
                <Input 
                className="bg-white"
                  type="number"
                  value={financialSettings.openingInventory}
                  onChange={(e) =>
                    setFinancialSettings({
                      ...financialSettings,
                      openingInventory: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <Label>Purchases</Label>
                <Input 
                className="bg-white"
                  type="number"
                  value={financialSettings.purchases}
                  onChange={(e) =>
                    setFinancialSettings({
                      ...financialSettings,
                      purchases: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <Label>Closing Inventory</Label>
                <Input 
                className="bg-white"
                  type="number"
                  value={financialSettings.closingInventory}
                  onChange={(e) =>
                    setFinancialSettings({
                      ...financialSettings,
                      closingInventory: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            {/* Operating Expenses */}
            <div className="space-y-2">
              <h3 className="font-medium">Operating Expenses</h3>
              <div>
                <Label>Rent</Label>
                <Input 
                className="bg-white"
                  type="number"
                  value={financialSettings.rent}
                  onChange={(e) =>
                    setFinancialSettings({
                      ...financialSettings,
                      rent: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <Label>Transport</Label>
                <Input 
                className="bg-white"
                  type="number"
                  value={financialSettings.transport}
                  onChange={(e) =>
                    setFinancialSettings({
                      ...financialSettings,
                      transport: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <Label>Salaries</Label>
                <Input 
                className="bg-white"
                  type="number"
                  value={financialSettings.salaries}
                  onChange={(e) =>
                    setFinancialSettings({
                      ...financialSettings,
                      salaries: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <Label>Marketing</Label>
                <Input 
                className="bg-white"
                  type="number"
                  value={financialSettings.marketing}
                  onChange={(e) =>
                    setFinancialSettings({
                      ...financialSettings,
                      marketing: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <Label>General Expenses</Label>
                <Input 
                className="bg-white"
                  type="number"
                  value={financialSettings.generalExpenses}
                  onChange={(e) =>
                    setFinancialSettings({
                      ...financialSettings,
                      generalExpenses: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            {settingsError && (
              <p className="text-red-500 text-sm">{settingsError}</p>
            )}
            {settingsSuccess && (
              <p className="text-green-500 text-sm">{settingsSuccess}</p>
            )}
            <Button type="submit" className="w-full mt-4">
              Save Settings
            </Button>
          </div>
        </form>
      </div>

      {/* Balance Sheet Report */}
      <div className="mb-8 bg-green-50 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Balance Sheet</h2>
        <div className="space-y-4 ">
          {/* Assets */}
          <div className="">
            <h3 className="font-medium text-lg mb-2">Assets</h3>
            <div className="pl-4 space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Fixed Assets:</span>
                <span></span>
              </div>
              <div className="flex justify-between pl-4">
                <span>Land & Building</span>
                <span>
                  KES{" "}
                  {balanceSheet.fixedAssets.landAndBuilding.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between pl-4">
                <span>Plant, Property & Equipment</span>
                <span>
                  KES{" "}
                  {balanceSheet.fixedAssets.plantPropertyEquipment.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between font-medium border-t pt-1">
                <span>Total Fixed Assets</span>
                <span>
                  KES {balanceSheet.fixedAssets.total.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between mt-2">
                <span className="font-medium">Current Assets:</span>
                <span></span>
              </div>
              <div className="flex justify-between pl-4">
                <span>Cash & Bank</span>
                <span>
                  KES {balanceSheet.currentAssets.cash.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between pl-4">
                <span>Inventory</span>
                <span>
                  KES {balanceSheet.currentAssets.inventory.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between pl-4">
                <span>Accounts Receivable</span>
                <span>
                  KES {balanceSheet.currentAssets.debtors.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between font-medium border-t pt-1">
                <span>Total Current Assets</span>
                <span>
                  KES {balanceSheet.currentAssets.total.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between font-bold text-lg border-t-2 pt-2 mt-2">
                <span>TOTAL ASSETS</span>
                <span>KES {balanceSheet.totalAssets.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Liabilities & Capital */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Liabilities */}
            <div>
              <h3 className="font-medium text-lg mb-2">Liabilities</h3>
              <div className="pl-4 space-y-2">
                <div className="flex justify-between pl-4">
                  <span>Accounts Payable</span>
                  <span>
                    KES {balanceSheet.liabilities.creditors.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between pl-4">
                  <span>Bank Overdraft</span>
                  <span>
                    KES{" "}
                    {balanceSheet.liabilities.bankOverdraft.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between pl-4">
                  <span>Mortgage</span>
                  <span>
                    KES {balanceSheet.liabilities.mortgage.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between font-medium border-t pt-1">
                  <span>Total Liabilities</span>
                  <span>
                    KES {balanceSheet.liabilities.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Capital */}
            <div>
              <h3 className="font-medium text-lg mb-2">Capital</h3>
              <div className="pl-4 space-y-2">
                <div className="flex justify-between pl-4">
                  <span>Retained Earnings</span>
                  <span>
                    KES {balanceSheet.capital.retainedEarnings.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between pl-4">
                  <span>{"Owner's"} Capital</span>
                  <span>
                    KES {balanceSheet.capital.ownerCapital.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between font-medium border-t pt-1">
                  <span>Total Capital</span>
                  <span>KES {balanceSheet.capital.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between font-bold text-lg border-t-2 pt-2">
            <span>TOTAL LIABILITIES & CAPITAL</span>
            <span>
              KES {balanceSheet.totalLiabilitiesAndCapital.toLocaleString()}
            </span>
          </div>

          {!balanceSheet.balanceCheck && (
            <div className="text-red-500 text-sm mt-2">
              Warning: Assets do not equal Liabilities + Capital. Please check
              your entries.
            </div>
          )}
        </div>
      </div>

      {/* Profit & Loss Report */}
      <div className="bg-blue-50 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Profit & Loss Statement</h2>
        <div className="space-y-4">
          {/* Revenue */}
          <div className="flex justify-between">
            <span className="font-medium">Sales Revenue</span>
            <span>KES {profitAndLoss.salesRevenue.toLocaleString()}</span>
          </div>

          {/* Cost of Goods Sold */}
          <div className="pl-4 space-y-2">
            <div className="flex justify-between">
              <span>Less: Cost of Goods Sold</span>
              <span></span>
            </div>
            <div className="flex justify-between pl-4">
              <span>Opening Inventory</span>
              <span>
                KES {profitAndLoss.cogs.openingInventory.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between pl-4">
              <span>Add: Purchases</span>
              <span>KES {profitAndLoss.cogs.purchases.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pl-4">
              <span>Less: Closing Inventory</span>
              <span>
                KES {profitAndLoss.cogs.closingInventory.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between font-medium border-t pt-1">
              <span>Total Cost of Goods Sold</span>
              <span>KES {profitAndLoss.cogs.total.toLocaleString()}</span>
            </div>
          </div>

          {/* Gross Profit */}
          <div className="flex justify-between font-medium border-t pt-2">
            <span>Gross Profit</span>
            <span>KES {profitAndLoss.grossProfit.toLocaleString()}</span>
          </div>

          {/* Operating Expenses */}
          <div className="pl-4 space-y-2">
            <div className="flex justify-between">
              <span>Less: Operating Expenses</span>
              <span></span>
            </div>
            <div className="flex justify-between pl-4">
              <span>Rent</span>
              <span>
                KES {profitAndLoss.operatingExpenses.rent.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between pl-4">
              <span>Transport</span>
              <span>
                KES {profitAndLoss.operatingExpenses.transport.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between pl-4">
              <span>Salaries</span>
              <span>
                KES {profitAndLoss.operatingExpenses.salaries.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between pl-4">
              <span>Marketing</span>
              <span>
                KES {profitAndLoss.operatingExpenses.marketing.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between pl-4">
              <span>General Expenses</span>
              <span>
                KES{" "}
                {profitAndLoss.operatingExpenses.generalExpenses.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between font-medium border-t pt-1">
              <span>Total Operating Expenses</span>
              <span>
                KES {profitAndLoss.operatingExpenses.total.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Net Profit */}
          <div className="flex justify-between font-bold text-lg border-t-2 pt-2">
            <span>NET PROFIT</span>
            <span
              className={
                profitAndLoss.netProfit >= 0 ? "text-green-600" : "text-red-600"
              }
            >
              KES {profitAndLoss.netProfit.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="h-20"></div>
    </div>
  );
};

export default FinancialReportPage;
