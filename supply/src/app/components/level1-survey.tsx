import { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

interface Question {
  id: string;
  category: "E" | "S" | "G";
  text: string;
  help: string;
}

const questions: Question[] = [
  // E (환경) 질문
  {
    id: "e1",
    category: "E",
    text: "에너지 사용량 및 온실가스 배출량 측정 프로세스가 있습니까?",
    help: "정기적으로 전기, 가스 등의 에너지 사용량을 기록하고 있는지 확인합니다. 매월 또는 분기별로 기록하고 있다면 '있음'을 선택하세요.",
  },
  {
    id: "e2",
    category: "E",
    text: "폐기물 분리수거 및 재활용 관리 절차가 수립되어 있습니까?",
    help: "사업장에서 발생하는 폐기물을 분리수거하고 재활용 업체와 계약이 되어 있다면 '있음', 일부만 하고 있다면 '일부 있음'을 선택하세요.",
  },
  {
    id: "e3",
    category: "E",
    text: "용수 사용량 관리 및 절감 활동을 하고 있습니까?",
    help: "물 사용량을 정기적으로 확인하고 절감 노력을 하고 있는지 확인합니다. 단순히 수도 요금만 확인한다면 '일부 있음'을 선택하세요.",
  },
  {
    id: "e4",
    category: "E",
    text: "환경 관련 법규 준수 점검을 정기적으로 실시하고 있습니까?",
    help: "대기환경보전법, 폐기물관리법 등 관련 법규를 연 1회 이상 점검하고 있다면 '있음'을 선택하세요.",
  },
  {
    id: "e5",
    category: "E",
    text: "친환경 제품 또는 서비스 개발을 추진하고 있습니까?",
    help: "친환경 소재 사용, 에너지 절감형 제품 개발 등의 활동이 있다면 '있음'을 선택하세요.",
  },
  
  // S (사회) 질문
  {
    id: "s1",
    category: "S",
    text: "산업안전보건법에 따른 안전보건관리 체계가 구축되어 있습니까?",
    help: "안전보건관리책임자 지정, 정기 안전교육 실시 등이 이루어지고 있다면 '있음'을 선택하세요.",
  },
  {
    id: "s2",
    category: "S",
    text: "정기 안전보건 점검 및 위험성 평가를 실시하고 있습니까?",
    help: "연 1회 이상 사업장 내 위험 요소를 파악하고 개선하는 활동을 하고 있다면 '있음'을 선택하세요.",
  },
  {
    id: "s3",
    category: "S",
    text: "직원 교육 훈련 계획 및 실행 기록이 있습니까?",
    help: "직무 교육, 안전 교육 등의 계획을 수립하고 교육 이수 기록을 관리하고 있다면 '있음'을 선택하세요.",
  },
  {
    id: "s4",
    category: "S",
    text: "고충처리 제도 또는 내부 신고 채널이 운영되고 있습니까?",
    help: "직원이 불만사항이나 부정행위를 신고할 수 있는 창구가 있고 실제로 운영되고 있다면 '있음'을 선택하세요.",
  },
  {
    id: "s5",
    category: "S",
    text: "인권 존중 및 차별 금지 정책이 문서화되어 있습니까?",
    help: "취업규칙이나 사내 규정에 인권, 성희롱 방지, 차별 금지 내용이 명시되어 있다면 '있음'을 선택하세요.",
  },
  {
    id: "s6",
    category: "S",
    text: "협력업체 또는 공급망에 대한 사회적 책임 평가를 하고 있습니까?",
    help: "주요 협력업체의 근로조건, 안전관리 수준을 평가하고 있다면 '있음'을 선택하세요.",
  },
  
  // G (지배구조) 질문
  {
    id: "g1",
    category: "G",
    text: "윤리경영 또는 준법경영 정책이 수립되어 있습니까?",
    help: "회사의 윤리강령이나 행동규범이 문서로 정리되어 있고 직원에게 공유되었다면 '있음'을 선택하세요.",
  },
  {
    id: "g2",
    category: "G",
    text: "이사회 또는 경영진의 정기 회의록이 작성·보관되고 있습니까?",
    help: "주요 의사결정 과정이 회의록으로 기록되고 있다면 '있음'을 선택하세요.",
  },
  {
    id: "g3",
    category: "G",
    text: "내부통제 및 리스크 관리 절차가 있습니까?",
    help: "재무, 영업, 생산 등 주요 업무에 대한 내부 점검 절차가 있다면 '있음'을 선택하세요.",
  },
  {
    id: "g4",
    category: "G",
    text: "정보보호 및 개인정보 관리 체계가 운영되고 있습니까?",
    help: "개인정보보호법에 따른 관리 조치를 하고 있다면 '있음'을 선택하세요.",
  },
  {
    id: "g5",
    category: "G",
    text: "이해관계자 소통 채널(고객, 주주, 지역사회 등)이 있습니까?",
    help: "고객 상담 채널, 지역사회 소통 프로그램 등이 운영되고 있다면 '있음'을 선택하세요.",
  },
];

interface Level1SurveyProps {
  companyName?: string;
  clientName?: string;
}

export default function Level1Survey({ companyName = "귀사", clientName = "B사" }: Level1SurveyProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [openHelp, setOpenHelp] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>("E");

  const totalQuestions = questions.length;
  const answeredQuestions = Object.keys(answers).length;
  const progress = (answeredQuestions / totalQuestions) * 100;

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const isComplete = answeredQuestions === totalQuestions;

  const categories = [
    { id: "E", name: "환경 (Environment)", color: "#00A3B5" },
    { id: "S", name: "사회 (Social)", color: "#5B3BFA" },
    { id: "G", name: "지배구조 (Governance)", color: "#6B23C0" },
  ];

  return (
    <div className="min-h-screen bg-[#F6F8FB]">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <h2 className="mb-3">AIFIXR</h2>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">진행률</span>
              <span className="text-sm" style={{ color: "#5B3BFA" }}>
                {answeredQuestions}/{totalQuestions} 문항 완료
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="h-2.5 rounded-full transition-all duration-300"
                style={{
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, #5B3BFA 0%, #00B4FF 100%)",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <h1 className="mb-2">원청사 [{clientName}] 제출용 ESG 공급망 대응 체크리스트 (Level 1)</h1>
          <p className="text-gray-600">
            아래 질문은 {companyName}의 '관리 행동'에 대한 최소한의 스냅샷입니다. 전문 지식 없이 현황에 가장 가까운 것을 선택해 주세요.{" "}
            <span className="text-gray-500">(예상 소요 시간: 10분)</span>
          </p>
        </div>

        {/* Questions by Category */}
        {categories.map((category) => {
          const categoryQuestions = questions.filter((q) => q.category === category.id);
          const isExpanded = expandedCategory === category.id;

          return (
            <div key={category.id} className="mb-4">
              <button
                onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                className="w-full bg-white rounded-xl shadow-sm p-6 flex items-center justify-between hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-1 h-12 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <div className="text-left">
                    <h3>{category.name}</h3>
                    <p className="text-sm text-gray-500">
                      {categoryQuestions.filter((q) => answers[q.id]).length}/{categoryQuestions.length} 완료
                    </p>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {isExpanded && (
                <div className="mt-4 space-y-4">
                  {categoryQuestions.map((question, index) => (
                    <div key={question.id} className="bg-white rounded-xl shadow-sm p-6">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-2">
                            <span className="text-sm text-gray-500 mt-1">{index + 1}.</span>
                            <p className="flex-1">{question.text}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setOpenHelp(openHelp === question.id ? null : question.id)}
                          className="flex-shrink-0 p-2 rounded-full hover:bg-gray-100 transition-colors"
                          style={{ color: "#00B4FF" }}
                        >
                          <HelpCircle className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Help Text */}
                      {openHelp === question.id && (
                        <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-sm text-gray-700">{question.help}</p>
                        </div>
                      )}

                      {/* Radio Options */}
                      <div className="flex gap-3">
                        {["없음", "일부 있음", "있음"].map((option) => (
                          <button
                            key={option}
                            onClick={() => handleAnswer(question.id, option)}
                            className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                              answers[question.id] === option
                                ? "border-[#5B3BFA] bg-[#5B3BFA] bg-opacity-10"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <span
                              className={
                                answers[question.id] === option
                                  ? "text-[#5B3BFA]"
                                  : "text-gray-700"
                              }
                            >
                              {option}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 bg-white border-t shadow-lg">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <button
            disabled={!isComplete}
            className={`w-full py-4 rounded-xl transition-all ${
              isComplete
                ? "bg-gradient-to-r from-[#5B3BFA] to-[#00B4FF] text-white hover:shadow-lg"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            제출 및 확인서 발급
          </button>
          {!isComplete && (
            <p className="text-center text-sm text-gray-500 mt-2">
              모든 문항에 응답해 주세요 (남은 문항: {totalQuestions - answeredQuestions}개)
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
