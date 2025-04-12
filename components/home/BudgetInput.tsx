"use client";
import React, { useState } from "react";
import { Input } from "../ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const BudgetInputSection = () => {
  const [income, setIncome] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // You can save this to Firebase or Zustand here
    console.log("Income:", income);
  };

  return (
    <div className="flex items-center justify-center">
      <Dialog>
        <DialogTrigger className='flex flex-col gap-4 p-4 bg-gray-800 m-4 rounded-2xl shadow-lg text-white font-poppins w-[92%]'>
          Edit Your Monthly Income
        </DialogTrigger>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>Your Finances</DialogTitle>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-600 font-poppins">
                  Monthly Income
                </label>
                <Input
                  type="number"
                  className="w-full p-2 border rounded-md font-poppins"
                  placeholder="e.g. 100000"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-navy-1 text-white py-2 rounded-md hover:bg-navy-2 transition font-poppins"
              >
                Save Details
              </button>
            </form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BudgetInputSection;
