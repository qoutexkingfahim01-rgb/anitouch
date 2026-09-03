import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, Heart, User } from 'lucide-react';
import { cn } from '../../lib/utils'; // পাথ তোমার প্রজেক্ট অনুযায়ী ঠিক করে নিও

export default function MobileBottomNav() {
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Shop', path: '/shop', icon: ShoppingBag },
    { name: 'Wishlist', path: '/wishlist', icon: Heart },
    { name: 'Account', path: '/account', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 z-50 w-full bg-white border-t border-black/15 pb-safe shadow-lg">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                isActive ? "text-black font-semibold" : "text-gray-400 hover:text-gray-600"
              )}
            >
              <div className="relative">
                <Icon className={cn("w-5 h-5 transition-transform", isActive && "scale-110 stroke-[2.5]")} />
              </div>
              <span className="text-[10px]">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}