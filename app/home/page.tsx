"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/configs/firebaseConfig";
import { User } from "firebase/auth";
import { 
  Card, 
  CardContent,  
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Wallet, 
  Building2, 
  ShoppingBag, 
  ShieldCheck,
  ArrowRight
} from "lucide-react";

export default function FinanceTypeSelect() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  console.log(currentUser)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
        checkAdminStatus(user.uid);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
    if (loading) return;

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
        <div className="animate-pulse">Checking authentication...</div>
      </div>
    );
  }

  const options = [
    {
      type: "personal",
      title: "Personal Finance",
      description: "Manage your personal finances, budgets, and savings goals",
      icon: <Wallet className="h-8 w-8 text-green-600" />,
      color: " border-green-200",
      textColor: "text-green-800"
    },
    {
      type: "business",
      title: "Business Finance",
      description: "Track business expenses, revenue, and financial analytics",
      icon: <Building2 className="h-8 w-8 text-blue-600" />,
      color: "border-blue-200",
      textColor: "text-blue-800"
    },
    {
      type: "shop",
      title: "Browse Products",
      description: "Explore our financial products and services",
      icon: <ShoppingBag className="h-8 w-8 text-yellow-600" />,
      color: " border-yellow-200",
      textColor: "text-yellow-800"
    },
    ...(isAdmin ? [{
      type: "admin",
      title: "Admin Panel",
      description: "Access administrative controls and settings",
      icon: <ShieldCheck className="h-8 w-8 text-red-600" />,
      color: " border-red-200",
      textColor: "text-red-500"
    }] : [])
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50 font-poppins">
      <div className="max-w-4xl w-full pt-20 md:pt-0">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2 text-gray-800">H A Z I N A</h1>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-10">
          <p className="bg-gradient-to-r from-green-700 via-teal-700 to-purple-700 bg-clip-text text-transparent">Your one stop financial powerhouse</p>
          </h1>
          <p className="text-gray-600 text-lg">
            Choose how you want to get started:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {options.map((option) => (
            <Card 
              key={option.type}
              className={`cursor-pointer ${option.color}`}
              onClick={() => handleSelect(option.type as any)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={`text-xl font-bold ${option.textColor}`}>{option.title}</CardTitle>
                {option.icon}
              </CardHeader>
              <CardContent className="pt-2">
                <p className="text-gray-600">{option.description}</p>
              </CardContent>
              <CardFooter className="flex justify-end pt-0">
                <div className={`flex items-center ${option.textColor} font-medium`}>
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        <footer className="mt-16 text-center text-gray-500 text-sm pb-10 font-poppins">
          © {new Date().getFullYear()} Hazina Financial Services
        </footer>
      </div>
    </div>
  );
}