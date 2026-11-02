'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../lib/AuthContext';
import { Lock, User, ArrowRight, ShoppingBag, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(username, password);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">

        {/* Logo / Brand */}
        <div className="text-center">
          <div className="w-14 h-14 bg-[#8A4B24] rounded-sm flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#E0D5C4]">
            <ShoppingBag className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome Back</h1>
          <p className="text-sm text-gray-500">
            Login to your <span className="text-[#8A4B24] font-semibold">Tap2Buy</span> account
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-sm border border-gray-100 shadow-sm p-7">

          {/* Error */}
          {error && (
            <div className="mb-5 flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-sm">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Username */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                Username or Email
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-100 rounded-sm bg-gray-50 text-sm focus:outline-none focus:border-[#8A4B24] focus:ring-2 focus:ring-[#8A4B24]/10 focus:bg-white transition-all placeholder:text-gray-400"
                  placeholder="Enter username or email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-[#8A4B24] hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-100 rounded-sm bg-gray-50 text-sm focus:outline-none focus:border-[#8A4B24] focus:ring-2 focus:ring-[#8A4B24]/10 focus:bg-white transition-all placeholder:text-gray-400"
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#8A4B24] hover:bg-[#6E3A1B] disabled:opacity-60 disabled:cursor-not-allowed text-white py-3.5 rounded-sm text-sm font-bold uppercase tracking-wide transition-all shadow-md hover:shadow-lg hover:shadow-[#E0D5C4] flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  Login to Tap2Buy
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400 font-medium">New to Tap2Buy?</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Register link */}
          <Link
            href="/register"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-[#1A1410] text-[#1A1410] hover:bg-[#1A1410] hover:text-white rounded-sm text-sm font-bold uppercase tracking-wide transition-all"
          >
            Create an Account
          </Link>
        </div>

        {/* Trust note */}
        <p className="text-center text-xs text-gray-400">
          By logging in, you agree to our{' '}
          <Link href="/terms-and-conditions" className="text-[#8A4B24] hover:underline">
            Terms & Conditions
          </Link>{' '}
          and{' '}
          <Link href="/privacy-policy" className="text-[#8A4B24] hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </main>
  );
}
