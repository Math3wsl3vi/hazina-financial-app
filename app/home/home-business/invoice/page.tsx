"use client";
import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/configs/firebaseConfig';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface InvoicingRecord {
  id: string;
  type: 'customer' | 'supplier';
  name: string;
  productService: string;
  quantity: number;
  dueDate: string;
  pricePerItem: number;
  unpaidBalance?: number; // For customers
  amountToBePaid?: number; // For suppliers
  amountDue?: number; // For suppliers
  createdAt: Timestamp
}

const InvoicingPage = () => {
  // State for Customer form
  const [customerName, setCustomerName] = useState('');
  const [customerProductService, setCustomerProductService] = useState('');
  const [customerQuantity, setCustomerQuantity] = useState('');
  const [customerDueDate, setCustomerDueDate] = useState('');
  const [customerPricePerItem, setCustomerPricePerItem] = useState('');
  const [customerUnpaidBalance, setCustomerUnpaidBalance] = useState('');
  const [customerError, setCustomerError] = useState('');
  const [customerSuccess, setCustomerSuccess] = useState('');

  // State for Supplier form
  const [supplierName, setSupplierName] = useState('');
  const [supplierProductService, setSupplierProductService] = useState('');
  const [supplierQuantity, setSupplierQuantity] = useState('');
  const [supplierPricePerItem, setSupplierPricePerItem] = useState('');
  const [supplierAmountToBePaid, setSupplierAmountToBePaid] = useState('');
  const [supplierAmountDue, setSupplierAmountDue] = useState('');
  const [supplierError, setSupplierError] = useState('');
  const [supplierSuccess, setSupplierSuccess] = useState('');


  // State to store fetched records
  const [customerRecords, setCustomerRecords] = useState<InvoicingRecord[]>([]);
  const [supplierRecords, setSupplierRecords] = useState<InvoicingRecord[]>([]);

  // Fetch records from Firestore in real-time
  useEffect(() => {
    const invoicingQuery = query(
      collection(db, 'invoicingRecords'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(invoicingQuery, (snapshot) => {
      const records: InvoicingRecord[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as InvoicingRecord[];

      setCustomerRecords(records.filter((record) => record.type === 'customer'));
      setSupplierRecords(records.filter((record) => record.type === 'supplier'));
    }, (error) => {
      console.error('Error fetching records:', error);
    });

    return () => unsubscribe();
  }, []);

  // Calculate totals
  const customerTotal = customerRecords.reduce((sum, record) => sum + (record.unpaidBalance || 0), 0);
  const supplierTotal = supplierRecords.reduce((sum, record) => sum + (record.amountDue || 0), 0);

  // Function to handle adding customer
  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setCustomerError('');
    setCustomerSuccess('');

    if (
      !customerName ||
      !customerProductService ||
      !customerQuantity ||
      !customerDueDate ||
      !customerPricePerItem ||
      !customerUnpaidBalance
    ) {
      setCustomerError('Please fill in all fields');
      return;
    }

    const quantity = Number(customerQuantity);
    const pricePerItem = Number(customerPricePerItem);
    const unpaidBalance = Number(customerUnpaidBalance);

    if (isNaN(quantity) || quantity <= 0) {
      setCustomerError('Quantity must be a positive number');
      return;
    }
    if (isNaN(pricePerItem) || pricePerItem <= 0) {
      setCustomerError('Price per item must be a positive number');
      return;
    }
    if (isNaN(unpaidBalance) || unpaidBalance < 0) {
      setCustomerError('Unpaid balance must be a non-negative number');
      return;
    }

    try {
      await addDoc(collection(db, 'invoicingRecords'), {
        type: 'customer',
        name: customerName,
        productService: customerProductService,
        quantity: quantity,
        dueDate: customerDueDate,
        pricePerItem: pricePerItem,
        unpaidBalance: unpaidBalance,
        createdAt: serverTimestamp(),
      });
      setCustomerSuccess('Customer added successfully!');
      setCustomerName('');
      setCustomerProductService('');
      setCustomerQuantity('');
      setCustomerDueDate('');
      setCustomerPricePerItem('');
      setCustomerUnpaidBalance('');
    } catch (error) {
      setCustomerError('Failed to add customer. Please try again.');
      console.error('Error adding customer:', error);
    }
  };

  // Function to handle adding supplier
  const handleAddSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    setSupplierError('');
    setSupplierSuccess('');

    if (
      !supplierName ||
      !supplierProductService ||
      !supplierQuantity ||
      !supplierPricePerItem ||
      !supplierAmountToBePaid ||
      !supplierAmountDue
    ) {
      setSupplierError('Please fill in all fields');
      return;
    }

    const quantity = Number(supplierQuantity);
    const pricePerItem = Number(supplierPricePerItem);
    const amountToBePaid = Number(supplierAmountToBePaid);
    const amountDue = Number(supplierAmountDue);

    if (isNaN(quantity) || quantity <= 0) {
      setSupplierError('Quantity must be a positive number');
      return;
    }
    if (isNaN(pricePerItem) || pricePerItem <= 0) {
      setSupplierError('Price per item must be a positive number');
      return;
    }
    if (isNaN(amountToBePaid) || amountToBePaid < 0) {
      setSupplierError('Amount to be paid must be a non-negative number');
      return;
    }
    if (isNaN(amountDue) || amountDue < 0) {
      setSupplierError('Amount due must be a non-negative number');
      return;
    }

    try {
      await addDoc(collection(db, 'invoicingRecords'), {
        type: 'supplier',
        name: supplierName,
        productService: supplierProductService,
        quantity: quantity,
        pricePerItem: pricePerItem,
        amountToBePaid: amountToBePaid,
        amountDue: amountDue,
        createdAt: serverTimestamp(),
      });
      setSupplierSuccess('Supplier added successfully!');
      setSupplierName('');
      setSupplierProductService('');
      setSupplierQuantity('');
      setSupplierPricePerItem('');
      setSupplierAmountToBePaid('');
      setSupplierAmountDue('');
    } catch (error) {
      setSupplierError('Failed to add supplier. Please try again.');
      console.error('Error adding supplier:', error);
    }
  };

  return (
    <div className="p-5 max-w-2xl mx-auto font-poppins">
      {/* Customer Section */}
      <div className="mb-8">
        <h2 className="font-poppins text-xl font-semibold mb-4">Payments to be Received (Customer)</h2>
        <form onSubmit={handleAddCustomer} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customerName" className="block text-sm font-medium">
                Name
              </Label>
              <Input
                id="customerName"
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full"
                placeholder="Enter customer name"
              />
            </div>
            <div>
              <Label htmlFor="customerProductService" className="block text-sm font-medium">
                Product/Service
              </Label>
              <Input
                id="customerProductService"
                type="text"
                value={customerProductService}
                onChange={(e) => setCustomerProductService(e.target.value)}
                className="w-full"
                placeholder="Enter product/service"
              />
            </div>
            <div>
              <Label htmlFor="customerQuantity" className="block text-sm font-medium">
                Quantity
              </Label>
              <Input
                id="customerQuantity"
                type="number"
                min="1"
                value={customerQuantity}
                onChange={(e) => setCustomerQuantity(e.target.value)}
                className="w-full"
                placeholder="Enter quantity"
              />
            </div>
            <div>
              <Label htmlFor="customerDueDate" className="block text-sm font-medium">
                When (Due Date)
              </Label>
              <Input
                id="customerDueDate"
                type="date"
                value={customerDueDate}
                onChange={(e) => setCustomerDueDate(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="customerPricePerItem" className="block text-sm font-medium">
                Price per Item
              </Label>
              <Input
                id="customerPricePerItem"
                type="number"
                step="0.01"
                min="0"
                value={customerPricePerItem}
                onChange={(e) => setCustomerPricePerItem(e.target.value)}
                className="w-full"
                placeholder="Enter price per item"
              />
            </div>
            <div>
              <Label htmlFor="customerUnpaidBalance" className="block text-sm font-medium">
                Unpaid Balance
              </Label>
              <Input
                id="customerUnpaidBalance"
                type="number"
                step="0.01"
                min="0"
                value={customerUnpaidBalance}
                onChange={(e) => setCustomerUnpaidBalance(e.target.value)}
                className="w-full"
                placeholder="Enter unpaid balance"
              />
            </div>
          </div>
          {customerError && (
            <p className="text-xs text-red-500">{customerError}</p>
          )}
          {customerSuccess && (
            <p className="text-xs text-green-500">{customerSuccess}</p>
          )}
          <Button type="submit" className="w-full">
            Add Customer
          </Button>
        </form>

        {/* Display Customer Records */}
        <div className="mt-4">
          <h3 className="font-poppins text-sm font-medium mb-2">Recent Customers</h3>
          {customerRecords.length === 0 ? (
            <p className="text-sm text-gray-500">No customer records yet.</p>
          ) : (
            <>
              <ul className="space-y-2">
                {customerRecords.map((record) => (
                  <li
                    key={record.id}
                    className="flex flex-col p-2 bg-green-50 rounded-md text-sm"
                  >
                    <div className="flex justify-between">
                      <span>{record.name}</span>
                      <span>KES {record.unpaidBalance?.toFixed(2)}</span>
                    </div>
                    <div className="text-gray-600">
                      <span>{record.productService} | Qty: {record.quantity} | </span>
                      <span>Price/Item: KES {record.pricePerItem.toFixed(2)} | </span>
                      <span>Due: {record.dueDate}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-2 font-poppins text-sm font-semibold">
                Total Unpaid Balance: KES {customerTotal.toFixed(2)}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Supplier Section */}
      <div>
        <h2 className="font-poppins text-xl font-semibold mb-4">Payments to be Made (Supplier)</h2>
        <form onSubmit={handleAddSupplier} className=" Незавершённый код...space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="supplierName" className="block text-sm font-medium">
                Name
              </Label>
              <Input
                id="supplierName"
                type="text"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                className="w-full"
                placeholder="Enter supplier name"
              />
            </div>
            <div>
              <Label htmlFor="supplierProductService" className="block text-sm font-medium">
                Product/Service
              </Label>
              <Input
                id="supplierProductService"
                type="text"
                value={supplierProductService}
                onChange={(e) => setSupplierProductService(e.target.value)}
                className="w-full"
                placeholder="Enter product/service"
              />
            </div>
            <div>
              <Label htmlFor="supplierQuantity" className="block text-sm font-medium">
                Quantity
              </Label>
              <Input
                id="supplierQuantity"
                type="number"
                min="1"
                value={supplierQuantity}
                onChange={(e) => setSupplierQuantity(e.target.value)}
                className="w-full"
                placeholder="Enter quantity"
              />
            </div>
            <div>
              <Label htmlFor="supplierPricePerItem" className="block text-sm font-medium">
                Price per Item
              </Label>
              <Input
                id="supplierPricePerItem"
                type="number"
                step="0.01"
                min="0"
                value={supplierPricePerItem}
                onChange={(e) => setSupplierPricePerItem(e.target.value)}
                className="w-full"
                placeholder="Enter price per item"
              />
            </div>
            <div>
              <Label htmlFor="supplierAmountToBePaid" className="block text-sm font-medium">
                Amount to be Paid
              </Label>
              <Input
                id="supplierAmountToBePaid"
                type="number"
                step="0.01"
                min="0"
                value={supplierAmountToBePaid}
                onChange={(e) => setSupplierAmountToBePaid(e.target.value)}
                className="w-full"
                placeholder="Enter amount to be paid"
              />
            </div>
            <div>
              <Label htmlFor="supplierAmountDue" className="block text-sm font-medium">
                Amount Due
              </Label>
              <Input
                id="supplierAmountDue"
                type="number"
                step="0.01"
                min="0"
                value={supplierAmountDue}
                onChange={(e) => setSupplierAmountDue(e.target.value)}
                className="w-full"
                placeholder="Enter amount due"
              />
            </div>
          </div>
          {supplierError && (
            <p className="text-xs text-red-500">{supplierError}</p>
          )}
          {supplierSuccess && (
            <p className="text-xs text-green-500">{supplierSuccess}</p>
          )}
          <Button type="submit" className="w-full mt-5">
            Add Supplier
          </Button>
        </form>

        {/* Display Supplier Records */}
        <div className="mt-4">
          <h3 className="font-poppins text-sm font-medium mb-2">Recent Suppliers</h3>
          {supplierRecords.length === 0 ? (
            <p className="text-sm text-gray-500">No supplier records yet.</p>
          ) : (
            <>
              <ul className="space-y-2">
                {supplierRecords.map((record) => (
                  <li
                    key={record.id}
                    className="flex flex-col p-2 bg-red-50 rounded-md text-sm"
                  >
                    <div className="flex justify-between">
                      <span>{record.name}</span>
                      <span>KES {record.amountDue?.toFixed(2)}</span>
                    </div>
                    <div className="text-gray-600">
                      <span>{record.productService} | Qty: {record.quantity} | </span>
                      <span>Price/Item: KES {record.pricePerItem.toFixed(2)} | </span>
                      <span>To Pay: KES {record.amountToBePaid?.toFixed(2)}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-2 font-poppins text-sm font-semibold">
                Total Amount Due: KES {supplierTotal.toFixed(2)}
              </div>
            </>
          )}
        </div>
      </div>
      <div className='h-[105px]'></div>
    </div>
  );
};

export default InvoicingPage;