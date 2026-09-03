import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { collection, getDocs, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '@/firebase/config';
import toast from 'react-hot-toast';
import { Clock, CheckCircle2, Truck, PackageCheck, XCircle, CreditCard } from 'lucide-react';

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
}

interface Order {
  id: string;
  userId: string;
  customerInfo: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    zone?: string;
    paymentMethod?: string;
    trxId?: string;
  };
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  status: string;
  createdAt: any;
}

const ORDER_STATUSES = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status: newStatus });
      setOrders(orders.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending': return <span className="bg-yellow-100 text-yellow-800 px-2.5 py-1 text-xs font-bold rounded-full flex items-center gap-1 w-fit"><Clock className="w-3 h-3"/> Pending</span>;
      case 'Confirmed': return <span className="bg-blue-100 text-blue-800 px-2.5 py-1 text-xs font-bold rounded-full flex items-center gap-1 w-fit"><CheckCircle2 className="w-3 h-3"/> Confirmed</span>;
      case 'Processing': return <span className="bg-purple-100 text-purple-800 px-2.5 py-1 text-xs font-bold rounded-full flex items-center gap-1 w-fit"><PackageCheck className="w-3 h-3"/> Processing</span>;
      case 'Shipped': return <span className="bg-indigo-100 text-indigo-800 px-2.5 py-1 text-xs font-bold rounded-full flex items-center gap-1 w-fit"><Truck className="w-3 h-3"/> Shipped</span>;
      case 'Delivered': return <span className="bg-green-100 text-green-800 px-2.5 py-1 text-xs font-bold rounded-full flex items-center gap-1 w-fit"><CheckCircle2 className="w-3 h-3"/> Delivered</span>;
      case 'Cancelled': return <span className="bg-red-100 text-red-800 px-2.5 py-1 text-xs font-bold rounded-full flex items-center gap-1 w-fit"><XCircle className="w-3 h-3"/> Cancelled</span>;
      default: return <span className="bg-gray-100 text-gray-800 px-2.5 py-1 text-xs font-bold rounded-full">{status}</span>;
    }
  };

  return (
    <>
      <Helmet><title>Manage Orders | Admin</title></Helmet>

      <div className="mb-8">
        <h1 className="text-2xl font-black uppercase tracking-tight text-black mb-1">Customer Orders</h1>
        <p className="text-gray-500 text-sm">View customer orders, payment methods, and TrxIDs.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-4 mb-4 gap-4">
                <div>
                  <span className="text-xs font-semibold text-gray-400 block">ORDER ID: {order.id}</span>
                  <span className="text-sm font-bold text-black">{order.customerInfo.fullName} ({order.customerInfo.phone})</span>
                </div>
                <div className="flex items-center gap-4">
                  {getStatusBadge(order.status)}
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="border border-gray-300 rounded-lg p-2 text-xs font-bold uppercase bg-white focus:outline-none focus:border-black"
                  >
                    {ORDER_STATUSES.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Payment & Shipping Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="text-xs space-y-1 text-gray-600">
                  <span className="font-bold text-black uppercase block mb-1">Shipping Address:</span>
                  <p>{order.customerInfo.address}</p>
                  <p>City / Zone: {order.customerInfo.city} ({order.customerInfo.zone === 'inside' ? 'Inside Dhaka' : 'Outside Dhaka'})</p>
                </div>

                <div className="text-xs space-y-1 text-gray-600">
                  <span className="font-bold text-black uppercase block mb-1">Payment Info:</span>
                  <p className="flex items-center gap-1 font-bold text-black">
                    <CreditCard className="w-3.5 h-3.5 text-gray-500" />
                    Method: {order.customerInfo.paymentMethod === 'cod' ? 'Cash on Delivery' : (order.customerInfo.paymentMethod ? order.customerInfo.paymentMethod.toUpperCase() : 'COD')}
                  </p>
                  {order.customerInfo.paymentMethod && order.customerInfo.paymentMethod !== 'cod' && (
                    <p className="mt-1 bg-white p-2 rounded border border-gray-200 font-mono text-black">
                      TrxID: <strong className="text-pink-600 select-all">{order.customerInfo.trxId || 'Not Provided'}</strong>
                    </p>
                  )}
                </div>

                <div className="text-xs space-y-1 text-gray-600 flex flex-col justify-between">
                  <div>
                    <span className="font-bold text-black uppercase block mb-1">Summary:</span>
                    <p>Subtotal: ৳ {order.subtotal}</p>
                    <p>Shipping: ৳ {order.shippingFee}</p>
                  </div>
                  <p className="text-sm font-black text-black pt-2 border-t border-gray-200">Total: ৳ {order.totalAmount}</p>
                </div>
              </div>

              {/* Ordered Items */}
              <div className="space-y-3">
                <span className="font-bold text-black uppercase text-xs block">Ordered Items:</span>
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs bg-white p-2.5 rounded-lg border border-gray-100">
                      <div className="flex items-center gap-3">
                        {item.image && <img src={item.image} alt={item.name} className="w-10 h-12 object-cover rounded" />}
                        <div>
                          <span className="font-bold text-black block">{item.name}</span>
                          <span className="text-gray-500">Size: {item.size} | Color: {item.color} | Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <span className="font-bold text-black">৳ {item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl p-16 text-center">
          <h3 className="text-lg font-bold text-black mb-1">No Orders Found</h3>
          <p className="text-gray-500 text-sm">Customer orders will appear here once placed.</p>
        </div>
      )}
    </>
  );
}