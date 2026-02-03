import { Badge } from "@/components/ui/badge";

export function CoverPage() {
  return (
    <div className="py-12 px-8">
      {/* Header section */}
      <div className="flex items-start justify-between mb-16">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 px-4 py-2 rounded-md">
          <span className="text-white tracking-wider">AIFIXR</span>
        </div>
        <Badge variant="outline" className="border-blue-600 text-blue-600">
          Supply Chain ESG Response Confirmation
        </Badge>
      </div>

      {/* Main title */}
      <div className="text-center space-y-6 my-20">
        <h1 className="text-4xl text-gray-900 tracking-tight">
          ESG 공급망 대응 확인서
        </h1>
        <p className="text-xl text-gray-600">
          Reasonable Effort-based Supply Chain Management
        </p>
      </div>

      {/* Info card */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-3 max-w-2xl mx-auto mt-20">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">협력사</p>
            <p className="text-gray-900">A전자 주식회사</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">제출 대상</p>
            <p className="text-gray-900">B사</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">작성 기준</p>
            <p className="text-gray-900">AIFIXR Level 1</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">작성 일자</p>
            <p className="text-gray-900">2024.12.28</p>
          </div>
        </div>
      </div>

      {/* Footer note */}
      <div className="mt-12 text-center">
        <p className="text-sm text-gray-500">
          본 문서는 공시·등급·평가 자료가 아닙니다.
        </p>
      </div>
    </div>
  );
}

