"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/configs/firebaseConfig";
import { User } from "firebase/auth";

export default function FinanceTypeSelect() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
        checkAdminStatus(user.uid); // Check if the user is an admin
        console.log(currentUser)
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const checkAdminStatus = async (uid: string) => {
    try {
      const adminDoc = await getDoc(doc(db, "admin", uid));
      setIsAdmin(adminDoc.exists());
    } catch (error) {
      console.error("Error checking admin status:", error);
      setIsAdmin(false);
    }
  };

  const handleSelect = (type: "personal" | "business" | "shop" | "admin") => {
    if (loading) return; // Prevent action if still checking user

    if (type === "personal") {
      router.push("/home/home-personal");
    } else if (type === "shop") {
      router.push("/home/shop");
    } else if (type === "admin" && isAdmin) {
      router.push("/admin");
    } else {
      router.push("/home/home-business");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-poppins">
        Checking authentication...
      </div>
    );
  }

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
        <Button
          onClick={() => handleSelect("shop")}
          className="px-6 py-4 text-lg rounded-md bg-navy-1 hover:bg-gray-900"
        >
          Browse our Products
        </Button>
        
        {/* Conditionally render Admin Button */}
        {isAdmin && (
          <Button
            onClick={() => handleSelect("admin")}
            className="px-6 py-4 text-lg rounded-md bg-navy-1 hover:bg-gray-900"
          >
            Admin Panel
          </Button>
        )}
      </div>
    </div>
  );
}