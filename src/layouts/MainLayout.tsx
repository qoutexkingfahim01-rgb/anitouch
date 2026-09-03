import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import MobileBottomNav from '../components/layout/MobileBottomNav';

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      {/* Main content takes remaining height. Added bottom padding for mobile to prevent content hiding behind bottom nav */}
      <main className="flex-grow pb-16 md:pb-0">
        <Outlet />
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}