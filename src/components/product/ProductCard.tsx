import { Link } from 'react-router-dom';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // যদি কোনো কারণে ইমেজ না থাকে, তবে একটি ডিফল্ট গ্রে ব্যাকগ্রাউন্ড দেখাবে
  const displayImage = product.images?.[0] || '';

  return (
    <Link to={`/product/${product.id}`} className="group flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden bg-[#F5F5F5] mb-4">
        {displayImage ? (
          <img
            src={displayImage}
            alt={product.name}
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs uppercase tracking-widest">
            No Image
          </div>
        )}
        
        {/* Out of Stock Badge */}
        {product.stock <= 0 && (
          <div className="absolute top-3 right-3 bg-black text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
            Sold Out
          </div>
        )}
      </div>
      
      <h3 className="text-sm font-semibold text-black mb-1 truncate group-hover:text-gray-600 transition-colors">
        {product.name}
      </h3>
      <p className="text-sm text-gray-500">৳ {product.price}</p>
    </Link>
  );
}