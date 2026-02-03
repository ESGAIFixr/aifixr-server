'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, ChevronRight, Clock, CheckCircle, AlertCircle } from 'lucide-react'
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
import { Checkbox } from '@/components/ui/checkbox'

interface ESGRequest {
  id: string
  requestDate: string
  companyName: string
  level: 'Level 1' | 'Level 2' | 'Level 3'
  requestType: 'progress' | 'submission' | 'document' | 'data'
  requestTitle: string
  status: 'pending' | 'in-progress' | 'completed'
  description?: string
}

interface CustomerESGRequestsProps {
  onTabChange?: (tab: 'level1' | 'level2' | 'level3' | 'customerRequests') => void
}

export default function CustomerESGRequests({ onTabChange }: CustomerESGRequestsProps) {
  const router = useRouter()
  const [levelFilter, setLevelFilter] = useState<'전체' | 'Level 1' | 'Level 2' | 'Level 3'>('전체')
  const [statusFilter, setStatusFilter] = useState<'전체' | '요청 대기' | '진행 중' | '완료'>('전체')
  const [selectedRequest, setSelectedRequest] = useState<ESGRequest | null>(null)
  const [showDocumentSelect, setShowDocumentSelect] = useState(false)
  const [showDataSelect, setShowDataSelect] = useState(false)
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([])
  const [selectedData, setSelectedData] = useState<string[]>([])

  // 예시 데이터
  const requests: ESGRequest[] = [
    {
      id: '1',
      requestDate: '2024.12.28',
      companyName: 'B사',
      level: 'Level 1',
      requestType: 'progress',
      requestTitle: 'Level 1 ESG 공급망 대응 진행 요청',
      status: 'pending',
    },
    {
      id: '2',
      requestDate: '2024.12.25',
      companyName: 'B사',
      level: 'Level 1',
      requestType: 'submission',
      requestTitle: 'Level 1 ESG 대응 확인서 제출 요청',
      status: 'in-progress',
    },
    {
      id: '3',
      requestDate: '2024.12.20',
      companyName: 'B사',
      level: 'Level 2',
      requestType: 'document',
      requestTitle: 'Level 2 – 내부 관리 문서 추가 작성 요청',
      status: 'pending',
    },
    {
      id: '4',
      requestDate: '2024.12.15',
      companyName: 'B사',
      level: 'Level 3',
      requestType: 'data',
      requestTitle: 'Level 3 – 지속가능경영보고서 및 ESG 등급 공유 요청',
      status: 'in-progress',
    },
  ]

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Level 1':
        return '#5B3BFA'
      case 'Level 2':
        return '#00B4FF'
      case 'Level 3':
        return '#E30074'
      default:
        return '#8C8C8C'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="secondary" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            요청 대기
          </Badge>
        )
      case 'in-progress':
        return (
          <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
            진행 중
          </Badge>
        )
      case 'completed':
        return (
          <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
            완료
          </Badge>
        )
      default:
        return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '요청 대기'
      case 'in-progress':
        return '진행 중'
      case 'completed':
        return '완료'
      default:
        return ''
    }
  }

  const filteredRequests = requests.filter((req) => {
    const levelMatch = levelFilter === '전체' || req.level === levelFilter
    const statusMatch = statusFilter === '전체' || getStatusText(req.status) === statusFilter
    return levelMatch && statusMatch
  })

  const handleLevel1Progress = () => {
    // Level 1 체크리스트 화면으로 이동
    if (onTabChange) {
      // 같은 페이지 내에서 탭 변경
      onTabChange('level1')
    } else {
      // 다른 페이지에서 접근한 경우
      sessionStorage.setItem('activeTab', 'level1')
      router.push('/dashboard')
    }
  }

  const handleDocumentSelect = (request: ESGRequest) => {
    setSelectedRequest(request)
    setShowDocumentSelect(true)
  }

  const handleDataSelect = (request: ESGRequest) => {
    setSelectedRequest(request)
    setShowDataSelect(true)
  }

  const handleDocumentSubmit = () => {
    // 전송 로직
    setShowDocumentSelect(false)
    setSelectedRequest(null)
    setSelectedDocuments([])
  }

  const handleDataSubmit = () => {
    // 전송 로직
    setShowDataSelect(false)
    setSelectedRequest(null)
    setSelectedData([])
  }

  // 예시 확인서 데이터
  const issuanceRecords = [
    { id: '1', date: '2024.12.28', level: 'Level 1', method: 'Action-based Checklist' },
    { id: '2', date: '2024.11.15', level: 'Level 1', method: 'Action-based Checklist' },
    { id: '3', date: '2024.10.03', level: 'Level 1', method: 'Action-based Checklist' },
  ]

  return (
    <div className="min-h-screen bg-[#F6F8FB]">
      <div className="max-w-[1440px] mx-auto px-8 py-8">
        {/* 상단 헤더 */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[#1a2332] mb-2">Customer ESG Requests</h1>
              <p className="text-gray-600">
                원청사 고객사로부터 접수된 ESG 요청을 확인하고 대응하세요.
              </p>
            </div>
          </div>

          {/* 필터 */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 mr-2">Level:</span>
              {['전체', 'Level 1', 'Level 2', 'Level 3'].map((level) => (
                <button
                  key={level}
                  onClick={() => setLevelFilter(level as any)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    levelFilter === level
                      ? 'bg-[#5B3BFA] text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 mr-2">상태:</span>
              {['전체', '요청 대기', '진행 중', '완료'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status as any)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    statusFilter === status
                      ? 'bg-[#5B3BFA] text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 요청 리스트 */}
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <div
              key={request.id}
              className="bg-white rounded-[20px] shadow-sm p-6 hover:shadow-md transition-shadow"
              style={{
                boxShadow: '0px 4px 16px rgba(0,0,0,0.05)'
              }}
            >
              <div className="flex items-start justify-between">
                {/* 좌측 정보 */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge
                      style={{
                        backgroundColor: getLevelColor(request.level),
                        color: 'white',
                        border: 'none'
                      }}
                    >
                      {request.level}
                    </Badge>
                    {getStatusBadge(request.status)}
                  </div>
                  <h3 className="text-lg font-semibold text-[#1a2332] mb-2">
                    {request.requestTitle}
                  </h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>요청일: {request.requestDate}</p>
                    <p>요청 원청사명: {request.companyName}</p>
                  </div>
                </div>

                {/* 우측 액션 버튼 */}
                <div className="flex items-center gap-3 ml-6">
                  {request.requestType === 'progress' && request.level === 'Level 1' && (
                    <Button
                      onClick={handleLevel1Progress}
                      className="bg-gradient-to-r from-[#5B3BFA] to-[#00B4FF] text-white hover:shadow-lg rounded-xl"
                    >
                      Level 1 진행하기
                    </Button>
                  )}

                  {request.requestType === 'submission' && request.level === 'Level 1' && (
                    <>
                      <Button
                        onClick={() => handleDocumentSelect(request)}
                        className="bg-gradient-to-r from-[#5B3BFA] to-[#00B4FF] text-white hover:shadow-lg rounded-xl"
                      >
                        ESG 대응확인서 선택하기
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          // 지난 내역 보기 로직
                        }}
                        className="rounded-xl"
                      >
                        지난 내역 보기
                      </Button>
                    </>
                  )}

                  {request.requestType === 'document' && request.level === 'Level 2' && (
                    <Button
                      onClick={() => {
                        // Level 2 화면으로 이동
                        router.push('/dashboard')
                      }}
                      className="bg-gradient-to-r from-[#5B3BFA] to-[#00B4FF] text-white hover:shadow-lg rounded-xl"
                    >
                      Level 2 작성하기
                    </Button>
                  )}

                  {request.requestType === 'data' && request.level === 'Level 3' && (
                    <>
                      <Button
                        onClick={() => handleDataSelect(request)}
                        className="bg-gradient-to-r from-[#5B3BFA] to-[#00B4FF] text-white hover:shadow-lg rounded-xl"
                      >
                        보고서 선택하기
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          // 지난 수정 내역 보기 로직
                        }}
                        className="rounded-xl"
                      >
                        지난 수정 내역 보기
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Level 1 확인서 선택 모달 */}
      <Dialog open={showDocumentSelect} onOpenChange={setShowDocumentSelect}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-[#1a2332]">
              제출할 ESG 대응 확인서 선택
            </DialogTitle>
            <DialogDescription className="text-gray-600 pt-2">
              전송할 확인서를 선택해 주세요.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4 max-h-[400px] overflow-y-auto">
            {issuanceRecords.map((record) => (
              <div
                key={record.id}
                onClick={() => {
                  if (selectedDocuments.includes(record.id)) {
                    setSelectedDocuments(selectedDocuments.filter((id) => id !== record.id))
                  } else {
                    setSelectedDocuments([...selectedDocuments, record.id])
                  }
                }}
                className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  selectedDocuments.includes(record.id)
                    ? 'border-[#5B3BFA] bg-[#5B3BFA] bg-opacity-5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        selectedDocuments.includes(record.id)
                          ? 'border-[#5B3BFA] bg-[#5B3BFA]'
                          : 'border-gray-300'
                      }`}
                    >
                      {selectedDocuments.includes(record.id) && (
                        <CheckCircle className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-[#1a2332]">{record.date}</p>
                      <div className="text-sm text-gray-600 space-y-1 mt-1">
                        <p>적용 기준: AIFIX {record.level}</p>
                        <p>생성 방식: {record.method}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#E9F5FF] border border-blue-200 rounded-xl p-4 mb-4">
            <p className="text-blue-900 text-sm">
              자동 전송되지 않으며, 선택한 문서만 전송됩니다.
            </p>
          </div>

          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowDocumentSelect(false)
                setSelectedDocuments([])
              }}
              className="rounded-xl"
            >
              취소
            </Button>
            <Button
              onClick={handleDocumentSubmit}
              disabled={selectedDocuments.length === 0}
              className="bg-gradient-to-r from-[#5B3BFA] to-[#00B4FF] text-white rounded-xl hover:shadow-lg"
            >
              원청사으로 전송하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Level 3 데이터 선택 모달 */}
      <Dialog open={showDataSelect} onOpenChange={setShowDataSelect}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-[#1a2332]">
              공유할 ESG 데이터 선택
            </DialogTitle>
            <DialogDescription className="text-gray-600 pt-2">
              공유할 데이터를 선택해 주세요.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div
              onClick={() => {
                if (selectedData.includes('report')) {
                  setSelectedData(selectedData.filter((item) => item !== 'report'))
                } else {
                  setSelectedData([...selectedData, 'report'])
                }
              }}
              className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                selectedData.includes('report')
                  ? 'border-[#5B3BFA] bg-[#5B3BFA] bg-opacity-5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={selectedData.includes('report')}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedData([...selectedData, 'report'])
                    } else {
                      setSelectedData(selectedData.filter((item) => item !== 'report'))
                    }
                  }}
                />
                <div>
                  <p className="font-semibold text-[#1a2332]">지속가능경영보고서(PDF)</p>
                </div>
              </div>
            </div>

            <div
              onClick={() => {
                if (selectedData.includes('rating')) {
                  setSelectedData(selectedData.filter((item) => item !== 'rating'))
                } else {
                  setSelectedData([...selectedData, 'rating'])
                }
              }}
              className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                selectedData.includes('rating')
                  ? 'border-[#5B3BFA] bg-[#5B3BFA] bg-opacity-5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={selectedData.includes('rating')}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedData([...selectedData, 'rating'])
                    } else {
                      setSelectedData(selectedData.filter((item) => item !== 'rating'))
                    }
                  }}
                />
                <div>
                  <p className="font-semibold text-[#1a2332]">ESG 등급 정보 (자동 첨부)</p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowDataSelect(false)
                setSelectedData([])
              }}
              className="rounded-xl"
            >
              취소
            </Button>
            <Button
              onClick={handleDataSubmit}
              disabled={selectedData.length === 0}
              className="bg-gradient-to-r from-[#5B3BFA] to-[#00B4FF] text-white rounded-xl hover:shadow-lg"
            >
              선택 항목 전송하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
