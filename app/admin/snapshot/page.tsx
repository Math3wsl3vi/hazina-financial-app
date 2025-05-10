"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { addDoc, collection, doc, getDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/configs/firebaseConfig";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from 'react-hot-toast';

// Define types for your snapshot data
interface Snapshot {
  id: string;
  title: string;
  content: string;
  author: string;
  preview:string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface NewSnapshot {
  title: string;
  content: string;
  author: string;
  preview:string;
}

export default function AdminSnapshotPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [newSnapshot, setNewSnapshot] = useState<NewSnapshot>({
    title: "",
    content: "",
    author: "",
    preview:""
  });

  // Check admin status on component mount
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const adminDoc = await getDoc(doc(db, "admin", user.uid));
          if (adminDoc.exists()) {
            setIsAdmin(true);
            // Load existing snapshots
            const querySnapshot = await getDocs(collection(db, "marketSnapshots"));
            const loadedSnapshots = querySnapshot.docs.map(doc => ({
              id: doc.id,
              title: doc.data().title,
              content: doc.data().content,
              author: doc.data().author,
              preview: doc.data().preview,
              createdAt: doc.data().createdAt?.toDate(),
              updatedAt: doc.data().updatedAt?.toDate(),
            }));
            setSnapshots(loadedSnapshots);
          } else {
            router.push("/"); // Redirect non-admins
          }
        } catch (error) {
          console.error("Error verifying admin status:", error);
          router.push("/");
        }
      } else {
        router.push("/login"); // Redirect unauthenticated users
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "marketSnapshots"), {
        ...newSnapshot,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      toast.success('Market snapshot added successfully!');
      // Refresh the list
      const querySnapshot = await getDocs(collection(db, "marketSnapshots"));
      const loadedSnapshots = querySnapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title,
        content: doc.data().content,
        author: doc.data().author,
        preview: doc.data().preview,
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      }));
      setSnapshots(loadedSnapshots);

      // Reset form
      setNewSnapshot({
        title: "",
        content: "",
        author: "",
        preview:""
      });
    } catch (error) {
      console.error("Error adding snapshot:", error);
      toast.error('Failed to add market snapshot');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Unauthorized access. Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 font-poppins">
      <h1 className="text-3xl font-bold mb-8 text-center">Admin Dashboard - Market Snapshots</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Add New Snapshot Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Add New Market Snapshot</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Title
              </label>
              <Input
                id="title"
                type="text"
                value={newSnapshot.title}
                onChange={(e) => setNewSnapshot({...newSnapshot, title: e.target.value})}
                required
              />
            </div>

            <div>
              <label htmlFor="author" className="block text-sm font-medium mb-1">
                Author
              </label>
              <Input
                id="author"
                type="text"
                value={newSnapshot.author}
                onChange={(e) => setNewSnapshot({...newSnapshot, author: e.target.value})}
                required
              />
            </div>
            <div>
              <label htmlFor="preview" className="block text-sm font-medium mb-1">
                Preview
              </label>
              <Textarea
                id="preview"
                rows={5}
                value={newSnapshot.preview}
                onChange={(e) => setNewSnapshot({...newSnapshot, preview: e.target.value})}
                required
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium mb-1">
                Content
              </label>
              <Textarea
                id="content"
                rows={5}
                value={newSnapshot.content}
                onChange={(e) => setNewSnapshot({...newSnapshot, content: e.target.value})}
                required
              />
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Add Snapshot"}
            </Button>
          </form>
        </div>

        {/* Existing Snapshots */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recent Market Snapshots</h2>
          {snapshots.length === 0 ? (
            <p>No snapshots available yet.</p>
          ) : (
            <div className="space-y-4">
              {snapshots.map((snapshot) => (
                <div key={snapshot.id} className="border-b pb-4">
                  <h3 className="font-bold text-lg">{snapshot.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">By {snapshot.author}</p>
                  <p className="whitespace-pre-line">{snapshot.content}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {snapshot.createdAt?.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}