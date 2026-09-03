import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight } from 'lucide-react';
import { getProducts } from '@/services/products/productService';
import { Product } from '@/types';
import ProductCard from '@/components/product/ProductCard';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      const data = await getProducts();
      setProducts(data.slice(0, 4));
      setLoading(false);
    };
    fetchFeatured();
  }, []);

  return (
    <>
      <Helmet>
        <title>AniTouch | Premium Streetwear & Drop-Shoulder Tees</title>
        <meta name="description" content="Discover premium modern streetwear, t-shirts, and drop-shoulder tees at AniTouch." />
      </Helmet>
      
      {/* Hero Section */}
      <section className="relative bg-black text-white py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="container mx-auto px-4 lg:px-8 relative z-10 flex flex-col items-center text-center">
          <span className="text-xs font-bold tracking-[0.3em] uppercase bg-white/10 px-4 py-1.5 mb-6 text-gray-300">
            New Drop 2026
          </span>
          <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter mb-6 max-w-4xl">
            Redefining Modern Streetwear.
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-xl mb-10 leading-relaxed">
            Uncompromising comfort meets bold minimalist aesthetics. Crafted for those who dictate the trend.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md">
            <Link 
              to="/shop" 
              className="bg-white text-black px-8 py-4 font-bold tracking-widest text-xs uppercase hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              Shop Collection <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="container mx-auto px-4 lg:px-8 py-20">
        <div className="flex justify-between items-end mb-10">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Handpicked</span>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">Featured Drops</h2>
          </div>
          <Link to="/shop" className="text-xs font-bold uppercase tracking-widest underline hover:text-gray-600 transition-colors">
            View All
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-[4/5] mb-4"></div>
                <div className="h-4 bg-gray-200 w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 w-1/4"></div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 border border-gray-100">
            <p className="text-gray-500 text-sm">No featured products available right now. Check back soon!</p>
          </div>
        )}
      </section>
    </>
  );
}