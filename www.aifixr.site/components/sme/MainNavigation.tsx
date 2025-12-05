'use client';

import { Sparkles } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import AIFIXRPanel from '../AIFIXRPanel';

export default function MainNavigation() {
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const tabs = [
    { id: 'intro', label: 'AIFIX 소개', path: '/sme' },
    { id: 'rating', label: '기업 ESG 등급', path: '#' },
    { id: 'news', label: 'ESG 소식', path: '#' },
    { id: 'notice', label: '공지사항', path: '#' },
    { id: 'self-diagnosis', label: '자가진단', path: '/sme/self-diagnosis' },
    { id: 'auto-report', label: '자동화 보고서', path: '/sme/auto-report' },
    { id: 'editing', label: '윤문 AI', path: '/sme/editing' },
  ];

  const handleTabClick = (tab: typeof tabs[0], e: React.MouseEvent) => {
    e.preventDefault();
    if (tab.path !== '#') {
      router.push(tab.path);
    }
  };

  return (
    <>
      <div className="fixed top-[72px] left-0 right-0 z-40 backdrop-blur-[20px] bg-white/85 border-b border-gray-200/50">
        <div className="max-w-[1440px] mx-auto px-8">
          <nav className="flex items-center gap-2 py-4 overflow-x-auto">
            {tabs.map((tab) => {
              const isActive = pathname === tab.path;
              return (
                <Link
                  key={tab.id}
                  href={tab.path}
                  onClick={(e) => handleTabClick(tab, e)}
                  className={`relative px-6 py-2.5 rounded-xl whitespace-nowrap transition-all ${isActive
                    ? 'text-white bg-[#0D4ABB] shadow-md'
                    : 'text-[#1a2332] hover:text-[#0D4ABB] hover:bg-gray-50'
                    }`}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'linear-gradient(90deg, #0D4ABB, #E91E8C, #00D4FF, #8B5CF6, #0D4ABB)';
                      e.currentTarget.style.backgroundSize = '200% 100%';
                      e.currentTarget.style.animation = 'ripple 2s linear infinite';
                      e.currentTarget.style.backgroundClip = 'text';
                      e.currentTarget.style.webkitBackgroundClip = 'text';
                      e.currentTarget.style.webkitTextFillColor = 'transparent';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = '';
                      e.currentTarget.style.backgroundSize = '';
                      e.currentTarget.style.animation = '';
                      e.currentTarget.style.backgroundClip = '';
                      e.currentTarget.style.webkitBackgroundClip = '';
                      e.currentTarget.style.webkitTextFillColor = '';
                    }
                  }}
                >
                  {tab.label}
                </Link>
              );
            })}

            {/* Virtual Human AI Button - Right Side */}
            <button
              onClick={() => setIsAIPanelOpen(!isAIPanelOpen)}
              className={`relative px-6 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-3 whitespace-nowrap ml-auto ${isAIPanelOpen
                ? 'bg-[#0D4ABB] text-white'
                : 'bg-gradient-to-r from-[#00D4FF] to-[#0D4ABB] text-white hover:shadow-lg hover:scale-105'
                }`}
            >
              <Sparkles className="w-5 h-5" />
              <span className="font-medium">Virtual Human AI</span>
            </button>
          </nav>
        </div>
      </div>

      {/* AI Panel */}
      <AIFIXRPanel isOpen={isAIPanelOpen} onClose={() => setIsAIPanelOpen(false)} />
    </>
  );
}
