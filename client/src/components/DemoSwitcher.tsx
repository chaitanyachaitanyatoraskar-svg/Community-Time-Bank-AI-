import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

export const DemoSwitcher: React.FC = () => {
  const { user, demoLogin, logout } = useAuth();

  return (
    <div className="bg-[#111111] border-b border-[#262626] px-4 py-2 text-xs transition-colors">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[#A0A0A0]">
          <span className="w-2 h-2 rounded-full bg-[#FFD21C] shrink-0" />
          <span className="font-semibold text-white">Evaluation Mode:</span>
          <span className="hidden sm:inline text-[#8E8E8E]">
            Switch test personas to inspect different role permissions and workflows
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => demoLogin('member-a')}
            className={`px-3 py-1 rounded-none text-xs font-medium transition-colors ${
              user?.email === 'member.a@college.edu'
                ? 'bg-[#FFD21C] text-[#111111] font-bold'
                : 'bg-[#1C1C1C] hover:bg-[#2A2A2A] text-[#D8D1C2] border border-[#333333]'
            }`}
            title="Alice: Member A (Requester looking for computer assistance)"
          >
            Member A (Alice, Requester)
          </button>

          <button
            onClick={() => demoLogin('member-b')}
            className={`px-3 py-1 rounded-none text-xs font-medium transition-colors ${
              user?.email === 'member.b@college.edu'
                ? 'bg-[#FFD21C] text-[#111111] font-bold'
                : 'bg-[#1C1C1C] hover:bg-[#2A2A2A] text-[#D8D1C2] border border-[#333333]'
            }`}
            title="Bob: Member B (Helper with technical repair & tutoring skills)"
          >
            Member B (Bob, Helper)
          </button>

          <button
            onClick={() => demoLogin('admin')}
            className={`px-3 py-1 rounded-none text-xs font-medium transition-colors ${
              user?.role === 'ADMIN'
                ? 'bg-[#FFD21C] text-[#111111] font-bold'
                : 'bg-[#1C1C1C] hover:bg-[#2A2A2A] text-[#D8D1C2] border border-[#333333]'
            }`}
            title="Campus Administrator: Governance, audit trails, category caps"
          >
            Administrator
          </button>

          {user && (
            <button
              onClick={logout}
              className="px-2.5 py-1 rounded-none bg-[#1C1C1C] hover:bg-rose-950/80 hover:text-rose-300 text-[#8E8E8E] border border-[#333333] font-medium transition-colors flex items-center gap-1 ml-1"
              title="End current session"
            >
              <LogOut className="w-3 h-3" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
