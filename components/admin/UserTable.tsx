// components/UserTable.tsx
"use client";

import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { db } from "@/configs/firebaseConfig";

interface User {
  id: string;
  name: string;
  email: string;
}

export const UserTable = () => {
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    const usersData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as User[];
    setUsers(usersData);
  };

  const deleteUser = async (userId: string) => {
    await deleteDoc(doc(db, "users", userId));
    fetchUsers(); // refresh
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold mb-4">Total Users: {users.length}</h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map(user => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell className="text-right">
                <Button variant="destructive" onClick={() => deleteUser(user.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
