import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { signInWithEmailAndPassword } from 'firebase/auth';
import toast from 'react-hot-toast';
import { auth } from '@/firebase/config';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Login | AniTouch</title></Helmet>
      <div className="container mx-auto px-4 py-20 min-h-[70vh] flex items-center justify-center">
        <div className="w-full max-w-md border border-gray-200 p-8 md:p-10">
          <h1 className="text-2xl font-black uppercase tracking-tighter mb-2 text-center">Sign In</h1>
          <p className="text-sm text-gray-500 text-center mb-8">Access your AniTouch account</p>
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-gray-300 p-3 text-sm focus:border-black focus:outline-none transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Password</label>
              <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-gray-300 p-3 text-sm focus:border-black focus:outline-none transition-colors" />
            </div>
            
            <button type="submit" disabled={loading} className="w-full bg-black text-white py-3.5 text-sm font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors disabled:bg-gray-400 mt-2">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          
          <div className="mt-8 text-center text-sm text-gray-500">
            Don't have an account? <Link to="/register" className="text-black font-bold hover:underline">Create Account</Link>
          </div>
        </div>
      </div>
    </>
  );
}