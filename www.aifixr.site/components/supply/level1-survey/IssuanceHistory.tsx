'use client'

import { useState } from 'react'
import { FileText, ChevronRight, Plus, Check, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import CustomerESGRequests from '../customer-esg-requests'

interface IssuanceRecord {
  id: string
  issuedDate: string
  level: string
  clientName: string
  status: string
}

export function IssuanceHistory({ onNewIssuance, onViewDocument }: { 
  onNewIssuance: () => void
  onViewDocument: (record: IssuanceRecord) => void 
}) {
  const [selectedRecord, setSelectedRecord] = useState<IssuanceRecord | null>(null)
  const [submitRecord, setSubmitRecord] = useState<IssuanceRecord | null>(null)
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false)
  const [showSubmitComplete, setShowSubmitComplete] = useState(false)
  
  // 예시 데이터 - 추후 API로 대체
  const issuanceRecords: IssuanceRecord[] = [
    {
      id: '1',
      issuedDate: '2024.12.28',
      level: 'Level 1',
      clientName: 'B사',
      status: 'Level 1 완료'
    },
    {
      id: '2',
      issuedDate: '2024.11.15',
      level: 'Level 1',
      clientName: 'B사',
      status: 'Level 1 완료'
    },
    {
      id: '3',
      issuedDate: '2024.10.03',
      level: 'Level 1',
      clientName: 'B사',
      status: 'Level 1 완료'
    }
  ]

  const handleCardClick = (record: IssuanceRecord) => {
    setSelectedRecord(record)
    onViewDocument(record)
  }

  const handleSubmitClick = (e: React.MouseEvent, record: IssuanceRecord) => {
    e.stopPropagation()
    setSubmitRecord(record)
    setShowSubmitConfirm(true)
  }

  const handleConfirmSubmit = () => {
    setShowSubmitConfirm(false)
    setShowSubmitComplete(true)
  }

  const handleCompleteClose = () => {
    setShowSubmitComplete(false)
    setSubmitRecord(null)
  }

  if (selectedRecord) {
    return (
      <div className="min-h-screen bg-[#F6F8FB]">
        {/* Breadcrumb */}
        <div className="max-w-[1440px] mx-auto px-8 pt-8">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <button onClick={() => setSelectedRecord(null)} className="hover:text-[#5B3BFA]">
              Level 1
            </button>
            <span>/</span>
            <button onClick={() => setSelectedRecord(null)} className="hover:text-[#5B3BFA]">
              확인서 발급 이력
            </button>
            <span>/</span>
            <span className="text-gray-900">{selectedRecord.issuedDate}</span>
          </div>
        </div>
        <CustomerESGRequests />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F6F8FB]">
      <div className="max-w-[1440px] mx-auto px-8 py-8">
        {/* 안내 배너 */}
        <div className="mb-8 bg-[#E9F5FF] border border-blue-200 rounded-xl p-4">
          <p className="text-blue-900 text-sm leading-relaxed">
            본 탭에서는 과거에 발급된 ESG 공급망 대응 확인서를 확인할 수 있습니다.
            <br />
            확인서는 발급 시점의 응답을 기준으로 생성되며 수정되지 않습니다.
          </p>
        </div>

        {/* 상단 액션 */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-[#1a2332]">확인서 발급 이력</h2>
          <Button
            onClick={onNewIssuance}
            className="bg-gradient-to-r from-[#5B3BFA] to-[#00B4FF] text-white hover:shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            새 확인서 발급
          </Button>
        </div>

        {/* 확인서 리스트 */}
        {issuanceRecords.length === 0 ? (
          <div className="bg-white rounded-[20px] shadow-sm p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">발급된 확인서가 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {issuanceRecords.map((record) => (
              <div
                key={record.id}
                className="bg-white rounded-[20px] shadow-sm p-6 hover:shadow-md transition-shadow flex items-center gap-6"
                style={{
                  boxShadow: '0px 4px 16px rgba(0,0,0,0.05)'
                }}
              >
                {/* 좌측 아이콘 */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-[#5B3BFA]" />
                  </div>
                </div>

                {/* 중앙 정보 */}
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={() => handleCardClick(record)}
                >
                  <div className="mb-2">
                    <p className="text-lg font-bold text-[#1a2332]">{record.issuedDate}</p>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>적용 기준: AIFIX {record.level}</p>
                    <p>제출 대상: {record.clientName}</p>
                    <p>생성 방식: Action-based Checklist</p>
                  </div>
                </div>

                {/* 우측 상태 및 버튼 */}
                <div className="flex items-center gap-4">
                  <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                    {record.status}
                  </Badge>
                  <Button
                    onClick={(e) => handleSubmitClick(e, record)}
                    className="bg-[#00B4FF] text-white hover:bg-[#00A3E6] rounded-xl px-4 py-2"
                    title="선택한 확인서를 고객사에 제출합니다."
                  >
                    대기업에 제출
                  </Button>
                  <div 
                    className="cursor-pointer"
                    onClick={() => handleCardClick(record)}
                  >
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 제출 정보 확인 모달 */}
      <Dialog open={showSubmitConfirm} onOpenChange={setShowSubmitConfirm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-[#1a2332]">
              ESG 공급망 대응 확인서 제출
            </DialogTitle>
            <DialogDescription className="text-gray-600 pt-2">
              선택한 확인서를 제출하기 전에 아래 내용을 확인해 주세요.
            </DialogDescription>
          </DialogHeader>

          {submitRecord && (
            <div className="space-y-6 py-4">
              {/* 제출 정보 요약 카드 */}
              <div className="bg-[#F6F8FB] rounded-2xl p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">제출 대상</p>
                    <p className="text-gray-900 font-medium">{submitRecord.clientName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">제출 문서</p>
                    <p className="text-gray-900 font-medium">ESG 공급망 대응 확인서</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">적용 범위</p>
                    <p className="text-gray-900 font-medium">{submitRecord.level} 공급망 대응</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">생성 기준</p>
                    <p className="text-gray-900 font-medium">Action-based Checklist</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">발급일</p>
                    <p className="text-gray-900 font-medium">{submitRecord.issuedDate}</p>
                  </div>
                </div>
              </div>

              {/* 안내 문구 */}
              <div className="bg-[#E9F5FF] border border-blue-200 rounded-xl p-4">
                <p className="text-blue-900 text-sm leading-relaxed">
                  본 확인서는 발급 시점의 응답을 기준으로 생성된 문서입니다.
                  <br />
                  제출 이후에도 문서 내용은 변경되지 않습니다.
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={() => setShowSubmitConfirm(false)}
              className="rounded-xl"
            >
              취소
            </Button>
            <Button
              onClick={handleConfirmSubmit}
              className="bg-gradient-to-r from-[#5B3BFA] to-[#00B4FF] text-white rounded-xl hover:shadow-lg"
            >
              전송하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 제출 완료 팝업 */}
      <Dialog open={showSubmitComplete} onOpenChange={setShowSubmitComplete}>
        <DialogContent className="max-w-md">
          <div className="flex flex-col items-center text-center py-6">
            {/* 체크 아이콘 */}
            <div className="w-16 h-16 bg-[#5B3BFA] bg-opacity-10 rounded-full flex items-center justify-center mb-6">
              <Check className="w-8 h-8 text-[#5B3BFA]" />
            </div>

            {/* 타이틀 */}
            <h3 className="text-xl font-bold text-[#1a2332] mb-6">
              ESG 대응 제출이 완료되었습니다.
            </h3>

            {/* 본문 */}
            <div className="space-y-3 text-left w-full mb-6">
              <div className="text-base text-gray-900">
                <p className="mb-1">- 제출 대상: {submitRecord?.clientName}</p>
                <p className="mb-1">- 제출 범위: {submitRecord?.level} 공급망 대응</p>
                <p className="mb-4">- 소요 시간: 9분</p>
                <p className="text-sm text-[#8C8C8C] font-light">
                  ※ 본 응답은 향후 내부 ESG 관리에 재사용될 수 있습니다.
                </p>
              </div>
            </div>

            {/* 확인 버튼 */}
            <Button
              onClick={handleCompleteClose}
              className="w-full bg-gradient-to-r from-[#5B3BFA] to-[#00B4FF] text-white rounded-xl hover:shadow-lg"
            >
              확인
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
