import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, Heart, User } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import SearchModal from '@/components/common/SearchModal';

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-black/10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            
            {/* Mobile Search Button (Left) */}
            <div className="flex md:hidden w-1/3">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2 -ml-2 text-black hover:text-gray-600 transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Links (Desktop Left) */}
            <nav className="hidden md:flex items-center gap-8 w-1/3">
              <Link to="/" className="text-sm font-semibold tracking-wide text-black hover:text-gray-600 transition-colors">HOME</Link>
              <Link to="/shop" className="text-sm font-semibold tracking-wide text-black hover:text-gray-600 transition-colors">SHOP</Link>
            </nav>

            {/* Logo (Center) */}
            <div className="flex justify-center w-1/3">
              <Link to="/" className="text-2xl md:text-3xl font-black tracking-tighter text-black">
                AniTouch.
              </Link>
            </div>

            {/* Icons (Right) */}
            <div className="flex items-center justify-end gap-3 md:gap-6 w-1/3">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="hidden md:flex p-2 text-black hover:text-gray-600 transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
              <Link to="/wishlist" className="hidden md:flex p-2 text-black hover:text-gray-600 transition-colors">
                <Heart className="w-5 h-5" />
              </Link>
              <Link to="/account" className="hidden md:flex p-2 text-black hover:text-gray-600 transition-colors">
                <User className="w-5 h-5" />
              </Link>
              <Link to="/cart" className="p-2 text-black hover:text-gray-600 transition-colors relative">
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-black rounded-full min-w-[18px]">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>
            
          </div>
        </div>
      </header>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}