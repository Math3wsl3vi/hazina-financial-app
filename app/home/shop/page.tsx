"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/configs/firebaseConfig";
import Navbar from "@/components/home/Navbar";

type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  fileUrl: string;
  preview: string;
};

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const fetchedProducts: Product[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedProducts.push({
            id: doc.id,
            title: data.name,
            description: data.description,
            price: data.price,
            fileUrl: data.fileUrl,
            preview: data.preview,
          });
        });

        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-poppins">
        Loading products...
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="h-full px-6 py-10 bg-white font-poppins mt-20">
        <h1 className="text-4xl font-bold text-center text-navy-1 mb-8 uppercase">
          Our Products
        </h1>
        <p className="text-center text-gray-600 mb-12">
          Carefully curated eBooks and PDFs to empower your financial journey.
        </p>

        {products.length === 0 ? (
          <p className="text-center text-gray-500">No products available at the moment.</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 p-2">
            {products.map((product) => (
              <div key={product.id} className="border rounded-xl p-6 shadow-sm hover:shadow-md transition">
                <h2 className="text-xl font-semibold text-gray-800 mb-2 capitalize">{product.title}</h2>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-green-600 font-bold text-lg">Ksh {product.price}</span>
                  <div className="gap-4 flex">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          className="bg-green-1 hover:bg-green-700"
                          onClick={() => setSelectedProduct(product)}
                        >
                          Preview
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle className="capitalize">{selectedProduct?.title} Preview</DialogTitle>
                        </DialogHeader>
                        <p>{selectedProduct?.preview}</p>
                      </DialogContent>
                    </Dialog>
                    <Button
                      className="bg-green-1 hover:bg-green-700"
                      onClick={() => window.open(product.fileUrl, "_blank")}
                    >
                      Buy
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}