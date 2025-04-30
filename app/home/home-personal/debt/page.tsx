"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { addDoc, collection, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "@/configs/firebaseConfig";
import { toast } from 'react-hot-toast';
import { useRouter } from "next/navigation";

interface DebtEntry {
  id?: string;
  name: string;
  amount: string;
  dueDate: string;
  status: string;
  createdAt?: Date;
}

interface UpcomingPayment {
  id?: string;
  type: string;
  name: string;
  amount: string;
  dueDate: string;
}

export default function DebtManagementPage() {
  const [loading, setLoading] = useState(true);
  const [newCreditor, setNewCreditor] = useState({ name: "", amount: "", dueDate: "" });
  const [newDebtor, setNewDebtor] = useState({ name: "", amount: "", dueDate: "" });
  const [creditors, setCreditors] = useState<DebtEntry[]>([]);
  const [debtors, setDebtors] = useState<DebtEntry[]>([]);
  const [upcomingPayments, setUpcomingPayments] = useState<UpcomingPayment[]>([]);
  const router = useRouter()

  // Load data from Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch creditors
        const creditorsSnapshot = await getDocs(collection(db, "creditors"));
        const creditorsData = creditorsSnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          amount: doc.data().amount,
          dueDate: doc.data().dueDate,
          status: doc.data().status,
          createdAt: doc.data().createdAt?.toDate()
        })) as DebtEntry[];
        setCreditors(creditorsData);

        // Fetch debtors
        const debtorsSnapshot = await getDocs(collection(db, "debtors"));
        const debtorsData = debtorsSnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          amount: doc.data().amount,
          dueDate: doc.data().dueDate,
          status: doc.data().status,
          createdAt: doc.data().createdAt?.toDate()
        })) as DebtEntry[];
        setDebtors(debtorsData);

        // Calculate upcoming payments (next 30 days)
        const now = new Date();
        const thirtyDaysFromNow = new Date(now.setDate(now.getDate() + 30));
        
        const upcomingCreditors = creditorsData
          .filter(c => new Date(c.dueDate) <= thirtyDaysFromNow)
          .map(c => ({ 
            id: c.id,
            type: "Creditor", 
            name: c.name, 
            amount: c.amount, 
            dueDate: c.dueDate 
          }));
        
        const upcomingDebtors = debtorsData
          .filter(d => new Date(d.dueDate) <= thirtyDaysFromNow)
          .map(d => ({ 
            id: d.id,
            type: "Debtor", 
            name: d.name, 
            amount: d.amount, 
            dueDate: d.dueDate 
          }));
        
        setUpcomingPayments([...upcomingCreditors, ...upcomingDebtors]);
        
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load debt data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddCreditor = async () => {
    if (!newCreditor.name || !newCreditor.amount || !newCreditor.dueDate) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      await addDoc(collection(db, "creditors"), {
        ...newCreditor,
        status: "Active",
        createdAt: serverTimestamp()
      });
      
      toast.success("Creditor added successfully!");
      setNewCreditor({ name: "", amount: "", dueDate: "" });
      
      // Refresh data
      const snapshot = await getDocs(collection(db, "creditors"));
      const creditorsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as DebtEntry[];
      setCreditors(creditorsData);
    } catch (error) {
      console.error("Error adding creditor:", error);
      toast.error("Failed to add creditor");
    }
  };

  const handleAddDebtor = async () => {
    if (!newDebtor.name || !newDebtor.amount || !newDebtor.dueDate) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      await addDoc(collection(db, "debtors"), {
        ...newDebtor,
        status: "Pending",
        createdAt: serverTimestamp()
      });
      
      toast.success("Debtor added successfully!");
      setNewDebtor({ name: "", amount: "", dueDate: "" });
      
      // Refresh data
      const snapshot = await getDocs(collection(db, "debtors"));
      const debtorsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as DebtEntry[];
      setDebtors(debtorsData);
      
      // Update upcoming payments
      const now = new Date();
      const thirtyDaysFromNow = new Date(now.setDate(now.getDate() + 30));
      const newUpcomingDebtors = debtorsData
        .filter(d => new Date(d.dueDate) <= thirtyDaysFromNow)
        .map(d => ({ 
          id: d.id,
          type: "Debtor", 
          name: d.name, 
          amount: d.amount, 
          dueDate: d.dueDate 
        }));
      
      setUpcomingPayments(prev => [
        ...prev.filter(p => p.type !== "Debtor"),
        ...newUpcomingDebtors
      ]);
    } catch (error) {
      console.error("Error adding debtor:", error);
      toast.error("Failed to add debtor");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading debt data...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6 font-poppins px-4">
      <h1 className="text-3xl font-bold text-center">Debt Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Creditors Card */}
        <Card className="bg-red-50">
          <CardHeader>
            <CardTitle>Creditors</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {creditors.map((creditor) => (
                  <TableRow key={creditor.id}>
                    <TableCell>{creditor.name}</TableCell>
                    <TableCell>${creditor.amount}</TableCell>
                    <TableCell>{new Date(creditor.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell>{creditor.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button variant="outline">View All Creditors</Button>
          </CardFooter>
        </Card>

        {/* Debtors Card */}
        <Card className="bg-green-50">
          <CardHeader>
            <CardTitle>Debtors</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {debtors.map((debtor) => (
                  <TableRow key={debtor.id}>
                    <TableCell>{debtor.name}</TableCell>
                    <TableCell>${debtor.amount}</TableCell>
                    <TableCell>{new Date(debtor.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell>{debtor.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button variant="outline">View All Debtors</Button>
          </CardFooter>
        </Card>
      </div>

      {/* Upcoming Payments Card */}
      <Card className="bg-blue-50">
        <CardHeader>
          <CardTitle>Upcoming Debt Repayment</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {upcomingPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.type}</TableCell>
                  <TableCell>{payment.name}</TableCell>
                  <TableCell>${payment.amount}</TableCell>
                  <TableCell>{new Date(payment.dueDate).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="outline">View All Payments</Button>
        </CardFooter>
      </Card>

      {/* Actions Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Add New Creditor */}
        <Card>
          <CardHeader>
            <CardTitle>Add New Creditor (Debt)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Creditor Name"
              value={newCreditor.name}
              onChange={(e) => setNewCreditor({ ...newCreditor, name: e.target.value })}
            />
            <Input
              placeholder="Amount"
              type="number"
              value={newCreditor.amount}
              onChange={(e) => setNewCreditor({ ...newCreditor, amount: e.target.value })}
            />
            <Input
              type="date"
              value={newCreditor.dueDate}
              onChange={(e) => setNewCreditor({ ...newCreditor, dueDate: e.target.value })}
            />
          </CardContent>
          <CardFooter>
            <Button onClick={handleAddCreditor} className="w-full">
              Add Creditor
            </Button>
          </CardFooter>
        </Card>

        {/* Add New Debtor */}
        <Card>
          <CardHeader>
            <CardTitle>Add New Debtor (Debt)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Debtor Name"
              value={newDebtor.name}
              onChange={(e) => setNewDebtor({ ...newDebtor, name: e.target.value })}
            />
            <Input
              placeholder="Amount"
              type="number"
              value={newDebtor.amount}
              onChange={(e) => setNewDebtor({ ...newDebtor, amount: e.target.value })}
            />
            <Input
              type="date"
              value={newDebtor.dueDate}
              onChange={(e) => setNewDebtor({ ...newDebtor, dueDate: e.target.value })}
            />
          </CardContent>
          <CardFooter>
            <Button onClick={handleAddDebtor} className="w-full">
              Add Debtor
            </Button>
          </CardFooter>
        </Card>
         
      </div>

      {/* Analytics Section */}
      <Card>
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Get your data health</h3>
              <p className="text-sm text-gray-600 mb-4">
                Get debt health and recommendations based on your debt management
              </p>
              <Button variant="outline">Learn More</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Repayment Methods</CardTitle>
        </CardHeader>
        <CardContent>
        <div>
         <h3 className="font-semibold mb-2">Debt Repayment Protected</h3>
              <p className="text-sm text-gray-600 mb-4">
                Get the loan deposit approach to debt management. Procedure method. Cancel method. 
                Choose a material element for repayment.
              </p>
              <Button 
              onClick={()=>router.push('/home/home-personal/repayment')}
              variant="outline">Learn More</Button>
            </div>
        </CardContent>
      </Card>
      <div className="h-[55px]"></div>
    </div>
  );
}