import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Loader2 } from 'lucide-react';
import { getProducts } from '@/services/products/productService';
import { Product } from '@/types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      const fetchAll = async () => {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
        setFiltered(data);
        setLoading(false);
      };
      fetchAll();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setFiltered([]);
    } else {
      const q = query.toLowerCase();
      setFiltered(
        products.filter(p => 
          p.name.toLowerCase().includes(q) || 
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
        )
      );
    }
  }, [query, products]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-gray-200 animate-in fade-in zoom-in duration-200">
        {/* Search Input Header */}
        <div className="flex items-center px-6 py-4 border-b border-gray-200 gap-4">
          <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search t-shirts, drop-shoulder, hoodies..."
            className="w-full text-base font-medium focus:outline-none bg-transparent"
          />
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4">
          {loading ? (
            <div className="py-12 flex justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-black" />
            </div>
          ) : query.trim() === '' ? (
            <div className="py-12 text-center text-gray-400 text-sm">
              Type something to search our collection...
            </div>
          ) : filtered.length > 0 ? (
            <div className="space-y-2">
              {filtered.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    onClose();
                    navigate(`/product/${product.id}`);
                  }}
                  className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors border border-transparent hover:border-gray-200"
                >
                  <div className="w-12 h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {product.images?.[0] && (
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-black truncate">{product.name}</h4>
                    <span className="text-xs text-gray-500 uppercase tracking-wider">{product.category}</span>
                  </div>
                  <span className="font-black text-sm text-black">৳ {product.price}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-gray-500 text-sm">
              No products found matching "{query}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
}