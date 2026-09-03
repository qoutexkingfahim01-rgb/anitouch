import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { getProducts } from '@/services/products/productService';
import { Product } from '@/types';
import ProductCard from '@/components/product/ProductCard';

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  return (
    <>
      <Helmet>
        <title>Shop Collection | AniTouch</title>
        <meta name="description" content="Explore our premium streetwear collection, featuring t-shirts, drop-shoulders, and more." />
      </Helmet>
      
      <div className="container mx-auto px-4 lg:px-8 py-10 md:py-16">
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-2">Shop Collection</h1>
        <p className="text-gray-500 text-sm mb-10">Premium streetwear designed for comfort and impact.</p>
        
        {loading ? (
          /* Loading Skeleton */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 gap-y-10">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-[4/5] mb-4 w-full"></div>
                <div className="h-4 bg-gray-200 w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 w-1/4"></div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          /* Product Grid */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 gap-y-10">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-24 bg-gray-50 border border-gray-100 flex flex-col items-center justify-center">
            <h2 className="text-xl font-bold text-black mb-3">No Products Found</h2>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Our collection is currently being updated. Please check back later for our premium drops.
            </p>
          </div>
        )}
      </div>
    </>
  );
}