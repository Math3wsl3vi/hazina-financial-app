import { db } from '@/configs/firebaseConfig';
import {
  collection,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';

export class FirestoreService {
  static async getDocument<T>(collectionName: string, docId: string): Promise<(T & { id: string }) | null> {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as T & { id: string } : null;
  }

  static async addDocument<T>(collectionName: string, data: T): Promise<string> {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  }

  static async updateDocument<T>(collectionName: string, docId: string, data: Partial<T>): Promise<void> {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  }

  static async deleteDocument(collectionName: string, docId: string): Promise<void> {
    await deleteDoc(doc(db, collectionName, docId));
  }

  static async getDocumentsByField<T>(collectionName: string, field: keyof T, value: T[keyof T]): Promise<(T & { id: string })[]> {
    const q = query(collection(db, collectionName), where(field as string, '==', value));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T & { id: string }));
  }
  
}
