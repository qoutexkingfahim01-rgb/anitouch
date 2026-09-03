import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/firebase/config';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import { Package, LogOut, ShieldCheck } from 'lucide-react';

export default function Account() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserOrders = async () => {
      if (!user) return;
      try {
        const q = query(collection(db, 'orders'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOrders(data);
      } catch (error) {
        console.error("Error fetching user orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserOrders();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      logout();
      toast.success("Logged out successfully");
      navigate('/login');
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  return (
    <>
      <Helmet><title>My Account | AniTouch</title></Helmet>
      
      <div className="container mx-auto px-4 lg:px-8 py-10 md:py-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-6 border-b border-gray-200 gap-4">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight mb-1">My Account</h1>
            <p className="text-gray-500 text-sm">Manage your profile and track order history.</p>
          </div>
          
          <div className="flex items-center gap-4">
            {user?.role === 'admin' && (
              <button 
                onClick={() => navigate('/admin')}
                className="bg-black text-white px-5 py-2.5 text-xs font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" /> Admin Dashboard
              </button>
            )}
            <button 
              onClick={handleLogout}
              className="border border-gray-300 text-black px-5 py-2.5 text-xs font-bold tracking-widest uppercase hover:border-black transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>

        {/* User Info Card */}
        <div className="bg-[#F5F5F5] p-6 rounded-xl mb-12 flex items-center gap-4">
          <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg">
            {user?.displayName?.[0] || user?.email?.[0] || 'U'}
          </div>
          <div>
            <h3 className="font-bold text-black text-base">{user?.displayName || 'Valued Customer'}</h3>
            <p className="text-gray-500 text-sm">{user?.email}</p>
          </div>
        </div>

        {/* Order History */}
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight mb-6 flex items-center gap-2">
            <Package className="w-5 h-5" /> Order History
          </h2>

          {loading ? (
            <div className="py-12 text-center text-gray-400">Loading orders...</div>
          ) : orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border border-gray-200 p-6 rounded-xl bg-white shadow-sm">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 pb-3 border-b border-gray-100 gap-2">
                    <div>
                      <span className="text-xs text-gray-400 font-semibold block">ORDER ID: {order.id}</span>
                      <span className="text-sm font-bold text-black">Status: <span className="text-blue-600">{order.status}</span></span>
                    </div>
                    <span className="text-base font-black">৳ {order.totalAmount}</span>
                  </div>

                  <div className="space-y-2">
                    {order.items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center text-xs text-gray-600">
                        <span>{item.name} (x{item.quantity}) - Size: {item.size}</span>
                        <span>৳ {item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 border border-gray-100 rounded-xl">
              <p className="text-gray-500 text-sm mb-4">You haven't placed any orders yet.</p>
              <button onClick={() => navigate('/shop')} className="bg-black text-white px-6 py-3 text-xs font-bold uppercase tracking-widest">
                Start Shopping
              </button>
            </div>
          )}
        </div>

      </div>
    </>
  );
}