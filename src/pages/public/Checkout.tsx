import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';

// বাংলাদেশের ৬৪টি জেলার তালিকা
const BD_DISTRICTS = [
  'Bagerhat', 'Bandarban', 'Barguna', 'Barishal', 'Bhola', 'Bogura', 'Brahmanbaria', 'Chandpur', 'Chattogram', 'Chuadanga', 
  'Cumilla', "Cox's Bazar", 'Dhaka', 'Dinajpur', 'Faridpur', 'Feni', 'Gaibandha', 'Gazipur', 'Gopalganj', 'Habiganj', 
  'Jamalpur', 'Jashore', 'Jhalokati', 'Jhenaidah', 'Joypurhat', 'Khagrachari', 'Khulna', 'Kishoreganj', 'Kurigram', 'Kushtia', 
  'Lakshmipur', 'Lalmonirhat', 'Madaripur', 'Magura', 'Manikganj', 'Meherpur', 'Moulvibazar', 'Munshiganj', 'Mymensingh', 'Naogaon', 
  'Narail', 'Narayanganj', 'Narsingdi', 'Natore', 'Nawabganj', 'Netrokona', 'Nilphamari', 'Noakhali', 'Pabna', 'Panchagarh', 
  'Patuakhali', 'Pirojpur', 'Rajbari', 'Rajshahi', 'Rangamati', 'Rangpur', 'Satkhira', 'Shariatpur', 'Sherpur', 'Sirajganj', 
  'Sunamganj', 'Sylhet', 'Tangail', 'Thakurgaon'
].sort();

export default function Checkout() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: user?.displayName || '',
    phone: '',
    zone: 'inside', // ডিফল্টভাবে Inside Dhaka সিলেক্ট করা থাকবে
    city: 'Dhaka',
    address: ''
  });

  // ডাইনামিক শিপিং ফি লজিক: Inside হলে 70, Outside হলে 130
  const shippingFee = formData.zone === 'inside' ? 70 : 130;
  const totalAmount = getTotalPrice() + shippingFee;

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  if (items.length === 0) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    let newFormData = { ...formData, [name]: value };

    // কাস্টমার যদি zone পরিবর্তন করে, তাহলে city অটোমেটিক আপডেট হবে
    if (name === 'zone') {
      if (value === 'inside') {
        newFormData.city = 'Dhaka';
      } else {
        newFormData.city = '';
      }
    }

    setFormData(newFormData);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.phone || !formData.address || !formData.city) {
      toast.error("Please fill in all shipping details");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Placing your order...");
    
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
      toast.success("Order Placed Successfully!", { id: toastId });
      navigate('/account');
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.", { id: toastId });
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
            <div className="bg-white border border-gray-200 p-6 md:p-8 rounded-xl shadow-sm">
              <h2 className="text-sm font-bold uppercase tracking-widest mb-6 border-b border-gray-100 pb-4">Shipping Information</h2>
              
              <form onSubmit={handlePlaceOrder} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Full Name *</label>
                  <input required type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full border border-gray-300 p-3 text-sm focus:border-black focus:outline-none transition-colors rounded-lg" placeholder="e.g. Fahim Chowdhury" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Phone Number *</label>
                    <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full border border-gray-300 p-3 text-sm focus:border-black focus:outline-none transition-colors rounded-lg" placeholder="01XXX-XXXXXX" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Delivery Zone *</label>
                    <select required name="zone" value={formData.zone} onChange={handleInputChange} className="w-full border border-gray-300 p-3 text-sm focus:border-black focus:outline-none transition-colors rounded-lg bg-white">
                      <option value="inside">Inside Dhaka (৳ 70)</option>
                      <option value="outside">Outside Dhaka (৳ 130)</option>
                    </select>
                  </div>
                </div>

                {formData.zone === 'outside' && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">District / City *</label>
                    <select required name="city" value={formData.city} onChange={handleInputChange} className="w-full border border-gray-300 p-3 text-sm focus:border-black focus:outline-none transition-colors rounded-lg bg-white">
                      <option value="" disabled>Select your district</option>
                      {BD_DISTRICTS.map(district => (
                        <option key={district} value={district}>{district}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Full Address *</label>
                  <textarea required name="address" rows={3} value={formData.address} onChange={handleInputChange} className="w-full border border-gray-300 p-3 text-sm focus:border-black focus:outline-none transition-colors resize-y rounded-lg" placeholder="House number, Street name, Area..."></textarea>
                </div>

                <div className="pt-4">
                  <h2 className="text-sm font-bold uppercase tracking-widest mb-4 border-b border-gray-100 pb-4">Payment Method</h2>
                  <div className="border-2 border-black p-4 flex items-center justify-between bg-gray-50 rounded-lg">
                    <span className="text-sm font-bold uppercase tracking-wider text-black">Cash on Delivery (COD)</span>
                    <div className="w-4 h-4 rounded-full bg-black flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading || !formData.city}
                  className="w-full bg-black text-white py-4 mt-6 text-sm font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg shadow-md"
                >
                  {loading ? 'Processing Order...' : 'Confirm Order'}
                </button>
              </form>
            </div>
          </div>
          
          {/* Checkout Summary */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-[#F5F5F5] p-6 rounded-xl sticky top-24 border border-gray-200">
              <h2 className="text-sm font-bold uppercase tracking-widest mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 border-b border-gray-300 pb-6 max-h-[40vh] overflow-y-auto pr-2 scrollbar-hide">
                {items.map((item) => (
                  <div key={item.cartItemId} className="flex gap-4">
                    <div className="w-16 h-20 bg-gray-200 flex-shrink-0 rounded-md overflow-hidden">
                      {item.images?.[0] && <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="text-xs font-bold text-black line-clamp-1 mb-1">{item.name}</h3>
                      <p className="text-[10px] text-gray-500 uppercase font-semibold">Size: {item.selectedSize} | Color: {item.selectedColor}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs font-medium text-gray-600">Qty: {item.quantity}</span>
                        <span className="text-xs font-bold text-black">৳ {item.price * item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3 mb-6 border-b border-gray-300 pb-6 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-black">৳ {getTotalPrice()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>
                    Shipping Fee 
                    <span className="text-[10px] text-gray-400 block">({formData.zone === 'inside' ? 'Inside Dhaka' : 'Outside Dhaka'})</span>
                  </span>
                  <span className="font-semibold text-black">৳ {shippingFee}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-base font-bold uppercase tracking-widest text-black">Total</span>
                <span className="text-xl font-black text-black">৳ {totalAmount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}