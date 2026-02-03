import { Check, Circle } from "lucide-react";

export function ManagementStatusPage() {
  const managementAreas = [
    {
      title: "안전·보건",
      items: [
        { label: "정책", status: "complete", text: "있음" },
        { label: "담당자", status: "complete", text: "지정됨 (겸직)" },
        { label: "운영 프로세스", status: "partial", text: "일부 운영" }
      ],
      description: "기본적인 관리 체계가 확인되었으며, 일부 항목은 향후 고도화 가능한 상태임."
    },
    {
      title: "환경",
      items: [
        { label: "정책", status: "partial", text: "일부 정책 보유" },
        { label: "담당자", status: "complete", text: "지정됨" },
        { label: "운영 프로세스", status: "partial", text: "기본 관리 중" }
      ],
      description: "기본적인 환경 관리 활동이 수행되고 있으며, 체계화 여지가 있음."
    },
    {
      title: "노동·인권",
      items: [
        { label: "정책", status: "partial", text: "내부 기준 일부 존재" },
        { label: "담당자", status: "complete", text: "인사팀 겸직" },
        { label: "운영 프로세스", status: "complete", text: "기본 준수 중" }
      ],
      description: "법적 기본 요건은 준수하고 있으며, 명문화 수준은 개선 가능."
    },
    {
      title: "윤리·준법 (G)",
      items: [
        { label: "정책", status: "partial", text: "최소 기준 보유" },
        { label: "담당자", status: "complete", text: "경영진 겸직" },
        { label: "운영 프로세스", status: "partial", text: "기본 통제 있음" }
      ],
      description: "최소한의 관리 기준이 존재하며, 내부 통제 체계 수준은 향후 보완 가능."
    }
  ];

  const getStatusIcon = (status: string) => {
    if (status === "complete") {
      return <Check className="w-4 h-4 text-green-600" />;
    }
    return <Circle className="w-4 h-4 text-yellow-600 fill-yellow-600" />;
  };

  return (
    <div className="py-8 px-8">
      <h2 className="text-2xl text-gray-900 mb-6">2. ESG 관리 현황 요약 (Level 1 결과)</h2>

      <div className="space-y-6 mb-8">
        {managementAreas.map((area, index) => (
          <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-5">
            <h3 className="text-gray-900 mb-4">{area.title}</h3>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              {area.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-center gap-2">
                  {getStatusIcon(item.status)}
                  <div>
                    <p className="text-sm text-gray-600">{item.label}</p>
                    <p className="text-sm text-gray-900">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-sm text-gray-600 mt-3 pt-3 border-t border-gray-300">
              {area.description}
            </p>
          </div>
        ))}
      </div>

      {/* Summary table */}
      <div className="mt-8">
        <h3 className="text-gray-900 mb-4">영역별 관리 상태 요약</h3>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700 border-b">ESG 영역</th>
                <th className="px-6 py-3 text-left text-gray-700 border-b">관리 상태</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-6 py-3 text-gray-900">안전·보건</td>
                <td className="px-6 py-3 text-gray-600">기본 체계 보유</td>
              </tr>
              <tr className="border-b">
                <td className="px-6 py-3 text-gray-900">환경</td>
                <td className="px-6 py-3 text-gray-600">일부 관리 활동 수행</td>
              </tr>
              <tr className="border-b">
                <td className="px-6 py-3 text-gray-900">노동·인권</td>
                <td className="px-6 py-3 text-gray-600">내부 기준 일부 존재</td>
              </tr>
              <tr>
                <td className="px-6 py-3 text-gray-900">윤리·준법 (G)</td>
                <td className="px-6 py-3 text-gray-600">최소 관리 기준 보유</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

