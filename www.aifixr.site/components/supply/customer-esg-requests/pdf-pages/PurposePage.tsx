export function PurposePage() {
  const keywords = [
    { label: "Risk-based", description: "리스크 기반 접근" },
    { label: "Reasonable Effort", description: "합리적 노력" },
    { label: "SME-appropriate", description: "중소기업 적합" },
    { label: "Non-evaluative", description: "비평가적" }
  ];

  return (
    <div className="py-8 px-8">
      <h2 className="text-2xl text-gray-900 mb-6">1. 문서 목적 및 범위</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Explanation */}
        <div className="space-y-4">
          <div>
            <h3 className="text-gray-900 mb-2">공급망 ESG 관리 대응 목적</h3>
            <p className="text-gray-600 leading-relaxed">
              본 확인서는 대기업이 공급망 ESG 리스크를 관리하고 있음을 증빙하기 위해,
              협력사의 기본적인 관리 체계 현황을 확인한 문서입니다.
            </p>
          </div>
          
          <div>
            <h3 className="text-gray-900 mb-2">과도한 정보 요구를 지양한 이유</h3>
            <p className="text-gray-600 leading-relaxed">
              중소기업의 실질적 대응 가능성을 고려하여, 
              정책·책임자·절차 유무 중심의 행동 기반 확인 방식을 채택했습니다.
            </p>
          </div>
          
          <div>
            <h3 className="text-gray-900 mb-2">리스크 기반 접근</h3>
            <p className="text-gray-600 leading-relaxed">
              중대한 관리 공백이 없는지 식별하는 것이 목적이며,
              우수 사례 평가나 점수화를 목표로 하지 않습니다.
            </p>
          </div>
        </div>

        {/* Right: Keyword cards */}
        <div className="space-y-3">
          {keywords.map((keyword, index) => (
            <div 
              key={index}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4"
            >
              <p className="text-blue-900 mb-1">{keyword.label}</p>
              <p className="text-sm text-blue-700">{keyword.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-50 border-l-4 border-gray-400 rounded">
        <p className="text-sm text-gray-700">
          <strong>중요:</strong> 본 문서는 협력사의 성과를 평가하거나 등급을 부여하는 자료가 아닙니다.
          대기업이 공급망 관리 책임을 이행하고 있음을 설명하기 위한 증빙 문서입니다.
        </p>
      </div>
    </div>
  );
}

