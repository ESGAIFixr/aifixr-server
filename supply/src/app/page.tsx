"use client";

import { useState } from "react";
import Level1Survey from "./components/level1-survey";
import Level2Dashboard from "./components/level2-dashboard";
import Level3Reporting from "./components/level3-reporting";

type TabType = "level1" | "level2" | "level3";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("level1");

  // SME tabs navigation
  const tabs = [
    { id: "level1" as TabType, name: "Level 1", subtitle: "공급망 제출", color: "#5B3BFA" },
    { id: "level2" as TabType, name: "Level 2", subtitle: "내부 관리", color: "#00A3B5" },
    { id: "level3" as TabType, name: "Level 3", subtitle: "지속가능경영", color: "#6B23C0" },
  ];

  return (
    <div>
      {/* Header with Tabs */}
      <header className="bg-white border-b-2 border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <h2>AIFIXR</h2>
              <span className="px-3 py-1 bg-[#F6F8FB] rounded-full text-sm text-gray-600">
                하청사 모드
              </span>
            </div>
          </div>

          {/* Tabs */}
          <nav className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 rounded-xl transition-all ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-[#5B3BFA] to-[#00B4FF] text-white shadow-lg"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                <div className="text-center">
                  <p className={activeTab === tab.id ? "text-white" : "text-gray-900"}>
                    {tab.name}
                  </p>
                  <p
                    className={`text-sm ${
                      activeTab === tab.id ? "text-white text-opacity-90" : "text-gray-600"
                    }`}
                  >
                    {tab.subtitle}
                  </p>
                </div>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Content */}
      <main>
        {activeTab === "level1" && <Level1Survey />}
        {activeTab === "level2" && <Level2Dashboard />}
        {activeTab === "level3" && <Level3Reporting />}
      </main>
    </div>
  );
}

