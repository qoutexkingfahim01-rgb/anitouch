import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { auth, db } from '@/firebase/config';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update auth profile
      await updateProfile(user, { displayName: name });

      // Save user to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: name,
        role: 'customer',
        createdAt: Date.now()
      });

      toast.success('Account created successfully!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Create Account | AniTouch</title></Helmet>
      <div className="container mx-auto px-4 py-20 min-h-[70vh] flex items-center justify-center">
        <div className="w-full max-w-md border border-gray-200 p-8 md:p-10">
          <h1 className="text-2xl font-black uppercase tracking-tighter mb-2 text-center">Create Account</h1>
          <p className="text-sm text-gray-500 text-center mb-8">Join the AniTouch community</p>
          
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
              <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-gray-300 p-3 text-sm focus:border-black focus:outline-none transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-gray-300 p-3 text-sm focus:border-black focus:outline-none transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Password</label>
              <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} className="w-full border border-gray-300 p-3 text-sm focus:border-black focus:outline-none transition-colors" />
            </div>
            
            <button type="submit" disabled={loading} className="w-full bg-black text-white py-3.5 text-sm font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors disabled:bg-gray-400 mt-2">
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>
          
          <div className="mt-8 text-center text-sm text-gray-500">
            Already have an account? <Link to="/login" className="text-black font-bold hover:underline">Sign In</Link>
          </div>
        </div>
      </div>
    </>
  );
}