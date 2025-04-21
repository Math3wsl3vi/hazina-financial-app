"use client";
import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/configs/firebaseConfig';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface InventoryRecord {
  id: string;
  type: 'in' | 'out';
  name: string;
  quantity: number;
  price: number;
  note: string;
  createdAt:Timestamp
}

interface PayrollRecord {
  id: string;
  name: string;
  salaryAmount: number;
  note: string;
  createdAt:Timestamp
}

const InventoryPayrollPage = () => {
  // State for Inventory "In" form
  const [inName, setInName] = useState('');
  const [inQuantity, setInQuantity] = useState('');
  const [inPrice, setInPrice] = useState('');
  const [inNote, setInNote] = useState('');
  const [inError, setInError] = useState('');
  const [inSuccess, setInSuccess] = useState('');

  // State for Inventory "Out" form
  const [outName, setOutName] = useState('');
  const [outQuantity, setOutQuantity] = useState('');
  const [outPrice, setOutPrice] = useState('');
  const [outNote, setOutNote] = useState('');
  const [outError, setOutError] = useState('');
  const [outSuccess, setOutSuccess] = useState('');

  // State for Payroll form
  const [payrollName, setPayrollName] = useState('');
  const [payrollSalaryAmount, setPayrollSalaryAmount] = useState('');
  const [payrollNote, setPayrollNote] = useState('');
  const [payrollError, setPayrollError] = useState('');
  const [payrollSuccess, setPayrollSuccess] = useState('');

  // State to store fetched records
  const [inRecords, setInRecords] = useState<InventoryRecord[]>([]);
  const [outRecords, setOutRecords] = useState<InventoryRecord[]>([]);
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);

  // Fetch inventory records from Firestore in real-time
  useEffect(() => {
    const inventoryQuery = query(
      collection(db, 'inventoryRecords'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeInventory = onSnapshot(inventoryQuery, (snapshot) => {
      const records: InventoryRecord[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as InventoryRecord[];

      setInRecords(records.filter((record) => record.type === 'in'));
      setOutRecords(records.filter((record) => record.type === 'out'));
    }, (error) => {
      console.error('Error fetching inventory records:', error);
    });

    // Fetch payroll records
    const payrollQuery = query(
      collection(db, 'payrollRecords'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribePayroll = onSnapshot(payrollQuery, (snapshot) => {
      const records: PayrollRecord[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as PayrollRecord[];

      setPayrollRecords(records);
    }, (error) => {
      console.error('Error fetching payroll records:', error);
    });

    return () => {
      unsubscribeInventory();
      unsubscribePayroll();
    };
  }, []);

  // Calculate payroll totals
  const totalEmployees = payrollRecords.length;
  const totalSalaries = payrollRecords.reduce((sum, record) => sum + record.salaryAmount, 0);

  // Function to handle adding inventory "In"
  const handleAddIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setInError('');
    setInSuccess('');

    if (!inName || !inQuantity || !inPrice ) {
      setInError('Please fill in all fields');
      return;
    }

    const quantity = Number(inQuantity);
    const price = Number(inPrice);

    if (isNaN(quantity) || quantity <= 0) {
      setInError('Quantity must be a positive number');
      return;
    }
    if (isNaN(price) || price <= 0) {
      setInError('Price must be a positive number');
      return;
    }

    try {
      await addDoc(collection(db, 'inventoryRecords'), {
        type: 'in',
        name: inName,
        quantity: quantity,
        price: price,
        note: inNote,
        createdAt: serverTimestamp(),
      });
      setInSuccess('Inventory "In" added successfully!');
      setInName('');
      setInQuantity('');
      setInPrice('');
      setInNote('');
    } catch (error) {
      setInError('Failed to add inventory "In". Please try again.');
      console.error('Error adding inventory "In":', error);
    }
  };

  // Function to handle adding inventory "Out"
  const handleAddOut = async (e: React.FormEvent) => {
    e.preventDefault();
    setOutError('');
    setOutSuccess('');

    if (!outName || !outQuantity || !outPrice ) {
      setOutError('Please fill in all fields');
      return;
    }

    const quantity = Number(outQuantity);
    const price = Number(outPrice);

    if (isNaN(quantity) || quantity <= 0) {
      setOutError('Quantity must be a positive number');
      return;
    }
    if (isNaN(price) || price <= 0) {
      setOutError('Price must be a positive number');
      return;
    }

    try {
      await addDoc(collection(db, 'inventoryRecords'), {
        type: 'out',
        name: outName,
        quantity: quantity,
        price: price,
        note: outNote,
        createdAt: serverTimestamp(),
      });
      setOutSuccess('Inventory "Out" added successfully!');
      setOutName('');
      setOutQuantity('');
      setOutPrice('');
      setOutNote('');
    } catch (error) {
      setOutError('Failed to add inventory "Out". Please try again.');
      console.error('Error adding inventory "Out":', error);
    }
  };

  // Function to handle adding payroll
  const handleAddPayroll = async (e: React.FormEvent) => {
    e.preventDefault();
    setPayrollError('');
    setPayrollSuccess('');

    if (!payrollName || !payrollSalaryAmount) {
      setPayrollError('Please fill in all fields');
      return;
    }

    const salaryAmount = Number(payrollSalaryAmount);

    if (isNaN(salaryAmount) || salaryAmount <= 0) {
      setPayrollError('Salary amount must be a positive number');
      return;
    }

    try {
      await addDoc(collection(db, 'payrollRecords'), {
        name: payrollName,
        salaryAmount: salaryAmount,
        note: payrollNote,
        createdAt: serverTimestamp(),
      });
      setPayrollSuccess('Payroll entry added successfully!');
      setPayrollName('');
      setPayrollSalaryAmount('');
      setPayrollNote('');
    } catch (error) {
      setPayrollError('Failed to add payroll entry. Please try again.');
      console.error('Error adding payroll entry:', error);
    }
  };

  return (
    <div className="p-5 max-w-2xl mx-auto mt-20 font-poppins">
      {/* Inventory Section */}
      <div className="mb-8 -mt-20">
        <h2 className="font-poppins text-xl font-semibold mb-4">Inventory</h2>

        {/* Inventory "In" Form */}
        <h3 className="font-poppins text-lg font-medium mb-2">Inventory In</h3>
        <form onSubmit={handleAddIn} className="space-y-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="inName" className="block text-sm font-medium">
                Name
              </Label>
              <Input
                id="inName"
                type="text"
                value={inName}
                onChange={(e) => setInName(e.target.value)}
                className="w-full"
                placeholder="Enter item name"
              />
            </div>
            <div>
              <Label htmlFor="inQuantity" className="block text-sm font-medium">
                Quantity
              </Label>
              <Input
                id="inQuantity"
                type="number"
                min="1"
                value={inQuantity}
                onChange={(e) => setInQuantity(e.target.value)}
                className="w-full"
                placeholder="Enter quantity"
              />
            </div>
            <div>
              <Label htmlFor="inPrice" className="block text-sm font-medium">
                Price
              </Label>
              <Input
                id="inPrice"
                type="number"
                step="0.01"
                min="0"
                value={inPrice}
                onChange={(e) => setInPrice(e.target.value)}
                className="w-full"
                placeholder="Enter price"
              />
            </div>
            <div>
              <Label htmlFor="inNote" className="block text-sm font-medium">
                Note
              </Label>
              <Input
                id="inNote"
                type="text"
                value={inNote}
                onChange={(e) => setInNote(e.target.value)}
                className="w-full"
                placeholder="Enter note"
              />
            </div>
          </div>
          {inError && <p className="text-xs text-red-500">{inError}</p>}
          {inSuccess && <p className="text-xs text-green-500">{inSuccess}</p>}
          <Button type="submit" className="w-full">Add Inventory In</Button>
        </form>

        {/* Display Inventory "In" Records */}
        <div className="mt-4">
          <h4 className="font-poppins text-sm font-medium mb-2">Recent Inventory In</h4>
          {inRecords.length === 0 ? (
            <p className="text-sm text-gray-500">No inventory {"In"} records yet.</p>
          ) : (
            <ul className="space-y-2">
              {inRecords.map((record) => (
                <li
                  key={record.id}
                  className="flex flex-col p-2 bg-gray-100 rounded-md text-sm"
                >
                  <div className="flex justify-between">
                    <span>{record.name}</span>
                    <span>KES {record.price.toFixed(2)}</span>
                  </div>
                  <div className="text-gray-600">
                    <span>Qty: {record.quantity} | Note: {record.note}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Inventory "Out" Form */}
        <h3 className="font-poppins text-lg font-medium mb-2 mt-6">Inventory Out</h3>
        <form onSubmit={handleAddOut} className="space-y-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="outName" className="block text-sm font-medium">
                Name
              </Label>
              <Input
                id="outName"
                type="text"
                value={outName}
                onChange={(e) => setOutName(e.target.value)}
                className="w-full"
                placeholder="Enter item name"
              />
            </div>
            <div>
              <Label htmlFor="outQuantity" className="block text-sm font-medium">
                Quantity
              </Label>
              <Input
                id="outQuantity"
                type="number"
                min="1"
                value={outQuantity}
                onChange={(e) => setOutQuantity(e.target.value)}
                className="w-full"
                placeholder="Enter quantity"
              />
            </div>
            <div>
              <Label htmlFor="outPrice" className="block text-sm font-medium">
                Price
              </Label>
              <Input
                id="outPrice"
                type="number"
                step="0.01"
                min="0"
                value={outPrice}
                onChange={(e) => setOutPrice(e.target.value)}
                className="w-full"
                placeholder="Enter price"
              />
            </div>
            <div>
              <Label htmlFor="outNote" className="block text-sm font-medium">
                Note
              </Label>
              <Input
                id="outNote"
                type="text"
                value={outNote}
                onChange={(e) => setOutNote(e.target.value)}
                className="w-full"
                placeholder="Enter note"
              />
            </div>
          </div>
          {outError && <p className="text-xs text-red-500">{outError}</p>}
          {outSuccess && <p className="text-xs text-green-500">{outSuccess}</p>}
          <Button type="submit" className="w-full">Add Inventory Out</Button>
        </form>

        {/* Display Inventory "Out" Records */}
        <div className="mt-4">
          <h4 className="font-poppins text-sm font-medium mb-2">Recent Inventory Out</h4>
          {outRecords.length === 0 ? (
            <p className="text-sm text-gray-500">No inventory {"Out"} records yet.</p>
          ) : (
            <ul className="space-y-2">
              {outRecords.map((record) => (
                <li
                  key={record.id}
                  className="flex flex-col p-2 bg-gray-100 rounded-md text-sm"
                >
                  <div className="flex justify-between">
                    <span>{record.name}</span>
                    <span>KES {record.price.toFixed(2)}</span>
                  </div>
                  <div className="text-gray-600">
                    <span>Qty: {record.quantity} | Note: {record.note}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Payroll Section */}
      <div>
        <h2 className="font-poppins text-xl font-semibold mb-4">Payroll</h2>
        <form onSubmit={handleAddPayroll} className="space-y-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="payrollName" className="block text-sm font-medium">
                Name
              </Label>
              <Input
                id="payrollName"
                type="text"
                value={payrollName}
                onChange={(e) => setPayrollName(e.target.value)}
                className="w-full"
                placeholder="Enter employee name"
              />
            </div>
            <div>
              <Label htmlFor="payrollSalaryAmount" className="block text-sm font-medium">
                Salary Amount
              </Label>
              <Input
                id="payrollSalaryAmount"
                type="number"
                step="0.01"
                min="0"
                value={payrollSalaryAmount}
                onChange={(e) => setPayrollSalaryAmount(e.target.value)}
                className="w-full"
                placeholder="Enter salary amount"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="payrollNote" className="block text-sm font-medium">
                Note
              </Label>
              <Input
                id="payrollNote"
                type="text"
                value={payrollNote}
                onChange={(e) => setPayrollNote(e.target.value)}
                className="w-full"
                placeholder="Enter note"
              />
            </div>
          </div>
          {payrollError && <p className="text-xs text-red-500">{payrollError}</p>}
          {payrollSuccess && <p className="text-xs text-green-500">{payrollSuccess}</p>}
          <Button type="submit" className="w-full">Add Payroll Entry</Button>
        </form>

        {/* Display Payroll Records */}
        <div className="mt-4">
          <h4 className="font-poppins text-sm font-medium mb-2">Employee List</h4>
          {payrollRecords.length === 0 ? (
            <p className="text-sm text-gray-500">No payroll records yet.</p>
          ) : (
            <>
              <ul className="space-y-2">
                {payrollRecords.map((record) => (
                  <li
                    key={record.id}
                    className="flex flex-col p-2 bg-gray-100 rounded-md text-sm"
                  >
                    <div className="flex justify-between">
                      <span>{record.name}</span>
                      <span>KES {record.salaryAmount.toFixed(2)}</span>
                    </div>
                    <div className="text-gray-600">
                      <span>Note: {record.note}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-2 font-poppins text-sm font-semibold">
                Total Employees: {totalEmployees} | Total Salaries: KES {totalSalaries.toFixed(2)}
              </div>
            </>
          )}
        </div>
      </div>
      <div className='h-[105px]'></div>
    </div>
  );
};

export default InventoryPayrollPage;