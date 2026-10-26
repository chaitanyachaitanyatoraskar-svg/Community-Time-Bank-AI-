import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Clock, ShieldCheck, Check, ArrowRight } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, register, demoLogin } = useAuth();

  const [isRegister, setIsRegister] = useState(searchParams.get('mode') === 'register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (isRegister && password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      if (isRegister) {
        await register({ email, password, fullName, area: 'Downtown' });
      } else {
        await login({ email, password });
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (role: 'member-a' | 'member-b' | 'admin') => {
    try {
      await demoLogin(role);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-[#F7F4EC] dark:bg-[#101010]">
      <div className="w-full max-w-4xl space-y-6">
        {/* Fast Evaluation Bar */}
        <div className="bg-[#FAF8F3] dark:bg-[#141414] border border-[#E5E0D8] dark:border-[#262626] p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#FFD21C] border border-black" />
            <span className="font-bold uppercase tracking-wider text-[#111111] dark:text-white">
              Instant Evaluation Personas:
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleDemo('member-a')}
              className="px-3 py-1.5 bg-[#F7F4EC] dark:bg-[#222] hover:bg-[#FFD21C] hover:text-black text-[#111111] dark:text-white font-bold text-xs uppercase tracking-wider border border-[#E5E0D8] dark:border-[#333] transition-colors cursor-pointer"
            >
              Alice (Requester)
            </button>
            <button
              onClick={() => handleDemo('member-b')}
              className="px-3 py-1.5 bg-[#F7F4EC] dark:bg-[#222] hover:bg-[#FFD21C] hover:text-black text-[#111111] dark:text-white font-bold text-xs uppercase tracking-wider border border-[#E5E0D8] dark:border-[#333] transition-colors cursor-pointer"
            >
              Bob (Helper)
            </button>
            <button
              onClick={() => handleDemo('admin')}
              className="px-3 py-1.5 bg-[#F7F4EC] dark:bg-[#222] hover:bg-[#FFD21C] hover:text-black text-[#111111] dark:text-white font-bold text-xs uppercase tracking-wider border border-[#E5E0D8] dark:border-[#333] transition-colors cursor-pointer"
            >
              Campus Admin
            </button>
          </div>
        </div>

        {/* Split Editorial Card */}
        <div className="bg-[#FAF8F3] dark:bg-[#141414] border border-[#E5E0D8] dark:border-[#262626] shadow-[6px_6px_0px_0px_#111111] grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Left Form (7 cols) */}
          <div className="md:col-span-7 p-6 sm:p-10 space-y-6">
            <div className="space-y-2 border-b border-[#E5E0D8] dark:border-[#262626] pb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest bg-[#FFD21C] text-black px-2 py-0.5 inline-block">
                TimeBank AI Civic Network
              </span>
              <h1 className="font-serif font-bold text-3xl sm:text-4xl text-[#111111] dark:text-white">
                {isRegister ? 'Join the Community' : 'Member Sign In'}
              </h1>
              <p className="text-xs text-[#111111]/70 dark:text-white/70">
                {isRegister
                  ? 'Open your civic ledger account with 3.0 introductory time credits.'
                  : 'Access your balance, active sessions, and community skill requests.'}
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {isRegister && (
                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#111111] dark:text-white mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Alice Johnson"
                    className="w-full px-3.5 py-2.5 bg-[#F7F4EC] dark:bg-[#1c1c1c] border border-[#E5E0D8] dark:border-[#333] text-[#111111] dark:text-white focus:outline-hidden focus:border-black rounded-none"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold uppercase tracking-wider text-[#111111] dark:text-white mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@campus.edu or email@domain.com"
                  className="w-full px-3.5 py-2.5 bg-[#F7F4EC] dark:bg-[#1c1c1c] border border-[#E5E0D8] dark:border-[#333] text-[#111111] dark:text-white focus:outline-hidden focus:border-black rounded-none"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-[#111111] dark:text-white mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full px-3.5 py-2.5 bg-[#F7F4EC] dark:bg-[#1c1c1c] border border-[#E5E0D8] dark:border-[#333] text-[#111111] dark:text-white focus:outline-hidden focus:border-black rounded-none"
                />
              </div>

              {isRegister && (
                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#111111] dark:text-white mb-1.5">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    className="w-full px-3.5 py-2.5 bg-[#F7F4EC] dark:bg-[#1c1c1c] border border-[#E5E0D8] dark:border-[#333] text-[#111111] dark:text-white focus:outline-hidden focus:border-black rounded-none"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#111111] hover:bg-black text-white font-bold text-xs uppercase tracking-wider transition-colors border border-black cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <span>{loading ? 'Processing...' : isRegister ? 'Complete Registration' : 'Sign In to Workspace'}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#FFD21C]" />
              </button>
            </form>

            <div className="pt-2 text-center text-xs text-[#111111]/70 dark:text-white/70">
              {isRegister ? (
                <span>
                  Already registered?{' '}
                  <button
                    onClick={() => setIsRegister(false)}
                    className="font-bold underline text-[#111111] dark:text-white decoration-[#FFD21C] decoration-2 cursor-pointer"
                  >
                    Log in here
                  </button>
                </span>
              ) : (
                <span>
                  New to TimeBank AI?{' '}
                  <button
                    onClick={() => setIsRegister(true)}
                    className="font-bold underline text-[#111111] dark:text-white decoration-[#FFD21C] decoration-2 cursor-pointer"
                  >
                    Create a free member account
                  </button>
                </span>
              )}
            </div>
          </div>

          {/* Right Editorial Story / Image Column (5 cols) */}
          <div className="md:col-span-5 bg-[#FAF8F3] dark:bg-[#181818] p-6 sm:p-8 flex flex-col justify-between border-t md:border-t-0 md:border-l border-[#E5E0D8] dark:border-[#262626]">
            <div className="space-y-6">
              <div className="w-full h-44 overflow-hidden border border-[#E5E0D8] dark:border-[#333]">
                <img
                  src="/images/hero_collaboration.jpg"
                  alt="Students in study session"
                  className="w-full h-full object-cover grayscale contrast-125 filter"
                />
              </div>

              <div className="space-y-3">
                <span className="text-3xl font-serif text-[#FFD21C] leading-none block select-none">“</span>
                <p className="font-serif text-lg text-[#111111] dark:text-white italic leading-snug">
                  Every hour of help creates community wealth without monetary debt.
                </p>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#111111]/50 dark:text-white/50 block">
                  Bilateral Dual-Party Verification Guarantee
                </span>
              </div>

              <div className="space-y-2.5 pt-2 text-xs text-[#111111]/80 dark:text-white/80">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#FFD21C]" />
                  <span>3.0 Initial credits for new accounts</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#123D32]" />
                  <span>100% verified campus skill exchanges</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-black" />
                  <span>Zero cash or transaction fees</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#E5E0D8] dark:border-[#333] text-[10px] text-[#111111]/50 dark:text-white/50 uppercase tracking-widest">
              Civic reciprocity • Capstone Governance
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
