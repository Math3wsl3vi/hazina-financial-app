"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function FinanceTypeSelect() {
  const router = useRouter();

  const handleSelect = (type: "personal" | "business") => {
    if (type === "personal") {
      router.push("/home/home-personal");
    } else {
      router.push("/home/home-business");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-white font-poppins">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">H A Z I N A</h1>
      <p className="text-textColor-1 my-4">Your one stop financial powerhouse</p>
      <p className="text-gray-600 mb-10">
        Choose how you want to get started:
      </p>

      <div className="flex flex-col sm:flex-row gap-6">
        <Button
          onClick={() => handleSelect("personal")}
          className="px-6 py-4 text-lg rounded-md bg-green-1 hover:bg-green-700"
        >
          Personal Finance
        </Button>
        <Button
          onClick={() => handleSelect("business")}
          className="px-6 py-4 text-lg rounded-md bg-navy-1 hover:bg-gray-900"
        >
          Business Finance
        </Button>
      </div>
    </div>
  );
}
