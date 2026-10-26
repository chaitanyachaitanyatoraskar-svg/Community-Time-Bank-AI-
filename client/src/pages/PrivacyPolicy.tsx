import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="py-12 px-6 sm:px-10 max-w-4xl mx-auto font-sans space-y-8">
      <div>
        <Link 
          to="/" 
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#111111]/70 dark:text-[#F7F4EC]/70 hover:text-[#111111] dark:hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to TimeBank AI</span>
        </Link>
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#111111]/50 dark:text-[#F7F4EC]/50 block mb-1">
          Data Governance & Confidentiality
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-[#111111] dark:text-[#F7F4EC]">
          Privacy Policy.
        </h1>
        <p className="text-xs text-[#111111]/60 dark:text-[#F7F4EC]/60 mt-2 font-mono">
          Effective: October 2026 • Community Data Protection Charter
        </p>
      </div>

      <div className="bg-[#FAF8F3] dark:bg-[#151515] border border-[#E5E0D8] dark:border-[#222222] p-8 sm:p-12 space-y-10 text-sm leading-relaxed text-[#111111]/80 dark:text-[#F7F4EC]/80">
        <section className="space-y-3">
          <div className="flex items-baseline gap-3 border-b border-[#111111]/10 dark:border-white/10 pb-2">
            <span className="font-serif text-2xl font-bold text-[#FFD21C] bg-[#111111] px-2 py-0.5 leading-none">01</span>
            <h2 className="font-serif text-2xl font-bold text-[#111111] dark:text-[#F7F4EC]">
              Information Collected
            </h2>
          </div>
          <p className="pt-1">
            Community TimeBank AI collects minimal member information necessary to facilitate peer-to-peer service discovery:
          </p>
          <ul className="space-y-2 text-xs pt-1">
            <li className="p-3 bg-[#FDFBF7] dark:bg-[#1A1A1A] border border-[#111111]/10">
              <strong className="text-[#111111] dark:text-white uppercase tracking-wider block mb-0.5">Profile Information</strong>
              Your name, email address, campus or neighborhood area (e.g., Downtown, Westside), and optional biography.
            </li>
            <li className="p-3 bg-[#FDFBF7] dark:bg-[#1A1A1A] border border-[#111111]/10">
              <strong className="text-[#111111] dark:text-white uppercase tracking-wider block mb-0.5">Skill & Availability Listings</strong>
              The skills you offer or request, proficiency levels, and general weekly availability windows.
            </li>
            <li className="p-3 bg-[#FDFBF7] dark:bg-[#1A1A1A] border border-[#111111]/10">
              <strong className="text-[#111111] dark:text-white uppercase tracking-wider block mb-0.5">Transaction & Ledger Records</strong>
              Timestamps, duration hours, agreed multipliers, and mutual confirmation records for service audits.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <div className="flex items-baseline gap-3 border-b border-[#111111]/10 dark:border-white/10 pb-2">
            <span className="font-serif text-2xl font-bold text-[#FFD21C] bg-[#111111] px-2 py-0.5 leading-none">02</span>
            <h2 className="font-serif text-2xl font-bold text-[#111111] dark:text-[#F7F4EC]">
              How We Use Data
            </h2>
          </div>
          <p className="pt-1">
            Data is strictly used to:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs">
            <li>Compute the 5-Factor AI Match Engine scores (skill relevance, location proximity, schedule match, balance health, rating history).</li>
            <li>Maintain an immutable, transparent credit ledger for bilateral accountability.</li>
            <li>Send essential booking and scheduling notifications.</li>
          </ul>
          <p className="text-xs text-[#123D32] dark:text-emerald-400 font-bold uppercase tracking-wider pt-2">
            ✓ We never sell, rent, or monetize member personal data to third-party advertisers.
          </p>
        </section>

        <section className="space-y-3">
          <div className="flex items-baseline gap-3 border-b border-[#111111]/10 dark:border-white/10 pb-2">
            <span className="font-serif text-2xl font-bold text-[#FFD21C] bg-[#111111] px-2 py-0.5 leading-none">03</span>
            <h2 className="font-serif text-2xl font-bold text-[#111111] dark:text-[#F7F4EC]">
              Transparency & Contact Visibility
            </h2>
          </div>
          <p className="pt-1">
            Phone numbers and direct contact details are private by default and only disclosed to the other confirmed party
            once both parties have accepted a scheduled service booking.
          </p>
        </section>

        <section className="space-y-3">
          <div className="flex items-baseline gap-3 border-b border-[#111111]/10 dark:border-white/10 pb-2">
            <span className="font-serif text-2xl font-bold text-[#FFD21C] bg-[#111111] px-2 py-0.5 leading-none">04</span>
            <h2 className="font-serif text-2xl font-bold text-[#111111] dark:text-[#F7F4EC]">
              Data Retention & Account Deletion
            </h2>
          </div>
          <p className="pt-1">
            Members may request account deactivation or modification of their profile details at any time through their Profile Settings.
            Ledger transactions remain recorded with anonymized identifiers to preserve community credit balances and audit trails.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
