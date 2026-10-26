import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowRight, 
  Check, 
  Scale, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { demoLogin } = useAuth();

  // Interactive Live Rate Calculator state
  const [calcTier, setCalcTier] = useState<1.0 | 1.25 | 1.5>(1.0);
  const [calcHours, setCalcHours] = useState<number>(2);

  const tierDetails = {
    1.0: {
      name: 'Standard (1.0×)',
      desc: 'General assistance, peer tutoring, conversational language practice, neighborhood errands.',
    },
    1.25: {
      name: 'Intermediate (1.25×)',
      desc: 'Certified skills, diagnostics, specialized software instruction, moderate tools.',
    },
    1.5: {
      name: 'Advanced (1.5× Cap)',
      desc: 'Component repair, hazardous equipment handling, accredited technical translation.',
    }
  };

  const calculatedCredits = (calcHours * calcTier).toFixed(1);

  const categories = [
    { name: 'Programming & Tech', count: 'Python, Web, Hardware', code: '01' },
    { name: 'Languages & Tutoring', count: 'English, Spanish, Math', code: '02' },
    { name: 'Design & Creative', count: 'UI Design, Video, Studio', code: '03' },
    { name: 'Gardening & Outdoors', count: 'Urban Farming, Soil Prep', code: '04' },
    { name: 'Academic Support', count: 'Calculus, Physics, Lab Help', code: '05' },
    { name: 'Life Skills & Repair', count: 'Bicycle Tune-up, Woodwork', code: '06' },
  ];

  return (
    <div className="bg-[#F7F4EC] dark:bg-[#141414] text-[#111111] dark:text-[#F7F4EC] min-h-screen">
      {/* Editorial Hero Section */}
      <section className="pt-12 sm:pt-16 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-[#E5E0D8] dark:border-[#262626]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Bold Headline & Reciprocity Thesis */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-widest uppercase text-[#4A4A4A] dark:text-[#A0A0A0] border border-[#D8D1C2] dark:border-[#333333] px-2.5 py-1 rounded-none bg-[#FAF8F3] dark:bg-[#1C1C1C]">
              <span>[</span>
              <span className="font-semibold text-[#111111] dark:text-[#FFD21C]">CIVIC SKILL & SERVICE RECIPROCITY</span>
              <span>]</span>
            </div>

            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-[#111111] dark:text-white leading-[1.06] tracking-tight">
              Real people.<br />
              Real skills.<br />
              Stronger<br />
              <span className="bg-[#FFD21C] text-[#111111] px-3 py-0.5 inline-block font-serif mt-1">
                communities.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[#4A4A4A] dark:text-[#B0B0B0] max-w-lg leading-relaxed font-sans">
              Exchange verified service hours, learn new skills, and support your neighborhood — without money.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                to="/find-help"
                className="bg-[#111111] hover:bg-[#2A2A2A] text-white dark:bg-white dark:text-black dark:hover:bg-[#EFECE3] font-medium text-xs sm:text-sm px-6 py-3 rounded-none transition-colors flex items-center gap-2"
              >
                <span>Explore Skills Catalog</span>
                <span className="text-sm">→</span>
              </Link>
              <Link
                to="/auth?mode=register"
                className="bg-[#F7F4EC] dark:bg-[#1C1C1C] hover:bg-[#EFECE3] dark:hover:bg-[#262626] text-[#111111] dark:text-white font-medium text-xs sm:text-sm px-5 py-3 rounded-none border border-[#111111] dark:border-[#444444] transition-colors"
              >
                Create Member Account
              </Link>
            </div>

            {/* 3 Micro-Features with Thin Dividers */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#E5E0D8] dark:border-[#262626]">
              <div>
                <p className="font-mono text-xs font-bold text-[#111111] dark:text-white">1:1</p>
                <h4 className="text-xs font-bold text-[#111111] dark:text-white mt-0.5">Base Credit Parity</h4>
                <p className="text-[11px] text-[#6B6B6B] dark:text-[#8E8E8E] mt-0.5">Fair hour exchange</p>
              </div>
              <div className="border-l border-[#E5E0D8] dark:border-[#262626] pl-4">
                <p className="font-mono text-xs font-bold text-[#111111] dark:text-white">2/2</p>
                <h4 className="text-xs font-bold text-[#111111] dark:text-white mt-0.5">Dual Verification</h4>
                <p className="text-[11px] text-[#6B6B6B] dark:text-[#8E8E8E] mt-0.5">Both sign off</p>
              </div>
              <div className="border-l border-[#E5E0D8] dark:border-[#262626] pl-4">
                <p className="font-mono text-xs font-bold text-[#111111] dark:text-white">1.5×</p>
                <h4 className="text-xs font-bold text-[#111111] dark:text-white mt-0.5">Audited Multipliers</h4>
                <p className="text-[11px] text-[#6B6B6B] dark:text-[#8E8E8E] mt-0.5">Maintains trust</p>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Documentary Collage */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            {/* Bright Yellow Editorial Wash Graphic behind primary photo */}
            <div className="absolute -top-4 -right-4 w-72 h-72 sm:w-88 sm:h-88 bg-[#FFD21C] rounded-full blur-[2px] opacity-90 -z-0 transform translate-x-4 -translate-y-2 pointer-events-none" />

            {/* Main Editorial Image Container */}
            <div className="relative z-10 w-full max-w-lg bg-[#111111] p-2.5 rounded-none border border-[#111111]">
              {/* Handwritten note annotation top left */}
              <div className="absolute -top-7 left-6 z-20 font-handwriting text-2xl sm:text-3xl text-[#111111] dark:text-[#FFD21C] -rotate-3 select-none pointer-events-none leading-none">
                Skills People Community Impact
              </div>

              <div className="overflow-hidden rounded-none border border-[#222222]">
                <img
                  src="/images/hero_collaboration.jpg"
                  alt="Students collaborating over laptop in library studio"
                  className="w-full h-80 sm:h-96 object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
                />
              </div>

              {/* Caption Bar */}
              <div className="pt-2 pb-0.5 px-1 flex items-center justify-between text-[11px] text-[#A0A0A0]">
                <span className="font-mono">FIG. 01 — MUTUAL LEARNING</span>
                <span className="text-[#FFD21C] font-semibold">CAMPUS CIRCLE</span>
              </div>
            </div>

            {/* Overlapping Secondary Documentary Photo */}
            <div className="absolute -bottom-8 -right-2 sm:-right-4 z-20 w-36 sm:w-44 bg-[#FAF8F3] dark:bg-[#1C1C1C] p-2 rounded-none border border-[#111111] shadow-[4px_4px_0px_0px_#111111] hidden sm:block">
              <img
                src="/images/campus_walk.jpg"
                alt="Community walk"
                className="w-full h-36 sm:h-44 object-cover grayscale contrast-125"
              />
              <p className="font-handwriting text-sm text-[#111111] dark:text-[#FFD21C] text-center mt-1.5 leading-tight">
                A Stronger Tomorrow Together
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How TimeBank AI Works — Editorial 4-Column Numbered Architecture */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-[#E5E0D8] dark:border-[#262626]">
        <div className="mb-12 text-left">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#6B6B6B] dark:text-[#8E8E8E] block mb-1">
            EXCHANGE LIFECYCLE
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#111111] dark:text-white">
            How TimeBank AI Works
          </h2>
          <p className="text-xs sm:text-sm text-[#6B6B6B] dark:text-[#A0A0A0] mt-1 font-sans">
            A transparent, community-driven system for fair skill exchange.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x divide-[#E5E0D8] dark:divide-[#262626]">
          {/* Step 01 */}
          <div className="lg:pr-8 space-y-3">
            <span className="font-serif text-4xl sm:text-5xl font-bold text-[#FFD21C] dark:text-[#FFD21C] block leading-none">
              01
            </span>
            <h3 className="font-serif text-xl font-bold text-[#111111] dark:text-white">
              Share a Skill
            </h3>
            <p className="text-xs text-[#4A4A4A] dark:text-[#A0A0A0] leading-relaxed">
              List what you can help with or request support from your community. Choose the appropriate complexity tier and availability window.
            </p>
          </div>

          {/* Step 02 */}
          <div className="lg:px-8 space-y-3">
            <span className="font-serif text-4xl sm:text-5xl font-bold text-[#FFD21C] dark:text-[#FFD21C] block leading-none">
              02
            </span>
            <h3 className="font-serif text-xl font-bold text-[#111111] dark:text-white">
              Get Verified
            </h3>
            <p className="text-xs text-[#4A4A4A] dark:text-[#A0A0A0] leading-relaxed">
              Sessions are confirmed by both requester and helper. Credits are only released when both parties sign off on completion.
            </p>
          </div>

          {/* Step 03 */}
          <div className="lg:px-8 space-y-3">
            <span className="font-serif text-4xl sm:text-5xl font-bold text-[#FFD21C] dark:text-[#FFD21C] block leading-none">
              03
            </span>
            <h3 className="font-serif text-xl font-bold text-[#111111] dark:text-white">
              Earn Credits
            </h3>
            <p className="text-xs text-[#4A4A4A] dark:text-[#A0A0A0] leading-relaxed">
              1 hour of verified assistance equals 1 base credit. Specialized skills apply governed multipliers up to 1.5× with admin oversight.
            </p>
          </div>

          {/* Step 04 */}
          <div className="lg:pl-8 space-y-3">
            <span className="font-serif text-4xl sm:text-5xl font-bold text-[#FFD21C] dark:text-[#FFD21C] block leading-none">
              04
            </span>
            <h3 className="font-serif text-xl font-bold text-[#111111] dark:text-white">
              Give Back
            </h3>
            <p className="text-xs text-[#4A4A4A] dark:text-[#A0A0A0] leading-relaxed">
              Redeem credits for help when you need it, claim campus partner perks, or donate surplus hours to the community relief pool.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Fair Credit Multiplier Calculator */}
      <section id="credit-rules" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-[#E5E0D8] dark:border-[#262626]">
        <div className="bg-[#FAF8F3] dark:bg-[#1C1C1C] border border-[#111111] dark:border-[#333333] rounded-none p-6 sm:p-10 shadow-none">
          <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 pb-6 border-b border-[#E5E0D8] dark:border-[#262626]">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#6B6B6B] dark:text-[#8E8E8E] block mb-1">
                GOVERNANCE & PARITY
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#111111] dark:text-white">
                Fair Credit Multiplier Calculator
              </h2>
            </div>
            <p className="text-xs font-mono text-[#6B6B6B] dark:text-[#A0A0A0] bg-[#F7F4EC] dark:bg-[#141414] px-3 py-1.5 rounded-none border border-[#E5E0D8] dark:border-[#333333]">
              credits = duration_hours × agreed_multiplier
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 items-center">
            {/* Left Controls */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#4A4A4A] dark:text-[#A0A0A0] mb-3">
                  1. Select Service Complexity Tier
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[1.0, 1.25, 1.5].map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setCalcTier(tier as any)}
                      className={`p-3.5 rounded-none border text-left transition-colors ${
                        calcTier === tier
                          ? 'border-[#111111] bg-[#FFD21C] text-[#111111] shadow-none'
                          : 'border-[#E5E0D8] dark:border-[#333333] bg-[#FAF8F3] dark:bg-[#141414] text-[#4A4A4A] dark:text-[#A0A0A0] hover:border-[#111111]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-serif font-bold text-lg leading-none">
                          {tier}× Rate
                        </span>
                        {calcTier === tier && (
                          <span className="w-2 h-2 rounded-full bg-[#111111]" />
                        )}
                      </div>
                      <span className="text-[11px] block mt-1 leading-snug">
                        {tier === 1.0 ? 'Standard assistance' : tier === 1.25 ? 'Instruction & tools' : 'Certified / repair'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-mono text-[#4A4A4A] dark:text-[#A0A0A0] mb-2">
                  <span>2. Session Duration</span>
                  <span className="font-bold text-[#111111] dark:text-white text-sm">{calcHours.toFixed(1)} Hours</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="6"
                  step="0.5"
                  value={calcHours}
                  onChange={(e) => setCalcHours(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-[#E5E0D8] dark:bg-[#333333] rounded appearance-none cursor-pointer accent-[#111111]"
                />
                <div className="flex justify-between text-[10px] font-mono text-[#8E8E8E] mt-1.5">
                  <span>1.0 hr</span>
                  <span>3.0 hrs</span>
                  <span>6.0 hrs</span>
                </div>
              </div>

              <div className="p-3 bg-[#FAF8F3] dark:bg-[#141414] border border-[#E5E0D8] dark:border-[#262626] rounded-none text-xs text-[#6B6B6B] dark:text-[#A0A0A0] leading-relaxed">
                <span className="font-semibold text-[#111111] dark:text-white">Tier Definition: </span>
                {tierDetails[calcTier].desc}
              </div>
            </div>

            {/* Right Display Box */}
            <div className="lg:col-span-5 bg-[#FAF8F3] dark:bg-[#141414] p-6 sm:p-8 rounded-none border border-[#111111] dark:border-[#333333] text-center space-y-4">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#6B6B6B] dark:text-[#8E8E8E] block">
                CALCULATED SETTLEMENT
              </span>
              <div className="py-2">
                <span className="font-serif text-6xl sm:text-7xl font-bold text-[#111111] dark:text-white block leading-none">
                  {calculatedCredits}
                </span>
                <span className="text-xs font-mono uppercase tracking-wider font-semibold text-[#4A4A4A] dark:text-[#A0A0A0] mt-2 block">
                  Time Credits Due
                </span>
              </div>

              <div className="pt-4 border-t border-[#E5E0D8] dark:border-[#262626] flex justify-between text-xs font-mono text-[#6B6B6B] dark:text-[#8E8E8E]">
                <span>Base: {calcHours.toFixed(1)} hrs</span>
                <span>•</span>
                <span>Tier: {calcTier}×</span>
                <span>•</span>
                <span className="text-[#111111] dark:text-[#FFD21C] font-bold">Total: {calculatedCredits} cr</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Catalog Overview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-[#E5E0D8] dark:border-[#262626]">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-8 gap-2">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#6B6B6B] dark:text-[#8E8E8E] block mb-1">
              COMMUNITY DIRECTORY
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#111111] dark:text-white">
              Explore Skills by Category
            </h2>
          </div>
          <Link
            to="/find-help"
            className="text-xs font-mono uppercase tracking-wider text-[#111111] dark:text-[#FFD21C] hover:underline font-bold flex items-center gap-1"
          >
            <span>View All Listings</span>
            <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              to="/find-help"
              className="bg-[#FAF8F3] dark:bg-[#1C1C1C] p-4 rounded-none border border-[#E5E0D8] dark:border-[#262626] hover:border-[#111111] dark:hover:border-white transition-colors group block"
            >
              <span className="font-mono text-[10px] text-[#8E8E8E] group-hover:text-[#111111] dark:group-hover:text-[#FFD21C] transition-colors block mb-2">
                [{cat.code}]
              </span>
              <h3 className="font-serif font-bold text-sm text-[#111111] dark:text-white leading-tight">
                {cat.name}
              </h3>
              <p className="text-[11px] text-[#6B6B6B] dark:text-[#8E8E8E] mt-1 line-clamp-1">
                {cat.count}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Academic Evaluation Sandbox Switcher Bar */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-[#FAF8F3] dark:bg-[#1C1C1C] p-6 rounded-none border border-[#E5E0D8] dark:border-[#262626] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#FFD21C] bg-[#111111] px-2 py-0.5 rounded-none inline-block font-semibold">
              EVALUATION SANDBOX
            </span>
            <h3 className="font-serif font-bold text-lg text-[#111111] dark:text-white">
              Instant Persona Switcher
            </h3>
            <p className="text-xs text-[#6B6B6B] dark:text-[#A0A0A0]">
              Test any user role with pre-seeded data and verified bilateral transaction logs.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => demoLogin('member-a')}
              className="px-4 py-2 rounded-none bg-[#FAF8F3] dark:bg-[#141414] hover:bg-[#FFD21C] hover:text-[#111111] text-[#111111] dark:text-white text-xs font-semibold border border-[#111111] dark:border-[#444444] transition-colors"
            >
              Alice (Requester)
            </button>
            <button
              onClick={() => demoLogin('member-b')}
              className="px-4 py-2 rounded-none bg-[#FAF8F3] dark:bg-[#141414] hover:bg-[#FFD21C] hover:text-[#111111] text-[#111111] dark:text-white text-xs font-semibold border border-[#111111] dark:border-[#444444] transition-colors"
            >
              Bob (Helper)
            </button>
            <button
              onClick={() => demoLogin('admin')}
              className="px-4 py-2 rounded-none bg-[#111111] text-white dark:bg-white dark:text-black hover:bg-[#2A2A2A] text-xs font-semibold transition-colors"
            >
              Administrator
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

