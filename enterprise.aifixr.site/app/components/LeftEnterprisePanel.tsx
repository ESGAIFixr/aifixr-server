'use client';

import { useState } from "react";
import { LayoutDashboard, Building2, Bell, User, ChevronLeft, ChevronRight, FolderOpen } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const menuItems = [
  { id: "portal", icon: LayoutDashboard, label: "대시보드", screen: "portal" },
  { id: "dashboard", icon: FolderOpen, label: "관계사 문서관리", screen: "dashboard" },
  { id: "sme-list", icon: Building2, label: "협력사 요청", screen: "sme-list" },
  { id: "notifications", icon: Bell, label: "알림", screen: "notifications" },
  { id: "profile", icon: User, label: "계정 설정", screen: "profile" },
];

interface LeftEnterprisePanelProps {
  currentPage?: string;
  onNavigate?: (screen: any, companyId?: string, reportId?: string) => void;
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export function LeftEnterprisePanel({ currentPage = "portal", onNavigate, isCollapsed = false, onToggle }: LeftEnterprisePanelProps) {
  const handleNavigate = (screen: string) => {
    if (onNavigate) {
      onNavigate(screen);
    }
  };

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-80'} h-full rounded-2xl bg-white shadow-[0_4px_20px_rgba(15,23,42,0.08)] overflow-hidden flex flex-col transition-all duration-300`}>
      {/* Logo / Title */}
      <div className={`px-5 py-4 border-b border-gray-200 flex items-center ${isCollapsed ? 'justify-center px-3' : 'justify-between gap-3'}`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#5B3BFA] to-[#00B4FF]" />
          {!isCollapsed && (
            <div>
              <p className="text-sm font-semibold text-[#0F172A]">AIFIX Enterprise</p>
              <p className="text-xs text-[#8C8C8C]">대시보드 · 관계사 관리</p>
            </div>
          )}
        </div>
        {onToggle && (
          <button
            onClick={onToggle}
            className={`rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all ${isCollapsed ? 'w-9 h-9' : 'w-6 h-6'}`}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            )}
          </button>
        )}
      </div>

      {/* Sidebar Menu */}
      <nav className={`px-3 py-3 space-y-1 flex-1 overflow-auto ${isCollapsed ? 'px-2' : ''}`}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.screen || (currentPage === "portal" && item.screen === "portal");
          if (isCollapsed) {
            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleNavigate(item.screen)}
                    className={`w-full flex items-center justify-center px-3 py-2 rounded-xl text-sm transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-[#5B3BFA] to-[#00B4FF] text-white shadow-[0_4px_16px_rgba(91,59,250,0.3)]"
                        : "text-[#8C8C8C] hover:bg-[#F6F8FB] hover:text-[#0F172A]"
                    }`}
                    type="button"
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-gray-900 text-white">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          }

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
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

    </div>
  );
}


