import React, { useState } from 'react';
import { X, Lock, Mail, Phone, User as UserIcon, Shield, AlertCircle, Building2, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, authModalMode, closeAuthModal, login, signup } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>(authModalMode);
  
  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accountType, setAccountType] = useState<'user' | 'host'>('user');

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Sync mode with parent if prop changes
  React.useEffect(() => {
    setMode(authModalMode);
    setError(null);
  }, [authModalMode, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(loginEmail, loginPassword);
      closeAuthModal();
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await signup({
        name,
        email,
        phone,
        password,
        confirmPassword,
        accountType
      });
      closeAuthModal();
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoHost = () => {
    setMode('login');
    setLoginEmail('karthik.properties@avenza.com');
    setLoginPassword('AvenzaHost2026!');
    setError(null);
  };

  const fillDemoUser = () => {
    setMode('login');
    setLoginEmail('rajesh.demo@avenza.com');
    setLoginPassword('AvenzaUser2026!');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 to-forest-900 text-white p-6 relative">
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 p-2 rounded-full text-emerald-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-6 h-6 text-amber-300" />
            <span className="text-xl font-bold font-serif">AVENZA PROPERTY</span>
          </div>
          <p className="text-xs text-emerald-200">
            {mode === 'login' ? 'Welcome back. Sign in to your account.' : 'Create an account to explore & manage properties.'}
          </p>

          {/* Mode Switch Tabs */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-black/20 rounded-xl mt-4">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(null); }}
              className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                mode === 'login' ? 'bg-white text-emerald-950 shadow-xs' : 'text-emerald-200 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setError(null); }}
              className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                mode === 'signup' ? 'bg-white text-emerald-950 shadow-xs' : 'text-emerald-200 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {error && (
            <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm shadow-xs transition-colors"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

              {/* Demo Accounts Helper */}
              <div className="pt-3 border-t border-gray-100">
                <p className="text-[11px] text-gray-500 text-center mb-2 font-medium">Quick 1-Click Demo Accounts</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={fillDemoHost}
                    className="py-1.5 px-2 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-[11px] font-semibold text-amber-900 transition-colors text-center"
                  >
                    Demo Host (Karthik)
                  </button>
                  <button
                    type="button"
                    onClick={fillDemoUser}
                    className="py-1.5 px-2 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-[11px] font-semibold text-emerald-900 transition-colors text-center"
                  >
                    Demo User (Rajesh)
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Senthil Kumar"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@email.com"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Phone</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98421..."
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Account Type Selection */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Account Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAccountType('user')}
                    className={`p-2 rounded-xl border text-xs font-semibold text-left transition-all ${
                      accountType === 'user'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-600'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="font-bold">Standard User</div>
                    <div className="text-[10px] text-gray-500 font-normal">Search, visit & book</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccountType('host')}
                    className={`p-2 rounded-xl border text-xs font-semibold text-left transition-all ${
                      accountType === 'host'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-600'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1">
                      <span>Property Host</span>
                      <Shield className="w-3 h-3 text-amber-500" />
                    </div>
                    <div className="text-[10px] text-gray-500 font-normal">List houses & land</div>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 chars"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Confirm</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm shadow-xs transition-colors mt-2"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
