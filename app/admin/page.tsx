"use client";

import { UserTable } from "@/components/admin/UserTable";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

const AdminPage = () => {
  const router = useRouter();

  return (
    <div className="font-poppins p-4 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-center uppercase text-navy-1 mt-20">
        Admin Panel
      </h1>
      <div className="mb-16 text-center text-gray-500">
        <p>Manage your advisors, products, and settings from here.</p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-6">
        <Button
          className="w-full md:w-1/4 bg-navy-1 hover:bg-gray-900"
          onClick={() => router.push("/home")}
        >
          Home
        </Button>
        <Button
          className="w-full md:w-1/4 bg-navy-1 hover:bg-gray-900"
          onClick={() => router.push("/admin/advisors")}
        >
          Add Advisors
        </Button>
        <Button
          className="w-full md:w-1/4 bg-green-1 hover:bg-green-700"
          onClick={() => router.push("/admin/products")}
        >
          Add Products
        </Button>
        <Button
          className="w-full md:w-1/4 bg-green-1 hover:bg-green-700"
          onClick={() => router.push("/admin/snapshot")}
        >
          Add Snapshot
        </Button>
        <Button
          className="w-full md:w-1/4 bg-green-1 hover:bg-green-700"
          onClick={() => router.push("/admin/snapshot")}
        >
          Appointments
        </Button>
      </div>
      <UserTable/>
    </div>
  );
};

export default AdminPage;
