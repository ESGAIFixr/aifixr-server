'use client';

import { LayoutDashboard, Building2, FileText, Bell, User } from "lucide-react";

const menuItems = [
  { id: "portal", icon: LayoutDashboard, label: "대시보드", screen: "portal" },
  { id: "dashboard", icon: LayoutDashboard, label: "대시보드", screen: "dashboard" },
  { id: "sme-list", icon: Building2, label: "관계사 목록", screen: "sme-list" },
  { id: "report-center", icon: FileText, label: "보고서 센터", screen: "report-center" },
  { id: "notifications", icon: Bell, label: "알림", screen: "notifications" },
  { id: "profile", icon: User, label: "계정 설정", screen: "profile" },
];

interface LeftEnterprisePanelProps {
  currentPage?: string;
  onNavigate?: (screen: string) => void;
}

export function LeftEnterprisePanel({ currentPage = "portal", onNavigate }: LeftEnterprisePanelProps) {
  const handleNavigate = (screen: string) => {
    if (onNavigate) {
      onNavigate(screen);
    }
  };

  return (
    <div className="w-80 shrink-0 rounded-2xl bg-white shadow-[0_4px_20px_rgba(15,23,42,0.08)] overflow-hidden flex flex-col">
      {/* Logo / Title */}
      <div className="px-5 py-4 border-b border-gray-200 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#5B3BFA] to-[#00B4FF]" />
        <div>
          <p className="text-sm font-semibold text-[#0F172A]">AIFIX Enterprise</p>
          <p className="text-xs text-[#8C8C8C]">대시보드 · 관계사 관리</p>
        </div>
      </div>

      {/* Sidebar Menu */}
      <nav className="px-3 py-3 space-y-1 flex-1 overflow-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.screen || (currentPage === "portal" && item.screen === "portal");
          return (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.screen)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all ${
                isActive
                  ? "bg-gradient-to-r from-[#5B3BFA] to-[#00B4FF] text-white shadow-[0_4px_16px_rgba(91,59,250,0.3)]"
                  : "text-[#8C8C8C] hover:bg-[#F6F8FB] hover:text-[#0F172A]"
              }`}
              type="button"
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

    </div>
  );
}


