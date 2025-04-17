'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { db } from '@/configs/firebaseConfig';
import { collection, doc, setDoc, getDocs, query, where } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Category } from '@/lib/types';
import Image from 'next/image';

type BudgetCategory = {
  id?: string;
  title: string;
  percentage: number;
  allocated: number;
  spent: number;
  icon: string;
  color: string;
  progressColor: string;
  subcategories: { title: string; spent: number }[];
  userId: string;
};

// Use type assertion to fix TypeScript errors
const categories = ['Needs', 'Wants', 'Savings'] as Category[];

// Helper function to determine border color based on category title
const getCategoryStyles = (title: string) => {
  switch (title) {
    case 'Needs':
      return {
        borderColor: 'border-yellow-500',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
        progressColor: 'bg-yellow-500'
      };
    case 'Wants':
      return {
        borderColor: 'border-green-500',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        progressColor: 'bg-green-500'
      };
    case 'Savings':
      return {
        borderColor: 'border-blue-500',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-800',
        progressColor: 'bg-blue-500'
      };
    default:
      return {
        borderColor: 'border-gray-300',
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-800',
        progressColor: 'bg-gray-500'
      };
  }
};

// const categoryIcons = (title:string) => {
//   switch(title){
//     case "Needs":
//       return{
//         imageUrl:'/images/needs.png'
//       };
//       case "Wants":
//       return{
//         imageUrl:'/images/need.png'
//       };
//       default: 
//       return{
//         imageUrl:'/images/piggy-bank.png'

//       }
//   }
// }

const Budgets: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<string | undefined>(undefined);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState<Omit<BudgetCategory, 'subcategories' | 'userId'>>({
    title: '',
    percentage: 0,
    allocated: 0,
    spent: 0,
    icon: '/images/default.png',
    color: 'bg-gray-100 border-gray-300 text-gray-800',
    progressColor: 'bg-gray-500',
  });
  const [newSubcategory, setNewSubcategory] = useState({
    title: '',
    spent: 0,
    categoryIndex: '',
  });
  const router = useRouter();
  const queryClient = useQueryClient();
  const { currentUser, loading: authLoading } = useAuth();

  // Fetch budgets from Firestore
  const { data: budgetsData = [], isLoading: queryLoading } = useQuery({
    queryKey: ['budgets', currentUser?.uid],
    queryFn: async () => {
      if (!currentUser) {
        router.push('/login');
        throw new Error('User not logged in');
      }

      const budgetsQuery = query(
        collection(db, 'budgets'),
        where('userId', '==', currentUser.uid)
      );
      const querySnapshot = await getDocs(budgetsQuery);
      const budgets: BudgetCategory[] = [];
      querySnapshot.forEach((doc) => {
        budgets.push({ id: doc.id, ...doc.data() } as BudgetCategory);
      });
      return budgets;
    },
    enabled: !!currentUser && !authLoading,
  });

  // Mutation to add a category
  const addCategoryMutation = useMutation({
    mutationFn: async (newBudget: BudgetCategory) => {
      if (!currentUser) throw new Error('User not logged in');
      const docId = `${currentUser.uid}_${newBudget.title}`;
      await setDoc(doc(db, 'budgets', docId), newBudget);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets', currentUser?.uid] });
      setNewCategory({
        title: '',
        percentage: 0,
        allocated: 0,
        spent: 0,
        icon: '/images/default.png',
        color: 'bg-green-100 border-gray-300 text-gray-800',
        progressColor: 'bg-gray-500',
      });
      setShowAddForm(false);
    },
    onError: (error) => {
      console.error('Error adding category:', error);
      alert('Failed to add category.');
    },
  });

  // Mutation to add a subcategory
  const addSubcategoryMutation = useMutation({
    mutationFn: async ({ categoryId, updatedCategory }: { categoryId: string; updatedCategory: BudgetCategory }) => {
      await setDoc(doc(db, 'budgets', categoryId), updatedCategory);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets', currentUser?.uid] });
      setNewSubcategory({ title: '', spent: 0, categoryIndex: '' });
    },
    onError: (error) => {
      console.error('Error adding subcategory:', error);
      alert('Failed to add subcategory.');
    },
  });

  const toggleAddForm = () => setShowAddForm(!showAddForm);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCategory((prev) => ({
      ...prev,
      [name]: name === 'title' ? value : Number(value),
    }));
  };

  const handleSubcategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSubcategory((prev) => ({
      ...prev,
      [name]: name === 'title' ? value : Number(value),
    }));
  };

  const addCategory = () => {
    if (!newCategory.title) {
      alert('Category name is required.');
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
      alert('Subcategory name is required.');
      return;
    }

    const category = budgetsData[parseInt(categoryIndex)];
    const updatedSubcategories = [
      ...category.subcategories,
      { title: newSubcategory.title, spent: newSubcategory.spent },
    ];
    // Calculate the new total spent amount for the category
    const newTotalSpent = updatedSubcategories.reduce((total, sub) => total + sub.spent, 0);

    const updatedCategory = {
      ...category,
      subcategories: updatedSubcategories,
      spent: newTotalSpent, // Update the spent field
    };

    addSubcategoryMutation.mutate({
      categoryId: category.id!,
      updatedCategory,
    });
  };

  if (authLoading || queryLoading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold font-poppins text-gray-800">Budget Categories</h1>
        <Button
          onClick={toggleAddForm}
          className="flex items-center gap-2 border bg-blue-50 border-blue-500 text-blue-500 hover:bg-blue-100 font-poppins text-sm transition-colors"
        >
          <Plus size={16} /> Add Category
        </Button>
      </div>

      {/* Add Category Form */}
      {showAddForm && (
        <div className="mb-6 p-4 border rounded-lg bg-white shadow-sm">
          <h2 className="font-bold mb-3">Add New Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category Name</label>
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
              <label className="block text-sm font-medium mb-1">Allocated Amount (Ksh)</label>
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
              <label className="block text-sm font-medium mb-1">Percentage</label>
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
            {addCategoryMutation.isPending ? 'Saving...' : 'Save Category'}
          </Button>
        </div>
      )}

      {/* Budget Categories List */}
      <div className="flex flex-col gap-10">
        {budgetsData.length === 0 ? (
          <p className="text-gray-500">No budget categories yet. Add one to get started!</p>
        ) : (
          <Accordion type="single" collapsible value={openIndex} onValueChange={setOpenIndex}>
            {budgetsData.map((category, index) => {
              const progress = Math.min((category.spent / category.allocated) * 100, 100);
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
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${styles.bgColor} ${styles.borderColor} border-2`}>
                          <Image src='/images/needs.png' alt='icon' width={20} height={20}/>
                        </div>
                        <div>
                        <h3 className="font-poppins font-semibold text-sm">{category.title}</h3>
                        <div className='flex items-center gap-2'>
                          <p className="tetx-sm">
                            {category.percentage}%
                          </p>
                          <p className='text-sm'>
                            Ksh {category.allocated.toLocaleString()} 
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm ${isOverBudget ? 'text-red-500' : styles.textColor}`}>
                        {isOverBudget ? 'Over Budget' : 'On Track'}
                      </p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="mt-4 pl-12 space-y-3">
                    <Progress
                      value={progress}
                      className={`h-2 ${isOverBudget ? 'bg-red-100' : ''}`}
                    />
                    {category.subcategories.map((sub, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0"
                      >
                        <span className="font-poppins text-gray-700">{sub.title}</span>
                        <span className="font-medium">{sub.spent.toLocaleString()} Ksh</span>
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