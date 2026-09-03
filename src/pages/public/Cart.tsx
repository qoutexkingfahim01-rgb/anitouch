import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

export default function Cart() {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 min-h-[60vh] flex flex-col items-center justify-center">
        <Helmet><title>Shopping Cart | AniTouch</title></Helmet>
        <ShoppingBag className="w-16 h-16 text-gray-200 mb-6" />
        <h2 className="text-2xl font-black uppercase tracking-tight mb-3">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8 text-center max-w-md">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/shop" className="bg-black text-white px-8 py-3.5 text-sm font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <>
      <Helmet><title>Shopping Cart | AniTouch</title></Helmet>
      
      <div className="container mx-auto px-4 lg:px-8 py-10 md:py-16">
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-10">Shopping Cart</h1>
        
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Cart Items */}
          <div className="flex-1">
            <div className="border-t border-gray-200">
              {items.map((item) => (
                <div key={item.cartItemId} className="flex gap-4 md:gap-6 py-6 border-b border-gray-200">
                  {/* Product Image */}
                  <div className="w-24 h-32 md:w-32 md:h-40 bg-gray-100 flex-shrink-0">
                    {item.images?.[0] && (
                      <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  
                  {/* Product Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <Link to={`/product/${item.id}`} className="text-base md:text-lg font-bold text-black hover:text-gray-600 transition-colors line-clamp-2">
                          {item.name}
                        </Link>
                        <button onClick={() => removeItem(item.cartItemId)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      <p className="text-gray-500 font-semibold mb-2">৳ {item.price}</p>
                      
                      <div className="flex flex-wrap gap-3 text-xs text-gray-500 uppercase tracking-wider mb-4">
                        {item.selectedSize && <span>Size: <strong className="text-black">{item.selectedSize}</strong></span>}
                        {item.selectedColor && <span>Color: <strong className="text-black">{item.selectedColor}</strong></span>}
                      </div>
                    </div>
                    
                    {/* Quantity Control */}
                    <div className="flex items-center border border-gray-200 h-9 w-28">
                      <button 
                        onClick={() => updateQuantity(item.cartItemId, Math.max(1, item.quantity - 1))}
                        className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <div className="flex-1 h-full flex items-center justify-center text-sm font-bold">
                        {item.quantity}
                      </div>
                      <button 
                        onClick={() => updateQuantity(item.cartItemId, Math.min(item.stock, item.quantity + 1))}
                        className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                        disabled={item.quantity >= item.stock}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-[#F5F5F5] p-6 md:p-8 sticky top-24">
              <h2 className="text-lg font-black uppercase tracking-wider mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 border-b border-gray-300 pb-6">
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Subtotal</span>
                  <span className="font-semibold text-black">৳ {getTotalPrice()}</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Shipping</span>
                  <span className="text-xs">Calculated at checkout</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-8">
                <span className="text-base font-bold uppercase tracking-widest">Total</span>
                <span className="text-2xl font-black">৳ {getTotalPrice()}</span>
              </div>
              
              <button 
                onClick={() => navigate('/checkout')}
                className="w-full bg-black text-white py-4 text-sm font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}