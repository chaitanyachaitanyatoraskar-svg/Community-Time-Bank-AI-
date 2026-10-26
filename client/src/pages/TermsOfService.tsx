import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const TermsOfService: React.FC = () => {
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
          Charter & Governance Documentation
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-[#111111] dark:text-[#F7F4EC]">
          Terms of Service.
        </h1>
        <p className="text-xs text-[#111111]/60 dark:text-[#F7F4EC]/60 mt-2 font-mono">
          Effective: October 2026 • Civic Skill & Service Reciprocity Charter
        </p>
      </div>

      <div className="bg-[#FAF8F3] dark:bg-[#151515] border border-[#E5E0D8] dark:border-[#222222] p-8 sm:p-12 space-y-10 text-sm leading-relaxed text-[#111111]/80 dark:text-[#F7F4EC]/80">
        <section className="space-y-3">
          <div className="flex items-baseline gap-3 border-b border-[#111111]/10 dark:border-white/10 pb-2">
            <span className="font-serif text-2xl font-bold text-[#FFD21C] bg-[#111111] px-2 py-0.5 leading-none">01</span>
            <h2 className="font-serif text-2xl font-bold text-[#111111] dark:text-[#F7F4EC]">
              Non-Monetary Community Exchange Principle
            </h2>
          </div>
          <p className="pt-1">
            Community TimeBank AI is a peer-to-peer service reciprocity platform. Participation is strictly non-monetary.
            The fundamental unit of exchange is the Time Credit. By policy, 1 hour of verified community service equals
            1 base time credit. Time credits hold no monetary cash value, cannot be redeemed for legal currency, and cannot be
            sold or traded outside the platform.
          </p>
        </section>

        <section className="space-y-3">
          <div className="flex items-baseline gap-3 border-b border-[#111111]/10 dark:border-white/10 pb-2">
            <span className="font-serif text-2xl font-bold text-[#FFD21C] bg-[#111111] px-2 py-0.5 leading-none">02</span>
            <h2 className="font-serif text-2xl font-bold text-[#111111] dark:text-[#F7F4EC]">
              Fair Credit Multiplier System
            </h2>
          </div>
          <p className="pt-1">
            To recognize specialized assistance, hazardous equipment handling, or verified instruction while preserving community fairness:
          </p>
          <ul className="space-y-2 text-xs pt-1">
            <li className="p-3 bg-[#FDFBF7] dark:bg-[#1A1A1A] border border-[#111111]/10">
              <strong className="text-[#111111] dark:text-white uppercase tracking-wider block mb-0.5">Standard Tier (1.0×)</strong>
              General neighborhood assistance, peer tutoring, conversational practice.
            </li>
            <li className="p-3 bg-[#FDFBF7] dark:bg-[#1A1A1A] border border-[#111111]/10">
              <strong className="text-[#111111] dark:text-white uppercase tracking-wider block mb-0.5">Intermediate Tier (1.25×)</strong>
              Certified instruction, complex troubleshooting, moderate physical effort or specialized tools.
            </li>
            <li className="p-3 bg-[#FDFBF7] dark:bg-[#1A1A1A] border border-[#111111]/10">
              <strong className="text-[#111111] dark:text-white uppercase tracking-wider block mb-0.5">Advanced Tier Cap (1.5×)</strong>
              Component-level hardware repair, specialized machinery, or certified life-safety support. The ceiling is strictly capped at 1.5×.
            </li>
          </ul>
          <p className="text-xs text-[#111111]/60 dark:text-[#F7F4EC]/60 italic pt-1">
            Both parties must explicitly agree to the locked multiplier before a booking is accepted. Once accepted, agreed rates are immutable.
          </p>
        </section>

        <section className="space-y-3">
          <div className="flex items-baseline gap-3 border-b border-[#111111]/10 dark:border-white/10 pb-2">
            <span className="font-serif text-2xl font-bold text-[#FFD21C] bg-[#111111] px-2 py-0.5 leading-none">03</span>
            <h2 className="font-serif text-2xl font-bold text-[#111111] dark:text-[#F7F4EC]">
              Bilateral Double-Confirmation Workflow
            </h2>
          </div>
          <p className="pt-1">
            Credits are never deducted automatically or prematurely. Upon completion of a service session:
          </p>
          <ol className="list-decimal pl-5 space-y-1.5 text-xs">
            <li>Both the helper and the requester must submit mutual confirmation of service completion.</li>
            <li>Once dual confirmation is recorded, the credit transfer is executed atomically on the ledger.</li>
            <li>If either party raises an issue before dual confirmation, the session enters Dispute status and is referred to campus moderators for mediation.</li>
          </ol>
        </section>

        <section className="space-y-3">
          <div className="flex items-baseline gap-3 border-b border-[#111111]/10 dark:border-white/10 pb-2">
            <span className="font-serif text-2xl font-bold text-[#FFD21C] bg-[#111111] px-2 py-0.5 leading-none">04</span>
            <h2 className="font-serif text-2xl font-bold text-[#111111] dark:text-[#F7F4EC]">
              Member Conduct and Safety
            </h2>
          </div>
          <p className="pt-1">
            Members agree to treat fellow community participants with respect, provide accurate information regarding skill levels,
            and follow campus/neighborhood safety protocols for in-person meetings. Harassment, misrepresentation of identity, or
            attempting to solicit cash for time-banked services will result in immediate suspension.
          </p>
        </section>

        <section className="space-y-3 border-t border-[#111111]/10 dark:border-white/10 pt-6">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#111111]/50 block">Academic Notice</span>
          <p className="text-xs text-[#111111]/60 dark:text-[#F7F4EC]/60 italic leading-relaxed">
            This platform operates as an academic software engineering capstone and community demonstration. All features,
            ledgers, and demo accounts are governed under institutional research and evaluation guidelines.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService;
