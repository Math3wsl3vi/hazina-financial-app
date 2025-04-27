"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/configs/firebaseConfig";
import { toast } from 'react-hot-toast';


export default function AddProductsPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  const handleSubmit = async () => {
    if (!name || !description || !price ) {
      toast.error("Please fill all fields.");
      return;
    }

    try {
      await addDoc(collection(db, "products"), {
        name,
        description,
        price: parseFloat(price),
        fileUrl,
        createdAt: new Date(),
      });
      toast.success('Product added successfully!');
      console.log('product added')
      router.push("/admin");
    } catch (error) {
      console.error(error);
      toast.error('failed to add product!');

    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-poppins flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-8 text-center text-navy-1">
        Add New Product
      </h1>

      <div className="w-full max-w-md bg-white p-6 rounded-md shadow-md space-y-4">
        <Input
          type="text"
          placeholder="Book/Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="h-32"
        />
        <Input
          type="number"
          placeholder="Price (in Ksh)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Paste PDF Link (Google Drive / Dropbox)"
          value={fileUrl}
          onChange={(e) => setFileUrl(e.target.value)}
        />

        <Button
          onClick={handleSubmit}
          className="w-full bg-green-1 hover:bg-green-700"
        >
          Add Product
        </Button>
      </div>
    </div>
  );
}
