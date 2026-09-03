import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, PlusSquare, ShoppingCart, FileText, LogOut, Home } from 'lucide-react';
import { auth } from '@/firebase/config';
import { signOut } from 'firebase/auth';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
      navigate('/login');
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Add Product', path: '/admin/add-product', icon: PlusSquare },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Legal Pages', path: '/admin/legal', icon: FileText },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white hidden md:flex flex-col">
        <div className="h-20 flex items-center justify-center border-b border-gray-800">
          <Link to="/" className="text-2xl font-black tracking-tighter">AniTouch. <span className="text-[10px] text-gray-400 font-normal tracking-widest uppercase ml-1">Admin</span></Link>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive ? "bg-white text-black" : "text-gray-400 hover:bg-gray-900 hover:text-white"
                )}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800 space-y-2">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-900 hover:text-white transition-colors">
            <Home className="w-5 h-5" />
            Back to Website
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-gray-900 hover:text-red-300 transition-colors">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:hidden">
          <span className="font-black text-xl">AniTouch Admin</span>
          <button onClick={handleLogout} className="text-sm font-bold text-red-500">Logout</button>
        </header>
        
        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}