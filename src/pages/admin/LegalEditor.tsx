import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase/config';
import toast from 'react-hot-toast';
import { Save } from 'lucide-react';

const LEGAL_PAGES = [
  { slug: 'privacy-policy', name: 'Privacy Policy' },
  { slug: 'terms-conditions', name: 'Terms & Conditions' },
  { slug: 'refund-policy', name: 'Refund Policy' },
];

export default function LegalEditor() {
  const [selectedSlug, setSelectedSlug] = useState('privacy-policy');
  const [title, setTitle] = useState('Privacy Policy');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const fetchPageContent = async () => {
      setFetching(true);
      try {
        const docRef = doc(db, 'legalPages', selectedSlug);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setTitle(docSnap.data().title || '');
          setContent(docSnap.data().content || '');
        } else {
          setTitle(LEGAL_PAGES.find(p => p.slug === selectedSlug)?.name || '');
          setContent('');
        }
      } catch (error) {
        console.error("Error fetching legal page:", error);
        toast.error("Failed to load page content");
      } finally {
        setFetching(false);
      }
    };
    fetchPageContent();
  }, [selectedSlug]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Saving policy...");

    try {
      const docRef = doc(db, 'legalPages', selectedSlug);
      await setDoc(docRef, {
        title,
        content,
        updatedAt: serverTimestamp()
      }, { merge: true });

      toast.success("Legal page updated successfully!", { id: toastId });
    } catch (error) {
      console.error("Error saving legal page:", error);
      toast.error("Failed to save legal page", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Manage Legal Pages | Admin</title></Helmet>

      <div className="mb-8">
        <h1 className="text-2xl font-black uppercase tracking-tight text-black mb-1">Legal Pages Manager</h1>
        <p className="text-gray-500 text-sm">Create and update your store's legal policies dynamically.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 max-w-4xl shadow-sm">
        {/* Page Selector Tabs */}
        <div className="flex flex-wrap gap-3 mb-8 pb-6 border-b border-gray-200">
          {LEGAL_PAGES.map((page) => (
            <button
              key={page.slug}
              onClick={() => setSelectedSlug(page.slug)}
              className={`px-5 py-2.5 text-xs font-bold uppercase tracking-widest border transition-all ${
                selectedSlug === page.slug
                  ? 'bg-black text-white border-black shadow-md'
                  : 'bg-white text-black border-gray-200 hover:border-black'
              }`}
            >
              {page.name}
            </button>
          ))}
        </div>

        {fetching ? (
          <div className="py-20 text-center text-gray-400">Loading content...</div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Page Title *</label>
              <input
                required
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 p-3 text-sm focus:border-black focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Content (HTML supported, e.g., &lt;p&gt;, &lt;h3&gt;, &lt;ul&gt;) *
              </label>
              <textarea
                required
                rows={12}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter policy content using HTML tags..."
                className="w-full border border-gray-300 p-4 text-sm font-mono focus:border-black focus:outline-none resize-y leading-relaxed"
              ></textarea>
              <p className="text-[11px] text-gray-400 mt-1">You can use standard HTML tags like &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt; for styling.</p>
            </div>

            <div className="pt-4 border-t border-gray-200 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-black text-white px-8 py-3.5 text-xs font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:bg-gray-400"
              >
                <Save className="w-4 h-4" />
                {loading ? 'Saving...' : 'Save Policy'}
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}