import { useState } from "react";
import { ArrowUp, ArrowDown, Download, ChevronRight } from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

interface ImprovementTask {
  id: string;
  title: string;
  category: "E" | "S" | "G";
  status: "needs-improvement" | "in-progress" | "completed";
  level1Status: string;
  currentStatus: string;
}

const radarData = [
  { subject: "환경 (E)", level1: 45, level2: 72, fullMark: 100 },
  { subject: "사회 (S)", level1: 38, level2: 65, fullMark: 100 },
  { subject: "지배구조 (G)", level1: 52, level2: 78, fullMark: 100 },
];

const improvementTasks: ImprovementTask[] = [
  {
    id: "1",
    title: "정기 안전보건 점검 프로세스 구축",
    category: "S",
    status: "in-progress",
    level1Status: "일부 운영",
    currentStatus: "정기 운영 준비 중",
  },
  {
    id: "2",
    title: "에너지 사용량 측정 시스템 도입",
    category: "E",
    status: "needs-improvement",
    level1Status: "없음",
    currentStatus: "계획 수립 중",
  },
  {
    id: "3",
    title: "윤리경영 정책 문서화",
    category: "G",
    status: "completed",
    level1Status: "일부 있음",
    currentStatus: "완료 (전 직원 배포)",
  },
  {
    id: "4",
    title: "폐기물 재활용 관리 절차 개선",
    category: "E",
    status: "in-progress",
    level1Status: "일부 있음",
    currentStatus: "업체 계약 진행 중",
  },
  {
    id: "5",
    title: "내부 신고 채널 구축",
    category: "S",
    status: "needs-improvement",
    level1Status: "없음",
    currentStatus: "미착수",
  },
];

const kpiData = [
  { name: "환경", 개선율: 60 },
  { name: "사회", 개선율: 71 },
  { name: "지배구조", 개선율: 50 },
];

interface Level2DashboardProps {
  companyName?: string;
}

export default function Level2Dashboard({ companyName = "A전자" }: Level2DashboardProps) {
  const [selectedTask, setSelectedTask] = useState<ImprovementTask | null>(null);
  const [taskStatus, setTaskStatus] = useState<Record<string, string>>({});

  const getStatusColor = (status: string) => {
    switch (status) {
      case "needs-improvement":
        return "#E30074"; // Courage
      case "in-progress":
        return "#00A3B5"; // Together
      case "completed":
        return "#4CAF50"; // Integrity
      default:
        return "#gray";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "needs-improvement":
        return "개선 필요";
      case "in-progress":
        return "진행 중";
      case "completed":
        return "완료";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB] pb-12">
      <div className="max-w-[1440px] mx-auto px-8 py-8">
        {/* Section 1: 관리 수준 변화 시각화 */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <h2 className="mb-6">{companyName} ESG 관리 수준 변화 (Level 1 대비)</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Radar Chart */}
            <div>
              <h4 className="mb-4 text-center">영역별 관리 수준 비교</h4>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e0e0e0" />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar
                    name="Level 1"
                    dataKey="level1"
                    stroke="#9CA3AF"
                    fill="#9CA3AF"
                    fillOpacity={0.3}
                  />
                  <Radar
                    name="Level 2 (현재)"
                    dataKey="level2"
                    stroke="#5B3BFA"
                    fill="#5B3BFA"
                    fillOpacity={0.5}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart */}
            <div>
              <h4 className="mb-4 text-center">개선율 현황</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={kpiData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="개선율" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#5B3BFA" />
                      <stop offset="100%" stopColor="#00B4FF" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">평균 개선율</p>
                  <h3 className="text-green-700">+60.3%</h3>
                </div>
                <ArrowUp className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">진행 중 과제</p>
                  <h3 className="text-blue-700">
                    {improvementTasks.filter((t) => t.status === "in-progress").length}개
                  </h3>
                </div>
                <div className="w-8 h-8 bg-[#00A3B5] rounded-full" />
              </div>
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">완료 과제</p>
                  <h3 className="text-purple-700">
                    {improvementTasks.filter((t) => t.status === "completed").length}개
                  </h3>
                </div>
                <div className="w-8 h-8 bg-[#6B23C0] rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: 개선 우선순위 위젯 */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="mb-6">개선 우선순위 과제 (Level 1 '없음'/'일부 있음' 항목)</h2>

          <div className="space-y-4">
            {improvementTasks.map((task) => (
              <div
                key={task.id}
                className="border-2 border-gray-200 rounded-xl p-6 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className="px-3 py-1 rounded-full text-sm text-white"
                        style={{ backgroundColor: getStatusColor(task.status) }}
                      >
                        {getStatusText(task.status)}
                      </span>
                      <span className="text-sm text-gray-500">
                        [{task.category}] 영역
                      </span>
                    </div>
                    <h4 className="mb-2">{task.title}</h4>
                    <div className="flex items-center gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Level 1: </span>
                        <span className="text-gray-700">{task.level1Status}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                      <div>
                        <span className="text-gray-500">현재: </span>
                        <span className="text-gray-700">{task.currentStatus}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedTask(task)}
                    className="px-4 py-2 rounded-lg text-white transition-colors"
                    style={{ backgroundColor: "#00B4FF" }}
                  >
                    상세 관리
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h2 className="mb-2">{selectedTask.title}</h2>
                  <p className="text-gray-500">과제 상세 관리</p>
                </div>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Current Status */}
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">현재 상태</p>
                <p className="flex items-center gap-2">
                  <span className="text-xl">⚠️</span>
                  <span>{selectedTask.currentStatus}</span>
                </p>
              </div>

              {/* Improvement Tools */}
              <div className="mb-6">
                <h4 className="mb-4">개선 도구</h4>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-4 border-2 border-[#00B4FF] rounded-lg hover:bg-blue-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Download className="w-5 h-5 text-[#00B4FF]" />
                      <span>{selectedTask.title} 템플릿 다운로드</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>

                  <div className="p-4 border-2 border-gray-200 rounded-lg">
                    <label className="block text-sm text-gray-600 mb-2">
                      상태 업데이트
                    </label>
                    <select
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      value={taskStatus[selectedTask.id] || selectedTask.currentStatus}
                      onChange={(e) =>
                        setTaskStatus((prev) => ({
                          ...prev,
                          [selectedTask.id]: e.target.value,
                        }))
                      }
                    >
                      <option value="계획 수립 중">계획 수립 중</option>
                      <option value="일부 운영">일부 운영</option>
                      <option value="정기 운영">정기 운영</option>
                      <option value="완료">완료</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Improvement Timeline */}
              <div>
                <h4 className="mb-4">개선 이력 로그</h4>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-[#5B3BFA]" />
                      <div className="w-0.5 h-full bg-gray-200" />
                    </div>
                    <div className="flex-1 pb-6">
                      <p className="text-sm text-gray-500">2024.12.15</p>
                      <p>Level 2 개선 과제로 등록</p>
                      <p className="text-sm text-gray-600">
                        Level 1 응답: {selectedTask.level1Status}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-[#00A3B5]" />
                      <div className="w-0.5 h-full bg-gray-200" />
                    </div>
                    <div className="flex-1 pb-6">
                      <p className="text-sm text-gray-500">2024.12.18</p>
                      <p>개선 계획 수립 완료</p>
                      <p className="text-sm text-gray-600">담당자: 김철수</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-gray-300" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">예정</p>
                      <p className="text-gray-400">정기 운영 전환 목표</p>
                      <p className="text-sm text-gray-400">목표일: 2025.01.31</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
