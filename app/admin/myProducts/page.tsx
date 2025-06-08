"use client";

import { useState, useEffect } from "react";
import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy 
} from "firebase/firestore";
import { db } from "@/configs/firebaseConfig";
import { toast } from 'react-hot-toast';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Product {
  id: string;
  name: string;
  description: string;
  preview: string;
  price: number;
  fileUrl: string;
  coverImage: string;
  createdAt: Date;
}

export default function ManageProductsPage() {
  // const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [preview, setPreview] = useState("");
  const [price, setPrice] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [coverImage, setCoverImage] = useState("");

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productsCollection = collection(db, "products");
        const q = query(productsCollection, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        const productsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];
        
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Set form values when editing a product
  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setDescription(editingProduct.description);
      setPreview(editingProduct.preview);
      setPrice(editingProduct.price.toString());
      setFileUrl(editingProduct.fileUrl);
      setCoverImage(editingProduct.coverImage);
    }
  }, [editingProduct]);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    resetForm();
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setPreview("");
    setPrice("");
    setFileUrl("");
    setCoverImage("");
  };

  const handleUpdate = async () => {
    if (!editingProduct) return;
    
    if (!name || !description || !price) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      const productRef = doc(db, "products", editingProduct.id);
      await updateDoc(productRef, {
        name,
        description,
        preview,
        price: parseFloat(price),
        fileUrl,
        coverImage,
        updatedAt: new Date(),
      });

      // Update the local state
      setProducts(products.map(p => 
        p.id === editingProduct.id ? { 
          ...p, 
          name, 
          description, 
          preview,
          price: parseFloat(price),
          fileUrl,
          coverImage
        } : p
      ));

      toast.success('Product updated successfully!');
      setEditingProduct(null);
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error('Failed to update product!');
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await deleteDoc(doc(db, "products", productId));
      setProducts(products.filter(p => p.id !== productId));
      toast.success('Product deleted successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete product!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-poppins p-6 mt-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-navy-1">
          {editingProduct ? "Edit Product" : "Manage Products"}
        </h1>

        {/* Edit Form (shown when editing) */}
        {editingProduct && (
          <div className="bg-white p-6 rounded-md shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
            
            <div className="space-y-4">
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
              <Textarea
                placeholder="Preview"
                value={preview}
                onChange={(e) => setPreview(e.target.value)}
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
                placeholder="Paste Cover Image Link (Google Drive)"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
              />
              <Input
                type="text"
                placeholder="Paste PDF Link (Google Drive)"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
              />

              <div className="flex space-x-2">
                <Button
                  onClick={handleUpdate}
                  className="bg-green-1 hover:bg-green-700"
                >
                  Update Product
                </Button>
                <Button
                  onClick={handleCancelEdit}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Products List */}
        <div className="bg-white p-6 rounded-md shadow-md">
          <h2 className="text-xl font-semibold mb-4">Products List</h2>
          
          {loading ? (
            <p>Loading products...</p>
          ) : products.length === 0 ? (
            <p>No products found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price (Ksh)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500 line-clamp-2">{product.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => handleEdit(product)}
                            variant="outline"
                            size="sm"
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDelete(product.id)}
                            variant="destructive"
                            size="sm"
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}