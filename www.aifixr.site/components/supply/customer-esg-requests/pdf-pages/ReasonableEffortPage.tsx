import { ArrowRight, X } from "lucide-react";

export function ReasonableEffortPage() {
  const principles = [
    {
      title: "하청사 실행 가능 범위",
      description: "원청사 수준의 ESG 관리 체계를 요구하지 않으며, 하청사이 실질적으로 대응 가능한 수준에서 확인"
    },
    {
      title: "정책·책임·절차 중심",
      description: "복잡한 지표나 정량 데이터가 아닌, 관리 체계의 기본 요소 보유 여부를 행동 기반으로 확인"
    },
    {
      title: "리스크 신호 관리",
      description: "우수 사례를 찾기보다는, 중대한 관리 공백이나 리스크 신호가 없는지를 확인하는 것이 목적"
    }
  ];

  return (
    <div className="py-8 px-8">
      <h2 className="text-2xl text-gray-900 mb-6">4. 합리적 노력 기반 공급망 관리 설명</h2>

      <div className="mb-8">
        <h3 className="text-gray-900 mb-4">Reasonable Effort 접근법</h3>
        <p className="text-gray-600 leading-relaxed mb-6">
          본 확인서는 "합리적 노력(Reasonable Effort)" 원칙에 따라 작성되었습니다.
          이는 원청사이 공급망 ESG 관리 책임을 이행하되, 
          협력사의 규모와 역량을 고려한 현실적 접근을 의미합니다.
        </p>

        {/* Flow diagram */}
        <div className="flex items-center justify-center gap-4 py-6 mb-8">
          <div className="flex-1 bg-red-50 border-2 border-red-300 rounded-lg p-4 text-center relative">
            <div className="absolute -top-3 left-4 bg-white px-2">
              <X className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-red-900">과도한 요구</p>
            <p className="text-sm text-red-700 mt-1">원청사 수준 기준</p>
          </div>
          
          <ArrowRight className="w-6 h-6 text-gray-400 flex-shrink-0" />
          
          <div className="flex-1 bg-green-50 border-2 border-green-300 rounded-lg p-4 text-center">
            <p className="text-green-900">행동 기반 확인</p>
            <p className="text-sm text-green-700 mt-1">실행 가능 범위</p>
          </div>
          
          <ArrowRight className="w-6 h-6 text-gray-400 flex-shrink-0" />
          
          <div className="flex-1 bg-blue-50 border-2 border-blue-300 rounded-lg p-4 text-center">
            <p className="text-blue-900">리스크 관리 설명</p>
            <p className="text-sm text-blue-700 mt-1">증빙 가능</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-gray-900 mb-3">핵심 원칙</h3>
        {principles.map((principle, index) => (
          <div key={index} className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-lg p-5">
            <h4 className="text-gray-900 mb-2">{principle.title}</h4>
            <p className="text-gray-600">{principle.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 p-5 bg-yellow-50 border-l-4 border-yellow-400 rounded">
        <p className="text-gray-800">
          <strong>중요:</strong> 본 접근법은 협력사를 "평가"하는 것이 아니라,
          원청사이 공급망을 "방치하지 않고 관리하고 있다"는 사실을 증명하기 위한 것입니다.
        </p>
      </div>
    </div>
  );
}

