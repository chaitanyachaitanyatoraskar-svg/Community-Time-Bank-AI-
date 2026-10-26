import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user } = useAuth();

  return (
    <nav className="bg-[#F7F4EC] dark:bg-[#141414] border-b border-[#E5E0D8] dark:border-[#262626] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Editorial Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 bg-[#111111] dark:bg-[#FAF8F3] text-[#FAF8F3] dark:text-[#111111] flex items-center justify-center rounded-none font-serif font-bold text-base leading-none">
              ⌛
            </div>
            <div className="flex items-baseline">
              <span className="font-serif text-2xl font-bold text-[#111111] dark:text-[#F7F4EC] tracking-tight">
                TimeBank
              </span>
              <span className="font-serif italic text-xl text-[#111111] dark:text-[#F7F4EC] ml-1">
                AI
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center space-x-8 text-xs uppercase tracking-wider font-semibold text-[#4A4A4A] dark:text-[#A0A0A0]">
            <Link to="/" className="hover:text-[#111111] dark:hover:text-white transition-colors">
              Platform
            </Link>
            <Link to="/find-help" className="hover:text-[#111111] dark:hover:text-white transition-colors">
              Skills
            </Link>
            <a href="#how-it-works" className="hover:text-[#111111] dark:hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#credit-rules" className="hover:text-[#111111] dark:hover:text-white transition-colors">
              Credit Rules
            </a>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <Link
                to="/dashboard"
                className="bg-[#FFD21C] hover:bg-[#E8BD14] text-[#111111] font-semibold text-xs px-4 py-2 rounded-none border border-[#FFD21C] transition-colors flex items-center gap-1.5"
              >
                <span>Go to Workspace</span>
                <span>→</span>
              </Link>
            ) : (
              <>
                <Link
                  to="/auth?mode=login"
                  className="px-3.5 py-1.5 text-xs font-semibold text-[#111111] dark:text-[#E7E2D6] hover:underline transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/auth?mode=register"
                  className="bg-[#FFD21C] hover:bg-[#E8BD14] text-[#111111] font-semibold text-xs px-4 py-2 rounded-none border border-[#FFD21C] transition-colors flex items-center gap-1"
                >
                  <span>Go to Workspace</span>
                  <span>→</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

