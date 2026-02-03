'use client';

import { X, Building2, Factory } from 'lucide-react';

interface UserTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSMEStart: () => void;
  onEnterpriseStart: () => void;
}

export default function UserTypeModal({ isOpen, onClose, onSMEStart, onEnterpriseStart }: UserTypeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl mx-4 p-8 rounded-3xl bg-gradient-to-br from-[#5B3BFA] to-[#00B4FF] shadow-2xl animate-in fade-in zoom-in duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-white text-4xl font-bold mb-4">AIFIXR</h1>
          <p className="text-white text-opacity-90 text-xl">
            ESG 공급망 관리 플랫폼
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* 하청사 사용자 카드 */}
          <button
            onClick={onSMEStart}
            className="bg-white rounded-2xl shadow-2xl p-8 hover:scale-105 transition-transform text-left"
          >
            <div className="mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[#5B3BFA] to-[#00B4FF] rounded-xl flex items-center justify-center mb-4">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-bold text-[#1a2332] mb-2">하청사 사용자</h2>
              <p className="text-gray-600 text-sm">
                공급망 제출부터 내부 관리, 지속가능경영 보고서까지
              </p>
            </div>
            
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <div className="w-2 h-2 rounded-full bg-[#5B3BFA]" />
                <span>Level 1: 공급망 제출 모드</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <div className="w-2 h-2 rounded-full bg-[#00A3B5]" />
                <span>Level 2: 내부 관리 모드</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <div className="w-2 h-2 rounded-full bg-[#6B23C0]" />
                <span>Level 3: 지속가능경영 모드</span>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <span className="text-[#5B3BFA] font-medium">시작하기 →</span>
            </div>
          </button>

          {/* 원청사 관리자 카드 */}
          <button
            onClick={onEnterpriseStart}
            className="bg-white rounded-2xl shadow-2xl p-8 hover:scale-105 transition-transform text-left"
          >
            <div className="mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[#0B2562] to-[#5B3BFA] rounded-xl flex items-center justify-center mb-4">
                <Factory className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-bold text-[#1a2332] mb-2">원청사 관리자</h2>
              <p className="text-gray-600 text-sm">
                공급망 전체 리스크 관리 및 규제 대응
              </p>
            </div>
            
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <div className="w-2 h-2 rounded-full bg-[#E30074]" />
                <span>공급망 리스크 히트맵</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <div className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                <span>협력사 개선 이력 추적</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <div className="w-2 h-2 rounded-full bg-[#0B2562]" />
                <span>CSRD/CSDDD 증빙 보고서</span>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <span className="text-[#0B2562] font-medium">시작하기 →</span>
            </div>
          </button>
        </div>

        {/* Footer Message */}
        <div className="text-center">
          <p className="text-white text-opacity-80 text-sm flex items-center justify-center gap-2">
            <span className="text-lg">💡</span>
            AIFIXR는 하청사과 원청사이 함께 성장하는 ESG 생태계를 만듭니다
          </p>
        </div>
      </div>
    </div>
  );
}

