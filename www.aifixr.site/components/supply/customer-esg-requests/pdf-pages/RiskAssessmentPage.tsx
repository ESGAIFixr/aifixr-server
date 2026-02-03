import { Check } from "lucide-react";

export function RiskAssessmentPage() {
  const assessments = [
    { text: "중대한 관리 공백 없음", checked: true },
    { text: "최소 관리 요건 충족", checked: true },
    { text: "일부 항목은 단계적 개선 대상", checked: true }
  ];

  return (
    <div className="py-8 px-8">
      <h2 className="text-2xl text-gray-900 mb-6">3. 공급망 리스크 관점 종합 판단</h2>

      <div className="space-y-4 mb-8">
        {assessments.map((assessment, index) => (
          <div key={index} className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="mt-0.5 flex-shrink-0">
              <div className="w-5 h-5 bg-green-600 rounded flex items-center justify-center">
                <Check className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
            <p className="text-gray-900">{assessment.text}</p>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-8">
        <h3 className="text-blue-900 mb-3">해석 및 의미</h3>
        <p className="text-blue-800 leading-relaxed mb-4">
          본 결과는 원청사이 공급망 ESG 리스크를 식별·관리하고 있음을
          합리적으로 설명할 수 있는 수준임을 의미합니다.
        </p>
        <p className="text-sm text-blue-700">
          협력사가 관리 체계의 기본 요소(정책, 담당자, 프로세스)를 갖추고 있으며,
          중대한 리스크 신호가 감지되지 않았습니다.
        </p>
      </div>

      <div className="mt-8 p-5 bg-gray-50 border border-gray-200 rounded-lg">
        <h4 className="text-gray-900 mb-3">리스크 관리 관점의 확인 사항</h4>
        <ul className="space-y-2">
          <li className="flex items-start gap-2 text-gray-700">
            <span className="text-blue-600 mt-1">•</span>
            <span>협력사가 ESG 관련 법규 및 최소 요건을 인지하고 있음</span>
          </li>
          <li className="flex items-start gap-2 text-gray-700">
            <span className="text-blue-600 mt-1">•</span>
            <span>각 영역별 담당자가 지정되어 있어 책임 소재가 명확함</span>
          </li>
          <li className="flex items-start gap-2 text-gray-700">
            <span className="text-blue-600 mt-1">•</span>
            <span>기본적인 운영 프로세스가 존재하여 방치 상태가 아님</span>
          </li>
          <li className="flex items-start gap-2 text-gray-700">
            <span className="text-blue-600 mt-1">•</span>
            <span>일부 개선 여지가 있는 항목은 향후 지속적 관리 대상으로 식별됨</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

