"use client";

import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { db } from "@/configs/firebaseConfig";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "@/lib/types";
import Image from "next/image";

type BudgetCategory = {
  id?: string;
  title: string;
  percentage: number;
  allocated: number;
  spent: number;
  icon: string;
  color: string;
  progressColor: string;
  subcategories: Subcategory[];
  userId: string;
};

type Subcategory = {
  title: string;
  spent: number;
  createdAt?: Date | import("firebase/firestore").Timestamp;
};

const categories = ["Needs", "Wants", "Savings"] as Category[];

const getCategoryStyles = (title: string) => {
  switch (title) {
    case "Needs":
      return {
        borderColor: "border-yellow-500",
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-800",
        progressColor: "bg-yellow-500",
      };
    case "Wants":
      return {
        borderColor: "border-green-500",
        bgColor: "bg-green-100",
        textColor: "text-green-800",
        progressColor: "bg-green-500",
      };
    case "Savings":
      return {
        borderColor: "border-blue-500",
        bgColor: "bg-blue-100",
        textColor: "text-blue-800",
        progressColor: "bg-blue-500",
      };
    default:
      return {
        borderColor: "border-gray-300",
        bgColor: "bg-gray-100",
        textColor: "text-gray-800",
        progressColor: "bg-gray-500",
      };
  }
};

const Budgets: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<string | undefined>(undefined);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState<
    Omit<BudgetCategory, "subcategories" | "userId">
  >({
    title: "",
    percentage: 0,
    allocated: 0,
    spent: 0,
    icon: "/images/default.png",
    color: "bg-gray-100 border-gray-300 text-gray-800",
    progressColor: "bg-gray-500",
  });
  const [newSubcategory, setNewSubcategory] = useState({
    title: "",
    spent: 0,
    categoryIndex: "",
  });
  const router = useRouter();
  const queryClient = useQueryClient();
  const { currentUser, loading: authLoading } = useAuth();

  // Helper function to format Timestamp or Date to readable date
  const formatDate = (createdAt: Date | import("firebase/firestore").Timestamp | undefined) => {
    if (!createdAt) return "N/A";
    const date = createdAt instanceof Date ? createdAt : createdAt.toDate();
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const { data: budgetsData = [], isLoading: queryLoading } = useQuery({
    queryKey: ["budgets", currentUser?.uid],
    queryFn: async () => {
      if (!currentUser) {
        router.push("/login");
        throw new Error("User not logged in");
      }

      const budgetsQuery = query(
        collection(db, "budgets"),
        where("userId", "==", currentUser.uid)
      );
      const querySnapshot = await getDocs(budgetsQuery);
      const budgets: BudgetCategory[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const convertedSubcategories = data.subcategories.map(
          (sub: Subcategory) => ({
            title: sub.title,
            spent: sub.spent,
            createdAt:
              sub.createdAt instanceof Date
                ? sub.createdAt
                : sub.createdAt?.toDate() || new Date(),
          })
        );
        budgets.push({
          id: doc.id,
          ...data,
          subcategories: convertedSubcategories,
        } as BudgetCategory);
      });
      return budgets;
    },
    enabled: !!currentUser && !authLoading,
  });

  const updateBudgetTotals = async (budgets: BudgetCategory[]) => {
    if (!currentUser) return;

    const totals = {
      income: 0,
      expenses: 0,
      balance: 0,
      userId: currentUser.uid,
    };

    budgets.forEach((budget) => {
      totals.income += budget.allocated;
      totals.expenses += budget.spent;
    });

    totals.balance = totals.income - totals.expenses;

    await setDoc(doc(db, "budgetTotals", currentUser.uid), totals);
  };

  const addCategoryMutation = useMutation({
    mutationFn: async (newBudget: BudgetCategory) => {
      if (!currentUser) throw new Error("User not logged in");
      const docId = `${currentUser.uid}_${newBudget.title}`;
      await setDoc(doc(db, "budgets", docId), newBudget);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["budgets", currentUser?.uid],
      });
      setNewCategory({
        title: "",
        percentage: 0,
        allocated: 0,
        spent: 0,
        icon: "/images/default.png",
        color: "bg-green-100 border-gray-300 text-gray-800",
        progressColor: "bg-gray-500",
      });
      setShowAddForm(false);
    },
    onSettled: async () => {
      queryClient.invalidateQueries({
        queryKey: ["budgets", currentUser?.uid],
      });
      const budgets = await queryClient.fetchQuery<BudgetCategory[]>({
        queryKey: ["budgets", currentUser?.uid],
      });
      await updateBudgetTotals(budgets);
    },
    onError: (error) => {
      console.error("Error adding category:", error);
      alert("Failed to add category.");
    },
  });

  const addSubcategoryMutation = useMutation({
    mutationFn: async ({
      categoryId,
      updatedCategory,
    }: {
      categoryId: string;
      updatedCategory: BudgetCategory;
    }) => {
      await setDoc(doc(db, "budgets", categoryId), updatedCategory);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["budgets", currentUser?.uid],
      });
      setNewSubcategory({ title: "", spent: 0, categoryIndex: "" });
    },
    onSettled: async () => {
      queryClient.invalidateQueries({
        queryKey: ["budgets", currentUser?.uid],
      });
      const budgets = await queryClient.fetchQuery<BudgetCategory[]>({
        queryKey: ["budgets", currentUser?.uid],
      });
      await updateBudgetTotals(budgets);
    },
    onError: (error) => {
      console.error("Error adding subcategory:", error);
      alert("Failed to add subcategory.");
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (categoryId: string) => {
      await deleteDoc(doc(db, "budgets", categoryId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["budgets", currentUser?.uid],
      });
    },
    onSettled: async () => {
      queryClient.invalidateQueries({
        queryKey: ["budgets", currentUser?.uid],
      });
      const budgets = await queryClient.fetchQuery<BudgetCategory[]>({
        queryKey: ["budgets", currentUser?.uid],
      });
      await updateBudgetTotals(budgets);
    },
    onError: (error) => {
      console.error("Error deleting category:", error);
      alert("Failed to delete category.");
    },
  });

  const deleteSubcategoryMutation = useMutation({
    mutationFn: async ({
      categoryId,
      updatedCategory,
    }: {
      categoryId: string;
      updatedCategory: BudgetCategory;
    }) => {
      await setDoc(doc(db, "budgets", categoryId), updatedCategory);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["budgets", currentUser?.uid],
      });
    },
    onSettled: async () => {
      queryClient.invalidateQueries({
        queryKey: ["budgets", currentUser?.uid],
      });
      const budgets = await queryClient.fetchQuery<BudgetCategory[]>({
        queryKey: ["budgets", currentUser?.uid],
      });
      await updateBudgetTotals(budgets);
    },
    onError: (error) => {
      console.error("Error deleting subcategory:", error);
      alert("Failed to delete subcategory.");
    },
  });

  const toggleAddForm = () => setShowAddForm(!showAddForm);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCategory((prev) => ({
      ...prev,
      [name]: name === "title" ? value : Number(value),
    }));
  };

  const handleSubcategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSubcategory((prev) => ({
      ...prev,
      [name]: name === "title" ? value : Number(value),
    }));
  };

  const addCategory = () => {
    if (!newCategory.title) {
      alert("Category name is required.");
      return;
    }

    const newBudget: BudgetCategory = {
      ...newCategory,
      subcategories: [],
      userId: currentUser!.uid,
    };

    addCategoryMutation.mutate(newBudget);
  };

  const addSubcategory = (categoryIndex: string) => {
    if (!newSubcategory.title) {
      alert("Subcategory name is required.");
      return;
    }

    const category = budgetsData[parseInt(categoryIndex)];
    const updatedSubcategories = [
      ...category.subcategories,
      {
        title: newSubcategory.title,
        spent: newSubcategory.spent,
        createdAt: new Date(),
      },
    ];
    const newTotalSpent = updatedSubcategories.reduce(
      (total, sub) => total + sub.spent,
      0
    );

    const updatedCategory = {
      ...category,
      subcategories: updatedSubcategories,
      spent: newTotalSpent,
    };

    addSubcategoryMutation.mutate({
      categoryId: category.id!,
      updatedCategory,
    });
  };

  const deleteCategory = (categoryId: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      deleteCategoryMutation.mutate(categoryId);
    }
  };

  const deleteSubcategory = (
    categoryIndex: number,
    subcategoryIndex: number
  ) => {
    if (confirm("Are you sure you want to delete this subcategory?")) {
      const category = budgetsData[categoryIndex];
      const updatedSubcategories = category.subcategories.filter(
        (_, i) => i !== subcategoryIndex
      );
      const newTotalSpent = updatedSubcategories.reduce(
        (total, sub) => total + sub.spent,
        0
      );

      const updatedCategory = {
        ...category,
        subcategories: updatedSubcategories,
        spent: newTotalSpent,
      };

      deleteSubcategoryMutation.mutate({
        categoryId: category.id!,
        updatedCategory,
      });
    }
  };

  if (authLoading || queryLoading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-2 md:w-2/3">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold font-poppins text-gray-800">
          Budget Categories
        </h1>
        <Button
          onClick={toggleAddForm}
          className="flex items-center gap-2 border bg-blue-50 border-blue-500 text-blue-500 hover:bg-blue-100 font-poppins text-sm transition-colors"
        >
          <Plus size={16} /> Add Category
        </Button>
      </div>

      {showAddForm && (
        <div className="mb-6 p-4 border rounded-lg bg-white shadow-sm">
          <h2 className="font-bold mb-3">Add New Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Category Name
              </label>
              <Select
                onValueChange={(value) =>
                  setNewCategory((prev) => ({ ...prev, title: value }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Allocated Amount (Ksh)
              </label>
              <Input
                type="number"
                name="allocated"
                value={newCategory.allocated}
                onChange={handleCategoryChange}
                className="w-full p-2 border rounded"
                placeholder="10000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Percentage
              </label>
              <Input
                type="number"
                name="percentage"
                value={newCategory.percentage}
                onChange={handleCategoryChange}
                className="w-full p-2 border rounded"
                placeholder="30"
              />
            </div>
          </div>
          <Button
            onClick={addCategory}
            className="mt-4 bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            disabled={addCategoryMutation.isPending}
          >
            {addCategoryMutation.isPending ? "Saving..." : "Save Category"}
          </Button>
        </div>
      )}

      <div className="flex flex-col gap-10">
        {budgetsData.length === 0 ? (
          <p className="text-gray-500">
            No budget categories yet. Add one to get started!
          </p>
        ) : (
          <Accordion
            type="single"
            collapsible
            value={openIndex}
            onValueChange={setOpenIndex}
          >
            {budgetsData.map((category, index) => {
              const progress = Math.min(
                (category.spent / category.allocated) * 100,
                100
              );
              const isOverBudget = category.spent > category.allocated;
              const styles = getCategoryStyles(category.title);

              return (
                <AccordionItem
                  key={index}
                  value={index.toString()}
                  className={`border-2 ${styles.borderColor} rounded-2xl p-5 mb-5 ${styles.bgColor} ${styles.textColor} shadow-xs hover:shadow-sm transition-shadow`}
                >
                  <AccordionTrigger className="flex justify-between items-center w-full [&>div]:w-full">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-10 rounded-full flex items-center justify-center ${styles.bgColor} ${styles.borderColor} border-2`}
                      >
                        <Image
                          src="/images/needs.png"
                          alt="icon"
                          width={20}
                          height={20}
                        />
                      </div>
                      <div className="w-full">
                        <div className="flex gap-2">
                          <h3 className="font-poppins font-semibold text-sm">
                            {category.title}
                          </h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 p-1 h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteCategory(category.id!);
                            }}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                        <div className="flex flex-col">
                          <p className="text-sm">{category.percentage}%</p>
                          <p className="text-sm">
                            Ksh {category.allocated.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-sm ${
                          isOverBudget ? "text-red-500" : styles.textColor
                        }`}
                      >
                        {isOverBudget ? "Over Budget" : "On Track"}
                      </p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="mt-4 pl-12 space-y-3">
                    <Progress
                      value={progress}
                      className={`h-2 ${isOverBudget ? "bg-red-100" : ""}`}
                    />
                    {category.subcategories.map((sub, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0"
                      >
                        <div>
                          <span className="font-poppins text-gray-700">
                            {sub.title}
                          </span>
                          <p className="text-xs text-gray-500">
                            Added on: {formatDate(sub.createdAt)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">
                            {sub.spent.toLocaleString()} Ksh
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 p-1 h-6 w-6"
                            onClick={() => deleteSubcategory(index, i)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="pt-3 flex gap-2">
                      <Input
                        type="text"
                        name="title"
                        value={newSubcategory.title}
                        onChange={handleSubcategoryChange}
                        className="flex-1 p-2 border rounded text-sm"
                        placeholder="Subcategory name"
                      />
                      <Input
                        type="number"
                        name="spent"
                        value={newSubcategory.spent}
                        onChange={handleSubcategoryChange}
                        className="w-24 p-2 border rounded text-sm"
                        placeholder="Amount"
                      />
                      <Button
                        onClick={() => addSubcategory(index.toString())}
                        className="bg-blue-500 text-white hover:bg-blue-600 text-sm"
                        disabled={addSubcategoryMutation.isPending}
                      >
                        Add
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </div>
      <div className="h-[50px]"></div>
    </div>
  );
};

export default Budgets;