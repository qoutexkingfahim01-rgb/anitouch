import { Helmet } from 'react-helmet-async';
import { Package, ShoppingCart, Users, DollarSign } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { title: 'Total Sales', value: '৳ 0', icon: DollarSign, color: 'bg-green-100 text-green-600' },
    { title: 'Total Orders', value: '0', icon: ShoppingCart, color: 'bg-blue-100 text-blue-600' },
    { title: 'Total Products', value: '0', icon: Package, color: 'bg-purple-100 text-purple-600' },
    { title: 'Total Customers', value: '0', icon: Users, color: 'bg-orange-100 text-orange-600' },
  ];

  return (
    <>
      <Helmet><title>Admin Dashboard | AniTouch</title></Helmet>
      
      <div className="mb-8">
        <h1 className="text-2xl font-black uppercase tracking-tight text-black mb-1">Dashboard</h1>
        <p className="text-gray-500 text-sm">Welcome back to your admin control panel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white p-6 border border-gray-200 rounded-xl shadow-sm flex items-center gap-4">
              <div className={`p-4 rounded-lg ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">{stat.title}</p>
                <h3 className="text-2xl font-black text-black">{stat.value}</h3>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-500">
        More charts and detailed statistics will appear here as your store grows.
      </div>
    </>
  );
}