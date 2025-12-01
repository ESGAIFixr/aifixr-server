import { X, Lock } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

export default function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 p-8 rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E91E8C] to-[#8B5CF6] flex items-center justify-center">
            <Lock className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Title */}
        <h3 className="mb-3 text-center text-[#1a2332]">
          로그인이 필요합니다
        </h3>

        {/* Description */}
        <p className="mb-8 text-center text-gray-600" style={{ fontSize: '16px' }}>
          해당 서비스는 로그인 후 이용 가능합니다.
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            닫기
          </button>
          <button
            onClick={onLogin}
            className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-[#E91E8C] to-[#8B5CF6] text-white hover:shadow-lg hover:scale-105 transition-all"
          >
            로그인하기
          </button>
        </div>
      </div>
    </div>
  );
}
