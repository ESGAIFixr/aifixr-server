"use client";

import EnterprisePortal from "./components/enterprise-portal";

export default function Home() {
  return (
    <div>
      {/* Header */}
      <header className="bg-gradient-to-r from-[#0B2562] to-[#5B3BFA] text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-white">AIFIXR</h2>
              <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">
                대기업 포털
              </span>
            </div>
          </div>
        </div>
      </header>

      <EnterprisePortal />
    </div>
  );
}
