import { collection, getDocs, query, where, doc, getDoc, deleteDoc, orderBy } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { Product } from '@/types';

// সব অ্যাক্টিভ প্রোডাক্ট ফেচ করা (Shop পেজের জন্য)
export const getProducts = async (): Promise<Product[]> => {
  try {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('active', '==', true));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    } as Product));
  } catch (error) {
    console.error("Error fetching products:", error);
    return []; 
  }
};

// সিঙ্গেল প্রোডাক্ট ডিটেইলস ফেচ করা (ProductDetails পেজের জন্য)
export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Product;
    }
    return null;
  } catch (error) {
    console.error("Error fetching product details:", error);
    return null;
  }
};

// অ্যাডমিনের জন্য সব প্রোডাক্ট আনা (Active + Inactive)
export const getAllAdminProducts = async (): Promise<Product[]> => {
  try {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    } as Product));
  } catch (error) {
    console.error("Error fetching admin products:", error);
    return [];
  }
};

// প্রোডাক্ট ডিলিট করা (Admin এর জন্য)
export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    const docRef = doc(db, 'products', id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting product:", error);
    return false;
  }
};