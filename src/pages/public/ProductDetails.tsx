import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ShoppingBag, Heart, Minus, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { getProductById } from '@/services/products/productService';
import { useCartStore } from '@/store/cartStore';
import { Product } from '@/types';
import { cn } from '@/lib/utils';

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');
  
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      const data = await getProductById(id);
      
      if (data) {
        setProduct(data);
        if (data.images?.length > 0) setSelectedImage(data.images[0]);
        if (data.sizes?.length > 0) setSelectedSize(data.sizes[0]);
        if (data.colors?.length > 0) setSelectedColor(data.colors[0]);
      }
      setLoading(false);
    };
    fetchProduct();
    setQuantity(1);
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    if (product.sizes?.length > 0 && !selectedSize) {
      toast.error("Please select a size.");
      return;
    }
    if (product.colors?.length > 0 && !selectedColor) {
      toast.error("Please select a color.");
      return;
    }
    if (product.stock <= 0) {
      toast.error("This product is out of stock.");
      return;
    }

    const cartItemId = `${product.id}-${selectedSize}-${selectedColor}`;
    
    addItem({
      ...product,
      cartItemId,
      quantity,
      selectedSize,
      selectedColor
    });
    
    toast.success("Added to cart successfully!");
  };

  // ডেসক্রিপশনের **text** কে বোল্ড এবং লাইন ব্রেক ঠিক করার ফাংশন
  const formatDescription = (desc: string) => {
    if (!desc) return '';
    let formatted = desc.replace(/\*\*(.*?)\*\*/g, '<strong class="text-black font-bold">$1</strong>');
    formatted = formatted.replace(/\n/g, '<br />');
    return formatted;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center items-center h-[60vh]">
        <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <button onClick={() => navigate('/shop')} className="text-sm font-semibold underline">Back to Shop</button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{product.name} | AniTouch</title>
        <meta name="description" content={product.description.slice(0, 150)} />
      </Helmet>

      <div className="container mx-auto px-4 lg:px-8 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* Images Section (7 Columns) */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4 sticky top-28">
            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div className="flex md:flex-col gap-3 overflow-x-auto md:w-24 md:flex-shrink-0 scrollbar-hide">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={cn(
                      "w-20 h-24 md:w-full md:h-28 bg-gray-100 flex-shrink-0 overflow-hidden border-2 transition-all",
                      selectedImage === img ? "border-black" : "border-transparent hover:border-gray-300"
                    )}
                  >
                    <img src={img} alt={`${product.name} ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            
            {/* Main Image */}
            <div className="flex-1 bg-[#F5F5F5] aspect-[4/5] relative overflow-hidden">
              {selectedImage ? (
                <img src={selectedImage} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
              )}
            </div>
          </div>

          {/* Product Info Section (5 Columns) */}
          <div className="lg:col-span-5 flex flex-col">
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-3">{product.name}</h1>
            <p className="text-xl md:text-2xl font-bold text-black mb-6">৳ {product.price}</p>
            
            {/* Stock Indicator */}
            <div className="text-xs font-semibold text-green-600 mb-6 uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse"></span>
              {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
            </div>

            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-black">Select Size</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "w-12 h-12 flex items-center justify-center text-sm font-bold border transition-all",
                        selectedSize === size 
                          ? "border-black bg-black text-white shadow-md" 
                          : "border-gray-200 bg-white text-black hover:border-black"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div className="mb-8">
                <span className="block text-xs font-bold uppercase tracking-widest text-black mb-3">Select Color</span>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        "px-5 h-10 flex items-center justify-center text-xs font-bold border transition-all uppercase",
                        selectedColor === color 
                          ? "border-black bg-black text-white shadow-md" 
                          : "border-gray-200 bg-white text-black hover:border-black"
                      )}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8 flex items-center gap-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">Quantity</span>
              <div className="flex items-center border border-gray-200 h-11 w-32 bg-white">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="flex-1 h-full flex items-center justify-center text-sm font-bold">
                  {quantity}
                </div>
                <button 
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                  disabled={quantity >= product.stock}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-10">
              <button 
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 h-14 bg-black text-white flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-md"
              >
                <ShoppingBag className="w-4 h-4" />
                {product.stock > 0 ? 'Add to Cart' : 'Sold Out'}
              </button>
              <button className="w-14 h-14 border border-gray-200 flex items-center justify-center text-black hover:border-black transition-colors">
                <Heart className="w-5 h-5" />
              </button>
            </div>

            {/* Description */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-sm font-semibold uppercase tracking-widest mb-4">Description</h3>
              <div 
                className="text-gray-600 text-sm leading-relaxed space-y-2"
                dangerouslySetInnerHTML={{ __html: formatDescription(product.description) }}
              />
            </div>

          </div>
        </div>
      </div>
    </>
  );
}