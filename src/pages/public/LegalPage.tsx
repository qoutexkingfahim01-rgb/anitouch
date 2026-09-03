import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';

export default function LegalPage() {
  const { slug } = useParams<{ slug: string }>();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLegalContent = async () => {
      if (!slug) return;
      try {
        const docRef = doc(db, 'legalPages', slug);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setTitle(docSnap.data().title || slug);
          setContent(docSnap.data().content || '');
        } else {
          setTitle(slug.replace('-', ' '));
          setContent('<p>Content for this page is being updated. Please check back later.</p>');
        }
      } catch (error) {
        console.error("Error fetching legal page:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLegalContent();
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center items-center h-[50vh]">
        <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{title} | AniTouch</title>
      </Helmet>
      
      <div className="container mx-auto px-4 lg:px-8 py-16 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-8 capitalize">{title}</h1>
        <div 
          className="prose max-w-none text-gray-700 text-sm leading-relaxed space-y-4"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </>
  );
}