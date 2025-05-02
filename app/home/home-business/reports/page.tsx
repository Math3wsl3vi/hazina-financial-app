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
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Mock useAuth hook (replace with your actual auth logic)
const useAuth = () => {
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
      } else {
        setUid(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return { uid };
};

// Interface for streak data in Firestore
interface StreakRecord {
  date: string;
}

interface FinancialRecord {
  id: string;
  type: "income" | "expense";
  amount: number;
  createdAt: Timestamp;
  category?: string;
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
  landAndBuilding: number;
  plantPropertyEquipment: number;
  cashInHand: number;
  inventory: number;
  debtors: number;
  creditors: number;
  bankOverdraft: number;
  mortgage: number;
  retainedEarnings: number;
  ownerCapital: number;
  incomeFromSales: number;
  openingInventory: number;
  purchases: number;
  closingInventory: number;
  rent: number;
  transport: number;
  salaries: number;
  marketing: number;
  generalExpenses: number;
  otherIncome: number;
  salesRevenue: number;
}

const FinancialReportPage = () => {
  const { uid } = useAuth(); // Get the current user's UID
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
      salesRevenue: 0,
      openingInventory: 0,
      purchases: 0,
      closingInventory: 0,
      rent: 0,
      transport: 0,
      salaries: 0,
      marketing: 0,
      generalExpenses: 0,
      otherIncome: 0,
    }
  );
  const [settingsError, setSettingsError] = useState("");
  const [settingsSuccess, setSettingsSuccess] = useState("");
  const [streak, setStreak] = useState<number>(0);
  const [streakBroken, setStreakBroken] = useState<boolean>(false);
  const [streakHistory, setStreakHistory] = useState<StreakRecord[]>([]);
  console.log(streak);
  console.log(streakBroken);
  console.log(streakHistory);

  // Fetch all records and streak data for the specific user
  useEffect(() => {
    if (!uid) return; // Wait until the UID is available

    // Financial Records
    const financialQuery = query(
      collection(db, `users/${uid}/financialRecords`),
      orderBy("createdAt", "desc")
    );
    const unsubscribeFinancial = onSnapshot(financialQuery, (snapshot) => {
      const records = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FinancialRecord[];
      setFinancialRecords(records);
    });

    // Invoicing Records
    const invoicingQuery = query(
      collection(db, `users/${uid}/invoicingRecords`),
      orderBy("createdAt", "desc")
    );
    const unsubscribeInvoicing = onSnapshot(invoicingQuery, (snapshot) => {
      const records = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as InvoicingRecord[];
      setInvoicingRecords(records);
    });

    // Inventory Records
    const inventoryQuery = query(
      collection(db, `users/${uid}/inventoryRecords`),
      orderBy("createdAt", "desc")
    );
    const unsubscribeInventory = onSnapshot(inventoryQuery, (snapshot) => {
      const records = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as InventoryRecord[];
      setInventoryRecords(records);
    });

    // Payroll Records
    const payrollQuery = query(
      collection(db, `users/${uid}/payrollRecords`),
      orderBy("createdAt", "desc")
    );
    const unsubscribePayroll = onSnapshot(payrollQuery, (snapshot) => {
      const records = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as PayrollRecord[];
      setPayrollRecords(records);
    });

    // Financial Settings
    const settingsDocRef = doc(db, `users/${uid}/financialSettings/settings`);
    const unsubscribeSettings = onSnapshot(settingsDocRef, (doc) => {
      if (doc.exists()) {
        setFinancialSettings(doc.data() as FinancialSettings);
      }
    });

    // Streak Data
    const streakQuery = query(
      collection(db, `users/${uid}/streakRecords`),
      orderBy("date", "desc")
    );
    const unsubscribeStreak = onSnapshot(streakQuery, (snapshot) => {
      const records = snapshot.docs.map((doc) => ({
        date: doc.data().date,
      })) as StreakRecord[];
      setStreakHistory(records);
      calculateStreak(records);
    });

    return () => {
      unsubscribeFinancial();
      unsubscribeInvoicing();
      unsubscribeInventory();
      unsubscribePayroll();
      unsubscribeSettings();
      unsubscribeStreak();
    };
  }, [uid]);

  // Function to calculate streak and check if it's broken
  const calculateStreak = (history: StreakRecord[]) => {
    if (history.length === 0) {
      setStreak(0);
      setStreakBroken(false);
      return;
    }

    // Sort history by date (newest first)
    const sortedHistory = history.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    let currentStreak = 1;
    let streakIsBroken = false;
    const now = new Date();
    const oneDayInMs = 24 * 60 * 60 * 1000; // 1 day in milliseconds

    // Remove duplicates by date (keep only the latest entry per day)
    const uniqueDates = Array.from(
      new Set(sortedHistory.map((record) => record.date.split("T")[0]))
    ).map(
      (date) =>
        sortedHistory.find((record) => record.date.split("T")[0] === date)!
    );

    for (let i = 0; i < uniqueDates.length - 1; i++) {
      const currentDate = new Date(uniqueDates[i].date);
      const nextDate = new Date(uniqueDates[i + 1].date);

      // Check if the current entry is within 1 day of the previous one
      const timeDiff = currentDate.getTime() - nextDate.getTime();
      if (timeDiff <= oneDayInMs * 1.1) {
        // Allow 10% buffer for flexibility
        currentStreak++;
      } else {
        break;
      }

      // Check if the streak is broken by comparing the latest entry to now
      const timeSinceLastEntry = now.getTime() - currentDate.getTime();
      if (timeSinceLastEntry > oneDayInMs * 1.1) {
        streakIsBroken = true;
      }
    }

    setStreak(currentStreak);
    setStreakBroken(streakIsBroken);
  };

  // Enhanced balance sheet calculation
  const calculateBalanceSheet = () => {
    const fixedAssets = {
      landAndBuilding: financialSettings.landAndBuilding,
      plantPropertyEquipment: financialSettings.plantPropertyEquipment,
      total:
        financialSettings.landAndBuilding +
        financialSettings.plantPropertyEquipment,
    };

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

    const capital = {
      retainedEarnings: financialSettings.retainedEarnings,
      ownerCapital: financialSettings.ownerCapital,
      total:
        financialSettings.retainedEarnings + financialSettings.ownerCapital,
    };

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
    const salesRevenue = inventoryRecords
      .filter((record) => record.type === "out")
      .reduce((total, record) => total + record.quantity * record.price, 0);

    const openingInventory = financialSettings.openingInventory;
    const purchases = inventoryRecords
      .filter((record) => record.type === "in")
      .reduce((total, record) => total + record.quantity * record.price, 0);
    const closingInventory = inventoryRecords.reduce((total, record) => {
      const value = record.quantity * record.price;
      return record.type === "in" ? total + value : total - value;
    }, openingInventory + purchases);

    const cogs = openingInventory + purchases - Math.max(0, closingInventory);
    const grossProfit = salesRevenue - cogs;

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

    const netProfit =
      grossProfit + financialSettings.otherIncome - operatingExpenses.total;

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

  // Handle settings save and update streak
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uid) {
      setSettingsError("User not authenticated. Please log in.");
      return;
    }

    setSettingsError("");
    setSettingsSuccess("");

    try {
      // Save financial settings
      await setDoc(
        doc(db, `users/${uid}/financialSettings/settings`),
        financialSettings
      );

      // Update streak
      const today = new Date().toISOString();
      const newStreakRecord: StreakRecord = { date: today };
      await setDoc(
        doc(db, `users/${uid}/streakRecords`, new Date().getTime().toString()),
        newStreakRecord
      );

      setSettingsSuccess("Financial settings saved successfully!");
      setTimeout(() => setSettingsSuccess(""), 3000);
    } catch (error) {
      setSettingsError("Failed to save financial settings");
      console.error("Error saving settings:", error);
    }
  };
  const resetAllValues = () => {
    // Create a new settings object with all values reset to 0
    const resetSettings: FinancialSettings = {
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
      salesRevenue: 0,
      openingInventory: 0,
      purchases: 0,
      closingInventory: 0,
      rent: 0,
      transport: 0,
      salaries: 0,
      marketing: 0,
      generalExpenses: 0,
      otherIncome: 0,
    };
    
    // Update the state with reset values
    setFinancialSettings(resetSettings);
    
    // Show a success message
    setSettingsSuccess("All values have been reset to zero.");
    setTimeout(() => setSettingsSuccess(""), 3000);
  };

  // Render UI
  if (!uid) {
    return (
      <div className="p-5 max-w-4xl mx-auto font-poppins">
        <p className="text-red-500">Please log in to view financial reports.</p>
      </div>
    );
  }

  return (
    <div className="p-5 max-w-4xl mx-auto font-poppins">
      {/* Streak Display */}
      {/* <div className="bg-gray-100 p-4 rounded-lg mb-8">
        <h3 className="text-lg font-semibold text-gray-800">
          Your Daily Financial Update Streak: {streak}
        </h3>
        {streakBroken && (
          <p className="text-red-600 mt-2">
            Streak Broken! You missed a daily financial update. Keep going to start a new streak!
          </p>
        )}
      </div> */}

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
              <h3 className="text-xl uppercase font-semibold">Balance Sheet</h3>
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
            <div className="space-y-2">
              <h3 className="font-semibold uppercase text-xl">Profit & Loss</h3>
              <div>
                <Label>Sales Inventory</Label>
                <Input
                  className="bg-white"
                  type="number"
                  value={financialSettings.salesRevenue}
                  onChange={(e) =>
                    setFinancialSettings({
                      ...financialSettings,
                      salesRevenue: Number(e.target.value),
                    })
                  }
                />
              </div>
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
              <div>
                <Label>Other Income</Label>
                <Input
                  className="bg-white"
                  type="number"
                  value={financialSettings.otherIncome}
                  onChange={(e) =>
                    setFinancialSettings({
                      ...financialSettings,
                      otherIncome: Number(e.target.value),
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
        <div className="space-y-4">
          {/* Assets */}
          <div>
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
          <div className="flex justify-between">
            <span className="font-medium">Sales Revenue</span>
            <span>KES {profitAndLoss.salesRevenue.toLocaleString()}</span>
          </div>

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

          <div className="flex justify-between font-medium border-t pt-2">
            <span>Gross Profit</span>
            <span>KES {profitAndLoss.grossProfit.toLocaleString()}</span>
          </div>

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
            <div className="flex justify-between">
            <span>Add: Other Income</span>
            <span>KES {financialSettings.otherIncome.toLocaleString()}</span>
          </div>
            <div className="flex justify-between font-medium border-t pt-1">
              <span>Total Operating Expenses</span>
              <span>
                KES {profitAndLoss.operatingExpenses.total.toLocaleString()}
              </span>
            </div>
          </div>

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
      <div className="md:col-span-2">
  {settingsError && (
    <p className="text-red-500 text-sm">{settingsError}</p>
  )}
  {settingsSuccess && (
    <p className="text-green-500 text-sm">{settingsSuccess}</p>
  )}
  <div className="flex gap-4 mt-4">
    <Button type="submit" className="flex-1">
      Save Settings
    </Button>
    <Button 
      type="button" 
      className="flex-1 bg-red-500 hover:bg-red-600" 
      onClick={resetAllValues}
    >
      Reset All Values
    </Button>
  </div>
</div>

      <div className="h-[10px]"></div>
    </div>
  );
};

export default FinancialReportPage;
