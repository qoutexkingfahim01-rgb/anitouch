import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-16 pb-8 md:pb-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-3xl font-black tracking-tighter mb-4">AniTouch.</h3>
            <p className="text-gray-400 text-sm max-w-sm mb-6 leading-relaxed">
              Premium streetwear and modern fashion essentials. Designed for comfort, styled for impact.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold mb-5 tracking-widest uppercase">Explore</h4>
            <ul className="space-y-3">
              <li><Link to="/shop" className="text-gray-400 hover:text-white text-sm transition-colors">All Products</Link></li>
              <li><Link to="/shop" className="text-gray-400 hover:text-white text-sm transition-colors">T-Shirts</Link></li>
              <li><Link to="/shop" className="text-gray-400 hover:text-white text-sm transition-colors">Drop Shoulder</Link></li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold mb-5 tracking-widest uppercase">Legal</h4>
            <ul className="space-y-3">
              <li><Link to="/legal/privacy-policy" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link to="/legal/terms-conditions" className="text-gray-400 hover:text-white text-sm transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/legal/refund-policy" className="text-gray-400 hover:text-white text-sm transition-colors">Refund Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-500 text-xs text-center md:text-left">
            &copy; {new Date().getFullYear()} AniTouch. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}