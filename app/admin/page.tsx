"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

const AdminPage = () => {
  const router = useRouter();
  return (
    <div className="font-poppins p-2">
      <h1 className="text-xl text-center uppercase">Admin panel</h1>
      <div className="mt-10 flex md:flex-row flex-col items-center justify-center gap-2 md:gap-10">
        <Button
          className="w-full md:w-1/3 bg-navy-1"
          onClick={() => router.push("/home/home-personal")}
        >
          Home
        </Button>
        <Button
          className="w-full md:w-1/3 bg-navy-1"
          onClick={() => router.push("/admin/advisors")}
        >
          Add Advisors
        </Button>
      </div>
    </div>
  );
};

export default AdminPage;
