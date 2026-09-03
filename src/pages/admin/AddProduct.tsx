import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ImagePlus, X } from 'lucide-react';
import { db } from '@/firebase/config';
import { uploadImageToCloudinary } from '@/services/cloudinary';

export default function AddProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'T-Shirts',
    sizes: 'M, L, XL',
    colors: 'Black, White',
    stock: '10',
    description: ''
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.description || !imageFile) {
      toast.error("Please fill all required fields and upload an image.");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Uploading product...");

    try {
      // 1. Upload Image to Cloudinary
      const imageUrl = await uploadImageToCloudinary(imageFile);

      // 2. Prepare data for Firestore
      const sizesArray = formData.sizes.split(',').map(s => s.trim()).filter(Boolean);
      const colorsArray = formData.colors.split(',').map(c => c.trim()).filter(Boolean);
      
      const productData = {
        name: formData.name,
        slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,
        sizes: sizesArray,
        colors: colorsArray,
        stock: Number(formData.stock),
        images: [imageUrl],
        active: true,
        featured: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // 3. Save to Firestore
      await addDoc(collection(db, 'products'), productData);

      toast.success("Product added successfully!", { id: loadingToast });
      navigate('/admin/products');
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product.", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Add Product | Admin</title></Helmet>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-black uppercase tracking-tight text-black mb-1">Add New Product</h1>
          <p className="text-gray-500 text-sm">Create a new product for your store.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Product Name *</label>
                <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full border border-gray-300 p-3 text-sm focus:border-black focus:outline-none" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Price (৳) *</label>
                  <input required type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full border border-gray-300 p-3 text-sm focus:border-black focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Stock *</label>
                  <input required type="number" name="stock" value={formData.stock} onChange={handleInputChange} className="w-full border border-gray-300 p-3 text-sm focus:border-black focus:outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Category *</label>
                <select name="category" value={formData.category} onChange={handleInputChange} className="w-full border border-gray-300 p-3 text-sm focus:border-black focus:outline-none">
                  <option value="T-Shirts">T-Shirts</option>
                  <option value="Drop-Shoulder">Drop-Shoulder</option>
                  <option value="Hoodies">Hoodies</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Sizes (Comma separated)</label>
                <input type="text" name="sizes" value={formData.sizes} onChange={handleInputChange} placeholder="e.g. M, L, XL" className="w-full border border-gray-300 p-3 text-sm focus:border-black focus:outline-none" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Colors (Comma separated)</label>
                <input type="text" name="colors" value={formData.colors} onChange={handleInputChange} placeholder="e.g. Black, White" className="w-full border border-gray-300 p-3 text-sm focus:border-black focus:outline-none" />
              </div>
            </div>

            {/* Right Column (Image) */}
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Product Image *</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl h-64 flex flex-col items-center justify-center relative overflow-hidden bg-gray-50 hover:bg-gray-100 transition-colors">
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => {setImagePreview(''); setImageFile(null);}} className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md text-red-500 hover:text-red-700">
                        <X className="w-5 h-5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <ImagePlus className="w-10 h-10 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500 font-medium">Click to upload image</span>
                      <input required type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    </>
                  )}
                </div>
                <p className="text-[10px] text-gray-400 mt-2 uppercase text-right">Image will be uploaded to Cloudinary</p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Product Description *</label>
            <textarea 
              required 
              name="description" 
              rows={5} 
              value={formData.description} 
              onChange={handleInputChange} 
              placeholder="Enter product description..."
              className="w-full border border-gray-300 p-3 text-sm focus:border-black focus:outline-none resize-y"
            ></textarea>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <button type="submit" disabled={loading} className="bg-black text-white px-10 py-4 text-sm font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors disabled:bg-gray-400">
              {loading ? 'Publishing Product...' : 'Publish Product'}
            </button>
          </div>

        </form>
      </div>
    </>
  );
}