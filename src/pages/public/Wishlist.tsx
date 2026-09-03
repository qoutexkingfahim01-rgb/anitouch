import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Heart, Trash2, ShoppingBag } from 'lucide-react';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';

export default function Wishlist() {
  const { items, removeItem } = useWishlistStore();
  const addToCart = useCartStore((state) => state.addItem);

  const handleMoveToCart = (product: any) => {
    const defaultSize = product.sizes?.[0] || 'M';
    const defaultColor = product.colors?.[0] || 'Black';
    const cartItemId = `${product.id}-${defaultSize}-${defaultColor}`;

    addToCart({
      ...product,
      cartItemId,
      quantity: 1,
      selectedSize: defaultSize,
      selectedColor: defaultColor
    });
    removeItem(product.id);
    toast.success("Moved to cart!");
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 min-h-[60vh] flex flex-col items-center justify-center text-center">
        <Helmet><title>Wishlist | AniTouch</title></Helmet>
        <Heart className="w-16 h-16 text-gray-200 mb-6" />
        <h2 className="text-2xl font-black uppercase tracking-tight mb-3">Your Wishlist is Empty</h2>
        <p className="text-gray-500 mb-8 max-w-md">Save your favorite streetwear items here while you shop.</p>
        <Link to="/shop" className="bg-black text-white px-8 py-3.5 text-sm font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors">
          Explore Shop
        </Link>
      </div>
    );
  }

  return (
    <>
      <Helmet><title>Wishlist | AniTouch</title></Helmet>
      
      <div className="container mx-auto px-4 lg:px-8 py-10 md:py-16">
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-10">My Wishlist</h1>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((product) => (
            <div key={product.id} className="group flex flex-col">
              <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 mb-4">
                {product.images?.[0] && (
                  <img src={product.images[0]} alt={product.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                )}
                <button 
                  onClick={() => removeItem(product.id)}
                  className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md text-gray-600 hover:text-red-500 transition-colors"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <h3 className="text-sm font-semibold text-black mb-1 truncate">{product.name}</h3>
              <p className="text-sm text-gray-500 mb-4">৳ {product.price}</p>
              
              <button 
                onClick={() => handleMoveToCart(product)}
                className="w-full bg-black text-white py-2.5 text-xs font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 mt-auto"
              >
                <ShoppingBag className="w-3.5 h-3.5" /> Move to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}