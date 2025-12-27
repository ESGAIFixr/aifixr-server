'use client';

import { useState, useRef, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';

interface DataSharingModalProps {
    isOpen: boolean;
    onClose: () => void;
    companyName: string;
    onAccept: () => void;
}

interface DataItem {
    id: string;
    label: string;
    checked: boolean;
    reason: string;
    hasError: boolean;
}

interface Category {
    name: string;
    items: DataItem[];
}

export default function DataSharingModal({
    isOpen,
    onClose,
    companyName,
    onAccept,
}: DataSharingModalProps) {
    const [categories, setCategories] = useState<Category[]>([
        {
            name: 'Total',
            items: [
                { id: 'total-1', label: 'ESG 등급', checked: true, reason: '', hasError: false },
                { id: 'total-2', label: '위험도', checked: true, reason: '', hasError: false },
                { id: 'total-3', label: '데이터 완료율', checked: true, reason: '', hasError: false },
                { id: 'total-4', label: '최근업데이트', checked: true, reason: '', hasError: false },
            ],
        },
        {
            name: 'Environment',
            items: [
                { id: 'env-1', label: '탄소 배출량', checked: true, reason: '', hasError: false },
                { id: 'env-2', label: '에너지 사용량', checked: true, reason: '', hasError: false },
                { id: 'env-3', label: '폐기물 관리', checked: true, reason: '', hasError: false },
            ],
        },
        {
            name: 'Social',
            items: [
                { id: 'social-1', label: '직원 복지', checked: true, reason: '', hasError: false },
                { id: 'social-2', label: '안전 관리', checked: true, reason: '', hasError: false },
                { id: 'social-3', label: '사회공헌 활동', checked: true, reason: '', hasError: false },
            ],
        },
        {
            name: 'Governance',
            items: [
                { id: 'gov-1', label: '이사회 구성', checked: true, reason: '', hasError: false },
                { id: 'gov-2', label: '윤리 경영', checked: true, reason: '', hasError: false },
                { id: 'gov-3', label: '투명성 보고', checked: true, reason: '', hasError: false },
            ],
        },
    ]);

    const errorRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    const handleCheckboxChange = (categoryIndex: number, itemIndex: number) => {
        const newCategories = [...categories];
        const item = newCategories[categoryIndex].items[itemIndex];
        item.checked = !item.checked;

        // 체크 해제 시 이유 초기화, 체크 시 에러 초기화
        if (!item.checked) {
            item.reason = '';
            item.hasError = false;
        } else {
            item.hasError = false;
        }

        setCategories(newCategories);
    };

    const handleReasonChange = (categoryIndex: number, itemIndex: number, reason: string) => {
        const newCategories = [...categories];
        const item = newCategories[categoryIndex].items[itemIndex];
        item.reason = reason;
        if (reason.trim()) {
            item.hasError = false;
        }
        setCategories(newCategories);
    };

    const validateAndAccept = () => {
        let hasError = false;
        const newCategories = [...categories];

        // 체크 해제된 항목 중 이유가 없는 항목 찾기
        newCategories.forEach((category, categoryIndex) => {
            category.items.forEach((item, itemIndex) => {
                if (!item.checked && !item.reason.trim()) {
                    item.hasError = true;
                    hasError = true;
                }
            });
        });

        setCategories(newCategories);

        if (hasError) {
            // 첫 번째 에러 항목으로 스크롤
            const firstErrorId = newCategories
                .flatMap((cat) => cat.items)
                .find((item) => item.hasError)?.id;

            if (firstErrorId && errorRefs.current[firstErrorId]) {
                errorRefs.current[firstErrorId]?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                });
            }
            return;
        }

        // 모든 검증 통과 시 수락 처리
        onAccept();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-2xl mx-4 max-h-[90vh] p-8 rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in duration-300 overflow-y-auto">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
                >
                    <X className="w-5 h-5 text-gray-500" />
                </button>

                {/* Title */}
                <h3 className="text-2xl font-bold text-[#1a2332] mb-6 text-center">
                    {companyName} 데이터 공유 요청
                </h3>

                {/* Categories */}
                <div className="space-y-6 mb-8">
                    {categories.map((category, categoryIndex) => (
                        <div key={category.name} className="border border-gray-200 rounded-xl p-4">
                            <h4 className="text-lg font-semibold text-[#1a2332] mb-4">
                                {category.name}
                            </h4>
                            <div className="space-y-3">
                                {category.items.map((item, itemIndex) => (
                                    <div key={item.id} className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                id={item.id}
                                                checked={item.checked}
                                                onChange={() => handleCheckboxChange(categoryIndex, itemIndex)}
                                                className="w-5 h-5 text-[#0D4ABB] border-gray-300 rounded focus:ring-[#0D4ABB] focus:ring-2 cursor-pointer"
                                            />
                                            <label
                                                htmlFor={item.id}
                                                className="flex-1 text-[#1a2332] font-medium cursor-pointer"
                                            >
                                                {item.label}
                                            </label>
                                        </div>
                                        {!item.checked && (
                                            <div
                                                ref={(el) => {
                                                    errorRefs.current[item.id] = el;
                                                }}
                                                className="ml-8 space-y-1"
                                            >
                                                <textarea
                                                    value={item.reason}
                                                    onChange={(e) =>
                                                        handleReasonChange(categoryIndex, itemIndex, e.target.value)
                                                    }
                                                    placeholder="데이터 공유를 거부하는 이유를 입력해주세요"
                                                    className={`w-full px-4 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 transition-all ${item.hasError
                                                        ? 'border-red-500 focus:ring-red-500'
                                                        : 'border-gray-300 focus:ring-[#0D4ABB] focus:border-[#0D4ABB]'
                                                        }`}
                                                    rows={2}
                                                />
                                                {item.hasError && (
                                                    <div className="flex items-center gap-1 text-red-500 text-sm">
                                                        <AlertCircle className="w-4 h-4" />
                                                        <span>이유를 입력해주세요</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Buttons */}
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all font-medium"
                    >
                        취소
                    </button>
                    <button
                        onClick={validateAndAccept}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#0D4ABB] to-[#00D4FF] text-white hover:shadow-lg transition-all font-medium"
                    >
                        수락
                    </button>
                </div>
            </div>
        </div>
    );
}

