import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#111111] text-[#A0A0A0] text-xs mt-auto border-t border-[#262626]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand & Purpose */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#FFD21C] text-[#111111] flex items-center justify-center rounded-none font-serif font-bold text-xs">
                ⌛
              </div>
              <span className="font-serif text-lg font-bold text-white tracking-tight">TimeBank AI</span>
            </div>
            <p className="text-[#8E8E8E] leading-relaxed text-xs">
              A verified peer-to-peer service reciprocity platform. Members exchange skills and support their neighborhood without money.
            </p>
            <div className="pt-1 text-[11px] text-[#6B6B6B]">
              1:1 Base Hours • Dual-Party Verification • Admin-Audited
            </div>
          </div>

          {/* Core Modules */}
          <div>
            <h4 className="font-serif text-white text-sm mb-3">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/find-help" className="hover:text-[#FFD21C] transition-colors">
                  Explore Skills Catalog
                </Link>
              </li>
              <li>
                <Link to="/auth?mode=login" className="hover:text-[#FFD21C] transition-colors">
                  Member Workspace
                </Link>
              </li>
              <li>
                <Link to="/community-pool" className="hover:text-[#FFD21C] transition-colors">
                  Community Relief Pool
                </Link>
              </li>
              <li>
                <Link to="/redeem" className="hover:text-[#FFD21C] transition-colors">
                  Perks & Vouchers
                </Link>
              </li>
            </ul>
          </div>

          {/* Governance & Rules */}
          <div>
            <h4 className="font-serif text-white text-sm mb-3">Governance</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#credit-rules" className="hover:text-[#FFD21C] transition-colors">
                  Fair Credit Multipliers (1.0× to 1.5×)
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-[#FFD21C] transition-colors">
                  Dual-Party Confirmation Policy
                </a>
              </li>
              <li>
                <Link to="/terms" className="hover:text-[#FFD21C] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-[#FFD21C] transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Academic Capstone */}
          <div>
            <h4 className="font-serif text-white text-sm mb-3">Initiative</h4>
            <p className="text-[#8E8E8E] mb-2 leading-relaxed">
              Civic Skill & Time Reciprocity Network.
            </p>
            <p className="text-[#6B6B6B] text-[11px]">
              Designed for authentic community impact and fair local reciprocity.
            </p>
          </div>
        </div>

        <div className="border-t border-[#262626] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#6B6B6B]">
          <p>© {new Date().getFullYear()} TimeBank AI. People, skills, community.</p>
          <div className="flex items-center gap-4">
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <span>v2.0 Editorial Edition</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
