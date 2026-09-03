import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';

export default function Checkout() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.displayName || '',
    phone: '',
    address: '',
    city: ''
  });

  // শিপিং ফি (ঢাকার ভেতরে ৭০, বাইরে ১২০ হতে পারে, আপাতত ডিফল্ট ১০০ ধরলাম)
  const shippingFee = 100;
  const totalAmount = getTotalPrice() + shippingFee;

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.phone || !formData.address || !formData.city) {
      toast.error("Please fill in all shipping details");
      return;
    }

    setLoading(true);
    
    try {
      const orderData = {
        userId: user?.uid || 'guest',
        customerInfo: formData,
        items: items.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.selectedSize,
          color: item.selectedColor,
          image: item.images?.[0] || ''
        })),
        subtotal: getTotalPrice(),
        shippingFee,
        totalAmount,
        status: 'Pending',
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'orders'), orderData);
      
      clearCart();
      toast.success("Order Placed Successfully!");
      navigate('/'); // পরবর্তীতে Order History পেজে রিডাইরেক্ট করা যেতে পারে
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Checkout | AniTouch</title></Helmet>
      
      <div className="container mx-auto px-4 lg:px-8 py-10 md:py-16">
        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-8">Checkout</h1>
        
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Shipping Form */}
          <div className="flex-1">
            <div className="bg-white border border-gray-200 p-6 md:p-8">
              <h2 className="text-sm font-bold uppercase tracking-widest mb-6 border-b border-gray-100 pb-4">Shipping Information</h2>
              
              <form onSubmit={handlePlaceOrder} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Full Name *</label>
                  <input required type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full border border-gray-300 p-3 text-sm focus:border-black focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Phone Number *</label>
                  <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full border border-gray-300 p-3 text-sm focus:border-black focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">City *</label>
                  <input required type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full border border-gray-300 p-3 text-sm focus:border-black focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Full Address *</label>
                  <textarea required name="address" rows={3} value={formData.address} onChange={handleInputChange} className="w-full border border-gray-300 p-3 text-sm focus:border-black focus:outline-none transition-colors resize-none"></textarea>
                </div>

                <div className="pt-4">
                  <h2 className="text-sm font-bold uppercase tracking-widest mb-4 border-b border-gray-100 pb-4">Payment Method</h2>
                  <div className="border border-black p-4 flex items-center justify-between bg-gray-50">
                    <span className="text-sm font-bold uppercase tracking-wider">Cash on Delivery (COD)</span>
                    <div className="w-4 h-4 rounded-full bg-black"></div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-black text-white py-4 mt-6 text-sm font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors disabled:bg-gray-400"
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </button>
              </form>
            </div>
          </div>
          
          {/* Checkout Summary */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-[#F5F5F5] p-6 sticky top-24">
              <h2 className="text-sm font-bold uppercase tracking-widest mb-6">Order Items</h2>
              
              <div className="space-y-4 mb-6 border-b border-gray-300 pb-6 max-h-[40vh] overflow-y-auto pr-2 scrollbar-hide">
                {items.map((item) => (
                  <div key={item.cartItemId} className="flex gap-4">
                    <div className="w-16 h-20 bg-gray-200 flex-shrink-0">
                      {item.images?.[0] && <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="text-xs font-bold text-black line-clamp-1 mb-1">{item.name}</h3>
                      <p className="text-[10px] text-gray-500 uppercase">Size: {item.selectedSize} | Color: {item.selectedColor}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs font-medium text-gray-600">Qty: {item.quantity}</span>
                        <span className="text-xs font-bold">৳ {item.price * item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3 mb-6 border-b border-gray-300 pb-6 text-sm">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span className="font-semibold text-black">৳ {getTotalPrice()}</span></div>
                <div className="flex justify-between text-gray-600"><span>Shipping Fee</span><span className="font-semibold text-black">৳ {shippingFee}</span></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-base font-bold uppercase tracking-widest">Total</span>
                <span className="text-xl font-black">৳ {totalAmount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}