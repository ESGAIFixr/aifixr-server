import { useState } from 'react';
import { ArrowLeft, Building2, Calendar, Award, TrendingUp, FileText, AlertTriangle, MapPin, Users, Lock } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { ReadOnlyTooltip } from './ReadOnlyTooltip';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, Cell, LabelList, Customized } from 'recharts';

interface CompanyDetailProps {
  companyId: string;
  onNavigate: (screen: any, companyId?: string, reportId?: string) => void;
  onLogout: () => void;
  hideSidebar?: boolean;
}

// 각 회사별 상세 데이터
const companyDataMap: Record<string, any> = {
  '1': {
    name: '테크솔루션 주식회사',
    industry: 'IT/소프트웨어',
    region: '서울특별시',
    employees: 250,
    established: 2015,
    contact: { name: '김담당', email: 'manager@techsol.com' },
    logo: '🏢',
    overallScore: 87,
    overallGrade: 'A',
    lastEvaluationDate: '2024.11.28',
    esgScores: { environmental: { score: 85, grade: 'A' }, social: { score: 82, grade: 'B' }, governance: { score: 88, grade: 'A' } },
    yearlyData: [
      { year: '2020', score: 68 },
      { year: '2021', score: 72 },
      { year: '2022', score: 78 },
      { year: '2023', score: 83 },
      { year: '2024', score: 87 },
    ],
    esgScoreData: {
      environmental: { score: 68.9, change: 1.9, changeType: 'up', weight: 33 },
      social: { score: 65.3, change: 1.9, changeType: 'up', weight: 33 },
      governance: { score: 69.0, change: 0.1, changeType: 'down', weight: 33 },
    },
    highRisks: [
      { category: '환경', item: '탄소 배출 목표 미달성', severity: 'high' },
      { category: '사회', item: '직원 다양성 개선 필요', severity: 'medium' },
    ],
    reports: [
      { id: 'r1', category: '종합 진단', title: 'ESG 통합 평가 보고서', date: '2024.11.28', status: '최종본', keyContent: '점수 87 달성, 환경 영역 개선 필요', type: 'PDF' },
      { id: 'r2', category: '심화 분석', title: '환경 경영 성과 및 분석 (Ver 2.0)', date: '2024.11.15', status: '개선 조치 중', keyContent: '높은 위험: 탄소 배출 목표 미달성 상세 분석', type: 'PDF' },
      { id: 'r3', category: '개선 계획', title: '사회적 책임 이행 보고서', date: '2024.10.30', status: '검토 요청', keyContent: '직원 다양성 개선 계획 초안', type: 'PDF' },
      { id: 'r4', category: '점수 산출', title: '지배구조 평가 리포트', date: '2024.10.15', status: '완료', keyContent: '지배구조 69점 상세 산출 근거', type: 'PDF' },
    ],
    esgIndicators: {
      environmental: [
        { indicator: '탄소 배출량', value: '150 tCO2e', target: '120 tCO2e' },
        { indicator: '재생에너지 사용률', value: '35%', target: '50%' },
        { indicator: '폐기물 재활용률', value: '92%', target: '90%' },
      ],
      social: [
        { indicator: '여성 임원 비율', value: '30%', target: '35%' },
        { indicator: '직원 교육 시간', value: '48시간/년', target: '40시간/년' },
        { indicator: '산업재해율', value: '0.2%', target: '0.5%' },
      ],
      governance: [
        { indicator: '사외이사 비율', value: '60%', target: '50%' },
        { indicator: '이사회 참석률', value: '95%', target: '90%' },
        { indicator: '윤리경영 교육', value: '100%', target: '100%' },
      ],
    },
  },
  '2': {
    name: '그린에너지 코퍼레이션',
    industry: '에너지',
    region: '경기도',
    employees: 180,
    established: 2012,
    contact: { name: '이담당', email: 'manager@greenenergy.com' },
    logo: '⚡',
    overallScore: 78,
    overallGrade: 'B',
    lastEvaluationDate: '2024.11.25',
    esgScores: { environmental: { score: 75, grade: 'B' }, social: { score: 80, grade: 'B' }, governance: { score: 79, grade: 'B' } },
    yearlyData: [
      { year: '2020', score: 65 },
      { year: '2021', score: 68 },
      { year: '2022', score: 72 },
      { year: '2023', score: 75 },
      { year: '2024', score: 78 },
    ],
    esgScoreData: {
      environmental: { score: 75.0, change: 2.5, changeType: 'up', weight: 33 },
      social: { score: 80.0, change: 1.8, changeType: 'up', weight: 33 },
      governance: { score: 79.0, change: 0.5, changeType: 'up', weight: 33 },
    },
    highRisks: [
      { category: '환경', item: '에너지 효율 개선 필요', severity: 'medium' },
    ],
    reports: [
      { id: 'r1', category: '종합 진단', title: 'ESG 통합 평가 보고서', date: '2024.11.25', status: '최종본', keyContent: '점수 78 달성, 에너지 효율 개선 필요', type: 'PDF' },
      { id: 'r2', category: '심화 분석', title: '환경 경영 성과 및 분석', date: '2024.11.10', status: '개선 조치 중', keyContent: '중간 위험: 에너지 효율 개선 필요 상세 분석', type: 'PDF' },
    ],
    esgIndicators: {
      environmental: [
        { indicator: '탄소 배출량', value: '280 tCO2e', target: '250 tCO2e' },
        { indicator: '재생에너지 사용률', value: '45%', target: '60%' },
        { indicator: '폐기물 재활용률', value: '88%', target: '85%' },
      ],
      social: [
        { indicator: '여성 임원 비율', value: '25%', target: '30%' },
        { indicator: '직원 교육 시간', value: '42시간/년', target: '40시간/년' },
        { indicator: '산업재해율', value: '0.3%', target: '0.5%' },
      ],
      governance: [
        { indicator: '사외이사 비율', value: '55%', target: '50%' },
        { indicator: '이사회 참석률', value: '92%', target: '90%' },
        { indicator: '윤리경영 교육', value: '95%', target: '100%' },
      ],
    },
  },
  '3': {
    name: '스마트제조 산업',
    industry: '제조',
    region: '경상북도',
    employees: 320,
    established: 2008,
    contact: { name: '박담당', email: 'manager@smartmfg.com' },
    logo: '🏭',
    overallScore: 85,
    overallGrade: 'A',
    lastEvaluationDate: '2024.11.22',
    esgScores: { environmental: { score: 83, grade: 'A' }, social: { score: 84, grade: 'B' }, governance: { score: 88, grade: 'A' } },
    yearlyData: [
      { year: '2020', score: 70 },
      { year: '2021', score: 74 },
      { year: '2022', score: 78 },
      { year: '2023', score: 82 },
      { year: '2024', score: 85 },
    ],
    esgScoreData: {
      environmental: { score: 83.0, change: 2.2, changeType: 'up', weight: 33 },
      social: { score: 84.0, change: 1.5, changeType: 'up', weight: 33 },
      governance: { score: 88.0, change: 0.8, changeType: 'up', weight: 33 },
    },
    highRisks: [
      { category: '환경', item: '공정 효율 개선 필요', severity: 'low' },
    ],
    reports: [
      { id: 'r1', category: '종합 진단', title: 'ESG 통합 평가 보고서', date: '2024.11.22', status: '최종본', keyContent: '점수 85 달성, 공정 효율 개선 필요', type: 'PDF' },
      { id: 'r2', category: '심화 분석', title: '환경 경영 성과 및 분석', date: '2024.11.08', status: '완료', keyContent: '낮은 위험: 공정 효율 개선 필요 상세 분석', type: 'PDF' },
    ],
    esgIndicators: {
      environmental: [
        { indicator: '탄소 배출량', value: '320 tCO2e', target: '300 tCO2e' },
        { indicator: '재생에너지 사용률', value: '40%', target: '50%' },
        { indicator: '폐기물 재활용률', value: '90%', target: '90%' },
      ],
      social: [
        { indicator: '여성 임원 비율', value: '28%', target: '30%' },
        { indicator: '직원 교육 시간', value: '45시간/년', target: '40시간/년' },
        { indicator: '산업재해율', value: '0.25%', target: '0.5%' },
      ],
      governance: [
        { indicator: '사외이사 비율', value: '58%', target: '50%' },
        { indicator: '이사회 참석률', value: '94%', target: '90%' },
        { indicator: '윤리경영 교육', value: '98%', target: '100%' },
      ],
    },
  },
  '4': {
    name: '친환경 패키징',
    industry: '제조',
    region: '충청북도',
    employees: 150,
    established: 2016,
    contact: { name: '최담당', email: 'manager@ecopack.com' },
    logo: '📦',
    overallScore: 76,
    overallGrade: 'B',
    lastEvaluationDate: '2024.11.20',
    esgScores: { environmental: { score: 80, grade: 'B' }, social: { score: 72, grade: 'B' }, governance: { score: 76, grade: 'B' } },
    yearlyData: [
      { year: '2020', score: 65 },
      { year: '2021', score: 68 },
      { year: '2022', score: 71 },
      { year: '2023', score: 74 },
      { year: '2024', score: 76 },
    ],
    esgScoreData: {
      environmental: { score: 80.0, change: 2.0, changeType: 'up', weight: 33 },
      social: { score: 72.0, change: 1.2, changeType: 'up', weight: 33 },
      governance: { score: 76.0, change: 0.8, changeType: 'up', weight: 33 },
    },
    highRisks: [
      { category: '사회', item: '직원 복지 개선 필요', severity: 'medium' },
    ],
    reports: [
      { id: 'r1', category: '종합 진단', title: 'ESG 통합 평가 보고서', date: '2024.11.20', status: '최종본', keyContent: '점수 76 달성, 직원 복지 개선 필요', type: 'PDF' },
    ],
    esgIndicators: {
      environmental: [
        { indicator: '탄소 배출량', value: '120 tCO2e', target: '100 tCO2e' },
        { indicator: '재생에너지 사용률', value: '50%', target: '60%' },
        { indicator: '폐기물 재활용률', value: '95%', target: '95%' },
      ],
      social: [
        { indicator: '여성 임원 비율', value: '22%', target: '25%' },
        { indicator: '직원 교육 시간', value: '35시간/년', target: '40시간/년' },
        { indicator: '산업재해율', value: '0.4%', target: '0.5%' },
      ],
      governance: [
        { indicator: '사외이사 비율', value: '50%', target: '50%' },
        { indicator: '이사회 참석률', value: '90%', target: '90%' },
        { indicator: '윤리경영 교육', value: '92%', target: '100%' },
      ],
    },
  },
  '5': {
    name: '디지털 솔루션즈',
    industry: 'IT/소프트웨어',
    region: '서울특별시',
    employees: 420,
    established: 2010,
    contact: { name: '정담당', email: 'manager@digitalsol.com' },
    logo: '💻',
    overallScore: 89,
    overallGrade: 'A',
    lastEvaluationDate: '2024.11.18',
    esgScores: { environmental: { score: 88, grade: 'A' }, social: { score: 89, grade: 'A' }, governance: { score: 90, grade: 'A' } },
    yearlyData: [
      { year: '2020', score: 72 },
      { year: '2021', score: 76 },
      { year: '2022', score: 81 },
      { year: '2023', score: 85 },
      { year: '2024', score: 89 },
    ],
    esgScoreData: {
      environmental: { score: 88.0, change: 2.5, changeType: 'up', weight: 33 },
      social: { score: 89.0, change: 2.8, changeType: 'up', weight: 33 },
      governance: { score: 90.0, change: 1.5, changeType: 'up', weight: 33 },
    },
    highRisks: [],
    reports: [
      { id: 'r1', category: '종합 진단', title: 'ESG 통합 평가 보고서', date: '2024.11.18', status: '최종본', keyContent: '점수 89 달성, 우수한 ESG 성과', type: 'PDF' },
      { id: 'r2', category: '심화 분석', title: '환경 경영 성과 및 분석', date: '2024.11.05', status: '완료', keyContent: '환경 영역 우수 성과 분석', type: 'PDF' },
      { id: 'r3', category: '개선 계획', title: '사회적 책임 이행 보고서', date: '2024.10.25', status: '완료', keyContent: '사회 영역 우수 성과 보고', type: 'PDF' },
    ],
    esgIndicators: {
      environmental: [
        { indicator: '탄소 배출량', value: '90 tCO2e', target: '80 tCO2e' },
        { indicator: '재생에너지 사용률', value: '60%', target: '70%' },
        { indicator: '폐기물 재활용률', value: '95%', target: '95%' },
      ],
      social: [
        { indicator: '여성 임원 비율', value: '38%', target: '35%' },
        { indicator: '직원 교육 시간', value: '55시간/년', target: '40시간/년' },
        { indicator: '산업재해율', value: '0.1%', target: '0.5%' },
      ],
      governance: [
        { indicator: '사외이사 비율', value: '65%', target: '50%' },
        { indicator: '이사회 참석률', value: '98%', target: '90%' },
        { indicator: '윤리경영 교육', value: '100%', target: '100%' },
      ],
    },
  },
  '6': {
    name: '바이오텍 연구소',
    industry: '바이오/헬스케어',
    region: '대전광역시',
    employees: 95,
    established: 2018,
    contact: { name: '한담당', email: 'manager@biotech.com' },
    logo: '🧬',
    overallScore: 79,
    overallGrade: 'B',
    lastEvaluationDate: '2024.11.15',
    esgScores: { environmental: { score: 77, grade: 'B' }, social: { score: 80, grade: 'B' }, governance: { score: 80, grade: 'B' } },
    yearlyData: [
      { year: '2020', score: 68 },
      { year: '2021', score: 71 },
      { year: '2022', score: 74 },
      { year: '2023', score: 77 },
      { year: '2024', score: 79 },
    ],
    esgScoreData: {
      environmental: { score: 77.0, change: 1.5, changeType: 'up', weight: 33 },
      social: { score: 80.0, change: 2.0, changeType: 'up', weight: 33 },
      governance: { score: 80.0, change: 1.0, changeType: 'up', weight: 33 },
    },
    highRisks: [
      { category: '환경', item: '실험 폐기물 관리 개선', severity: 'low' },
    ],
    reports: [
      { id: 'r1', category: '종합 진단', title: 'ESG 통합 평가 보고서', date: '2024.11.15', status: '최종본', keyContent: '점수 79 달성, 실험 폐기물 관리 개선 필요', type: 'PDF' },
    ],
    esgIndicators: {
      environmental: [
        { indicator: '탄소 배출량', value: '85 tCO2e', target: '80 tCO2e' },
        { indicator: '재생에너지 사용률', value: '42%', target: '50%' },
        { indicator: '폐기물 재활용률', value: '88%', target: '90%' },
      ],
      social: [
        { indicator: '여성 임원 비율', value: '35%', target: '35%' },
        { indicator: '직원 교육 시간', value: '50시간/년', target: '40시간/년' },
        { indicator: '산업재해율', value: '0.15%', target: '0.5%' },
      ],
      governance: [
        { indicator: '사외이사 비율', value: '55%', target: '50%' },
        { indicator: '이사회 참석률', value: '93%', target: '90%' },
        { indicator: '윤리경영 교육', value: '100%', target: '100%' },
      ],
    },
  },
  '7': {
    name: '청정수자원',
    industry: '환경',
    region: '강원도',
    employees: 110,
    established: 2014,
    contact: { name: '오담당', email: 'manager@cleanwater.com' },
    logo: '💧',
    overallScore: 86,
    overallGrade: 'A',
    lastEvaluationDate: '2024.11.12',
    esgScores: { environmental: { score: 90, grade: 'A' }, social: { score: 82, grade: 'B' }, governance: { score: 86, grade: 'A' } },
    yearlyData: [
      { year: '2020', score: 71 },
      { year: '2021', score: 75 },
      { year: '2022', score: 79 },
      { year: '2023', score: 83 },
      { year: '2024', score: 86 },
    ],
    esgScoreData: {
      environmental: { score: 90.0, change: 3.0, changeType: 'up', weight: 33 },
      social: { score: 82.0, change: 1.8, changeType: 'up', weight: 33 },
      governance: { score: 86.0, change: 1.2, changeType: 'up', weight: 33 },
    },
    highRisks: [],
    reports: [
      { id: 'r1', category: '종합 진단', title: 'ESG 통합 평가 보고서', date: '2024.11.12', status: '최종본', keyContent: '점수 86 달성, 우수한 환경 성과', type: 'PDF' },
      { id: 'r2', category: '심화 분석', title: '환경 경영 성과 및 분석', date: '2024.11.01', status: '완료', keyContent: '환경 영역 우수 성과 상세 분석', type: 'PDF' },
    ],
    esgIndicators: {
      environmental: [
        { indicator: '탄소 배출량', value: '95 tCO2e', target: '90 tCO2e' },
        { indicator: '재생에너지 사용률', value: '65%', target: '70%' },
        { indicator: '폐기물 재활용률', value: '96%', target: '95%' },
      ],
      social: [
        { indicator: '여성 임원 비율', value: '32%', target: '35%' },
        { indicator: '직원 교육 시간', value: '48시간/년', target: '40시간/년' },
        { indicator: '산업재해율', value: '0.18%', target: '0.5%' },
      ],
      governance: [
        { indicator: '사외이사 비율', value: '62%', target: '50%' },
        { indicator: '이사회 참석률', value: '96%', target: '90%' },
        { indicator: '윤리경영 교육', value: '100%', target: '100%' },
      ],
    },
  },
  '8': {
    name: '스마트 물류',
    industry: '물류',
    region: '인천광역시',
    employees: 280,
    established: 2005,
    contact: { name: '윤담당', email: 'manager@smartlogistics.com' },
    logo: '🚚',
    overallScore: 68,
    overallGrade: 'C',
    lastEvaluationDate: '2024.11.10',
    esgScores: { environmental: { score: 65, grade: 'C' }, social: { score: 70, grade: 'C' }, governance: { score: 69, grade: 'C' } },
    yearlyData: [
      { year: '2020', score: 62 },
      { year: '2021', score: 64 },
      { year: '2022', score: 65 },
      { year: '2023', score: 67 },
      { year: '2024', score: 68 },
    ],
    esgScoreData: {
      environmental: { score: 65.0, change: 0.8, changeType: 'up', weight: 33 },
      social: { score: 70.0, change: 0.5, changeType: 'up', weight: 33 },
      governance: { score: 69.0, change: 0.3, changeType: 'up', weight: 33 },
    },
    highRisks: [
      { category: '환경', item: '배출가스 감축 필요', severity: 'high' },
      { category: '사회', item: '근로환경 개선 필요', severity: 'medium' },
    ],
    reports: [
      { id: 'r1', category: '종합 진단', title: 'ESG 통합 평가 보고서', date: '2024.11.10', status: '최종본', keyContent: '점수 68 달성, 배출가스 감축 및 근로환경 개선 필요', type: 'PDF' },
    ],
    esgIndicators: {
      environmental: [
        { indicator: '탄소 배출량', value: '450 tCO2e', target: '350 tCO2e' },
        { indicator: '재생에너지 사용률', value: '25%', target: '40%' },
        { indicator: '폐기물 재활용률', value: '82%', target: '85%' },
      ],
      social: [
        { indicator: '여성 임원 비율', value: '18%', target: '25%' },
        { indicator: '직원 교육 시간', value: '32시간/년', target: '40시간/년' },
        { indicator: '산업재해율', value: '0.6%', target: '0.5%' },
      ],
      governance: [
        { indicator: '사외이사 비율', value: '45%', target: '50%' },
        { indicator: '이사회 참석률', value: '88%', target: '90%' },
        { indicator: '윤리경영 교육', value: '85%', target: '100%' },
      ],
    },
  },
};

export function CompanyDetail({ companyId, onNavigate, onLogout, hideSidebar = false }: CompanyDetailProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [isLevel2ModalOpen, setIsLevel2ModalOpen] = useState(false);
  const [selectedDataItems, setSelectedDataItems] = useState<Record<string, boolean>>({});
  const [dataItemDescriptions, setDataItemDescriptions] = useState<Record<string, string>>({});

  // 데이터 항목 정의
  const dataItems = {
    total: [
      { id: 'total-esg-grade', label: 'ESG 등급' },
      { id: 'total-risk-level', label: '위험도' },
      { id: 'total-completion-rate', label: '데이터 완료율' },
      { id: 'total-recent-updates', label: '최근업데이트' },
    ],
    environment: [
      { id: 'env-carbon', label: '탄소 배출량' },
      { id: 'env-energy', label: '에너지 사용량' },
      { id: 'env-waste', label: '폐기물 관리' },
    ],
    social: [
      { id: 'social-welfare', label: '직원 복지' },
      { id: 'social-safety', label: '안전 관리' },
      { id: 'social-contribution', label: '사회공헌 활동' },
    ],
    governance: [
      { id: 'gov-board', label: '이사회 구성' },
      { id: 'gov-ethics', label: '윤리 경영' },
      { id: 'gov-transparency', label: '투명성 보고' },
    ],
  };

  const handleRequestLevel2 = () => {
    setSelectedDataItems({});
    setDataItemDescriptions({});
    setIsLevel2ModalOpen(true);
  };

  const handleCloseLevel2Modal = () => {
    setIsLevel2ModalOpen(false);
    setSelectedDataItems({});
    setDataItemDescriptions({});
  };

  const handleToggleDataItem = (itemId: string) => {
    setSelectedDataItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
    if (!selectedDataItems[itemId]) {
      // 체크박스가 체크되면 설명 필드 초기화
      setDataItemDescriptions(prev => ({
        ...prev,
        [itemId]: '',
      }));
    } else {
      // 체크박스가 해제되면 설명 필드 제거
      setDataItemDescriptions(prev => {
        const newDesc = { ...prev };
        delete newDesc[itemId];
        return newDesc;
      });
    }
  };

  const handleSubmitLevel2Request = () => {
    // TODO: Level 2 요청 제출 로직 구현
    console.log('Level 2 Request for company:', companyId);
    console.log('Selected items:', selectedDataItems);
    console.log('Descriptions:', dataItemDescriptions);
    handleCloseLevel2Modal();
  };

  // companyId에 따라 해당 회사의 데이터 가져오기 (기본값은 첫 번째 회사)
  const companyData = companyDataMap[companyId] || companyDataMap['1'];

  const {
    name,
    industry,
    region,
    employees,
    established,
    contact,
    logo,
    overallScore,
    overallGrade,
    lastEvaluationDate,
    esgScores,
    yearlyData,
    esgScoreData,
    highRisks,
    reports,
    esgIndicators,
  } = companyData;

  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  return (
    <div className="flex min-h-screen bg-[#F6F8FB]">
      {!hideSidebar && <Sidebar currentPage="sme-list" onNavigate={onNavigate} onLogout={onLogout} />}

      <div className={`flex-1 ${!hideSidebar ? 'ml-64' : ''}`}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Back Button and Level 2 Request Button */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              onClick={() => onNavigate('dashboard')}
              className="rounded-xl text-[#5B3BFA]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              관계사 문서관리로 돌아가기
            </Button>
            <Button
              onClick={handleRequestLevel2}
              className="bg-gradient-to-r from-[#5B3BFA] to-[#00B4FF] rounded-xl px-5 hover:shadow-[0_4px_20px_rgba(91,59,250,0.4)] transition-all text-white"
            >
              레벨 2 요청하기
            </Button>
          </div>

          {/* Company Header Card */}
          <Card className="p-8 rounded-[20px] shadow-[0_4px_20px_rgba(91,59,250,0.1)] mb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#5B3BFA] to-[#00B4FF] flex items-center justify-center text-3xl">
                  {logo}
                </div>
                <div>
                  <h1 className="text-[#0F172A] mb-2">{name}</h1>
                  <div className="flex flex-wrap gap-4 text-[#8C8C8C]">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      <span>{industry}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{region}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>직원 수: {employees}명</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>설립: {established}년</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[#8C8C8C] mb-1">담당자 연락처</p>
                <p className="text-[#0F172A] font-medium">{contact.name}</p>
                <p className="text-[#8C8C8C] text-sm">{contact.email}</p>
              </div>
            </div>
          </Card>

          {/* ESG Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card className="p-6 rounded-[20px] shadow-[0_4px_20px_rgba(91,59,250,0.1)] md:col-span-1">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[#5B3BFA] to-[#00B4FF] flex items-center justify-center mb-4">
                  <span className="text-white text-4xl">{overallGrade}</span>
                </div>
                <h2 className="text-[#0F172A] mb-1">{overallScore}점</h2>
                <p className="text-[#8C8C8C]">ESG 종합 등급</p>
                <p className="text-[#8C8C8C] text-sm mt-2">최근 평가일</p>
                <p className="text-[#0F172A] text-sm">{lastEvaluationDate}</p>
              </div>
            </Card>

            <Card className="p-6 rounded-[20px] shadow-[0_4px_20px_rgba(91,59,250,0.1)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#00B4FF]/10 flex items-center justify-center">
                  <span className="text-[#00B4FF]">🌍</span>
                </div>
                <div>
                  <h3 className="text-[#0F172A]">환경 (E)</h3>
                  <p className="text-[#8C8C8C]">Environmental</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[#0F172A]">{esgScores.environmental.score}점</span>
                  <span className="text-[#00B4FF]">{esgScores.environmental.grade}등급</span>
                </div>
                <Progress value={esgScores.environmental.score} className="h-2" />
              </div>
            </Card>

            <Card className="p-6 rounded-[20px] shadow-[0_4px_20px_rgba(91,59,250,0.1)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#5B3BFA]/10 flex items-center justify-center">
                  <span className="text-[#5B3BFA]">👥</span>
                </div>
                <div>
                  <h3 className="text-[#0F172A]">사회 (S)</h3>
                  <p className="text-[#8C8C8C]">Social</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[#0F172A]">{esgScores.social.score}점</span>
                  <span className="text-[#5B3BFA]">{esgScores.social.grade}등급</span>
                </div>
                <Progress value={esgScores.social.score} className="h-2" />
              </div>
            </Card>

            <Card className="p-6 rounded-[20px] shadow-[0_4px_20px_rgba(91,59,250,0.1)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#A58DFF]/10 flex items-center justify-center">
                  <span className="text-[#A58DFF]">⚖️</span>
                </div>
                <div>
                  <h3 className="text-[#0F172A]">지배구조 (G)</h3>
                  <p className="text-[#8C8C8C]">Governance</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[#0F172A]">{esgScores.governance.score}점</span>
                  <span className="text-[#A58DFF]">{esgScores.governance.grade}등급</span>
                </div>
                <Progress value={esgScores.governance.score} className="h-2" />
              </div>
            </Card>
          </div>

          {/* ESG Risk Summary */}
          <Card className="p-6 rounded-[20px] shadow-[0_4px_20px_rgba(91,59,250,0.1)] mb-6">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-6 h-6 text-[#E30074]" />
              <h3 className="text-[#0F172A]">ESG 위험 요약</h3>
            </div>
            <div className="space-y-3">
              {highRisks.map((risk: any, idx: number) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border-l-4 ${risk.severity === 'high'
                    ? 'border-[#E30074] bg-[#E30074]/5'
                    : 'border-[#A58DFF] bg-[#A58DFF]/5'
                    }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-3 py-1 rounded-full text-sm ${risk.severity === 'high'
                          ? 'bg-[#E30074] text-white'
                          : 'bg-[#A58DFF] text-white'
                          }`}>
                          {risk.severity === 'high' ? '높은 위험' : '중간 위험'}
                        </span>
                        <span className="text-[#8C8C8C]">{risk.category}</span>
                      </div>
                      <p className="text-[#0F172A]">{risk.item}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* ESG Score Cards - 영역별 점수 변동 추이 */}
          <div className="mb-8">
            <h2 className="text-[#0F172A] mb-2">영역별 점수 변동 추이</h2>
            <p className="text-[#8C8C8C] mb-6">각 영역별 지난해 및 분기별 점수 변동 추이입니다.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Environmental Card */}
              <Card
                className={`p-6 rounded-[20px] shadow-[0_4px_20px_rgba(91,59,250,0.1)] cursor-pointer transition-all hover:shadow-[0_6px_30px_rgba(91,59,250,0.15)] ${expandedCategory === 'environmental' ? 'ring-2 ring-green-500' : ''}`}
                onClick={() => toggleCategory('environmental')}
              >
                <h3 className="text-green-600 mb-2">환경 Environmental</h3>
                <p className="text-sm text-[#8C8C8C] mb-4">가중치 {esgScoreData.environmental.weight}%</p>
                <p className="text-4xl font-bold text-green-600 mb-2">{esgScoreData.environmental.score}</p>
                <div className="flex items-center gap-1">
                  {esgScoreData.environmental.changeType === 'up' ? (
                    <>
                      <span className="text-red-500">▲</span>
                      <span className="text-red-500">{esgScoreData.environmental.change}</span>
                    </>
                  ) : (
                    <>
                      <span className="text-blue-500">▼</span>
                      <span className="text-blue-500">{esgScoreData.environmental.change}</span>
                    </>
                  )}
                  <span className="text-[#8C8C8C] text-sm ml-1">전년대비</span>
                </div>
              </Card>

              {/* Social Card */}
              <Card
                className={`p-6 rounded-[20px] shadow-[0_4px_20px_rgba(91,59,250,0.1)] cursor-pointer transition-all hover:shadow-[0_6px_30px_rgba(91,59,250,0.15)] ${expandedCategory === 'social' ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => toggleCategory('social')}
              >
                <h3 className="text-blue-600 mb-2">사회 Social</h3>
                <p className="text-sm text-[#8C8C8C] mb-4">가중치 {esgScoreData.social.weight}%</p>
                <p className="text-4xl font-bold text-blue-600 mb-2">{esgScoreData.social.score}</p>
                <div className="flex items-center gap-1">
                  {esgScoreData.social.changeType === 'up' ? (
                    <>
                      <span className="text-red-500">▲</span>
                      <span className="text-red-500">{esgScoreData.social.change}</span>
                    </>
                  ) : (
                    <>
                      <span className="text-blue-500">▼</span>
                      <span className="text-blue-500">{esgScoreData.social.change}</span>
                    </>
                  )}
                  <span className="text-[#8C8C8C] text-sm ml-1">전년대비</span>
                </div>
              </Card>

              {/* Governance Card */}
              <Card
                className={`p-6 rounded-[20px] shadow-[0_4px_20px_rgba(91,59,250,0.1)] cursor-pointer transition-all hover:shadow-[0_6px_30px_rgba(91,59,250,0.15)] ${expandedCategory === 'governance' ? 'ring-2 ring-purple-500' : ''}`}
                onClick={() => toggleCategory('governance')}
              >
                <h3 className="text-purple-600 mb-2">지배구조 Governance</h3>
                <p className="text-sm text-[#8C8C8C] mb-4">가중치 {esgScoreData.governance.weight}%</p>
                <p className="text-4xl font-bold text-purple-600 mb-2">{esgScoreData.governance.score}</p>
                <div className="flex items-center gap-1">
                  {esgScoreData.governance.changeType === 'up' ? (
                    <>
                      <span className="text-red-500">▲</span>
                      <span className="text-red-500">{esgScoreData.governance.change}</span>
                    </>
                  ) : (
                    <>
                      <span className="text-blue-500">▼</span>
                      <span className="text-blue-500">{esgScoreData.governance.change}</span>
                    </>
                  )}
                  <span className="text-[#8C8C8C] text-sm ml-1">전년대비</span>
                </div>
              </Card>
            </div>

            {/* Detailed Indicators - Show when category is expanded */}
            {expandedCategory && (
              <Card className="p-6 rounded-[20px] shadow-[0_4px_20px_rgba(91,59,250,0.1)] mb-6">
                <div className="space-y-4">
                  {expandedCategory === 'environmental' && (
                    <>
                      <h3 className="text-[#0F172A] mb-4">환경 지표 (Environmental)</h3>
                      {esgIndicators.environmental.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-[#F6F8FB] rounded-xl">
                          <span className="text-[#0F172A] font-medium">{item.indicator}</span>
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <ReadOnlyTooltip>
                                <Input
                                  value={item.value}
                                  disabled
                                  className="text-center h-10 w-32 rounded-lg bg-white cursor-not-allowed pr-8"
                                />
                              </ReadOnlyTooltip>
                              <Lock className="w-4 h-4 text-[#8C8C8C] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                            <span className="text-[#8C8C8C]">{item.target}</span>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                  {expandedCategory === 'social' && (
                    <>
                      <h3 className="text-[#0F172A] mb-4">사회 지표 (Social)</h3>
                      {esgIndicators.social.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-[#F6F8FB] rounded-xl">
                          <span className="text-[#0F172A] font-medium">{item.indicator}</span>
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <ReadOnlyTooltip>
                                <Input
                                  value={item.value}
                                  disabled
                                  className="text-center h-10 w-32 rounded-lg bg-white cursor-not-allowed pr-8"
                                />
                              </ReadOnlyTooltip>
                              <Lock className="w-4 h-4 text-[#8C8C8C] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                            <span className="text-[#8C8C8C]">{item.target}</span>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                  {expandedCategory === 'governance' && (
                    <>
                      <h3 className="text-[#0F172A] mb-4">지배구조 지표 (Governance)</h3>
                      {esgIndicators.governance.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-[#F6F8FB] rounded-xl">
                          <span className="text-[#0F172A] font-medium">{item.indicator}</span>
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <ReadOnlyTooltip>
                                <Input
                                  value={item.value}
                                  disabled
                                  className="text-center h-10 w-32 rounded-lg bg-white cursor-not-allowed pr-8"
                                />
                              </ReadOnlyTooltip>
                              <Lock className="w-4 h-4 text-[#8C8C8C] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                            <span className="text-[#8C8C8C]">{item.target}</span>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </Card>
            )}
          </div>

          {/* Reports & History Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* ESG 진단 점수 변동 추이 */}
            <Card className="p-6 rounded-[20px] shadow-[0_4px_20px_rgba(91,59,250,0.1)]">
              <h3 className="text-[#0F172A] mb-6">ESG 진단 점수 변동 추이</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={yearlyData} margin={{ top: 30, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="year" stroke="#8C8C8C" />
                  <YAxis stroke="#8C8C8C" domain={[60, 100]} />
                  <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                    {yearlyData.map((entry: any, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === yearlyData.length - 1 ? '#4CAF50' : '#D3D3D3'}
                      />
                    ))}
                    <LabelList
                      dataKey="score"
                      position="top"
                      className="text-[#0F172A] text-sm font-medium"
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Submission History */}
            <Card className="p-6 rounded-[20px] shadow-[0_4px_20px_rgba(91,59,250,0.1)]">
              <h3 className="text-[#0F172A] mb-6">제출 이력</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left p-4 text-[#0F172A] font-medium">문서 분류</th>
                      <th className="text-left p-4 text-[#0F172A] font-medium">문서명</th>
                      <th className="text-left p-4 text-[#0F172A] font-medium">제출/생성일</th>
                      <th className="text-left p-4 text-[#0F172A] font-medium">상태</th>
                      <th className="text-left p-4 text-[#0F172A] font-medium">핵심 내용</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((report: any) => (
                      <tr key={report.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="p-4 text-sm text-[#0F172A]">{report.category || '-'}</td>
                        <td className="p-4">
                          <p className="text-sm text-[#0F172A] font-medium">{report.title}</p>
                        </td>
                        <td className="p-4 text-sm text-[#8C8C8C]">{report.date}</td>
                        <td className="p-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${report.status === '최종본' || report.status === '완료'
                            ? 'bg-green-100 text-green-700'
                            : report.status === '개선 조치 중'
                              ? 'bg-yellow-100 text-yellow-700'
                              : report.status === '검토 요청'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                            {report.status}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-[#8C8C8C]">{report.keyContent || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Level 2 요청 모달 */}
      {isLevel2ModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="relative flex items-center justify-center mb-6">
                <h2 className="text-2xl font-bold text-[#0F172A] text-center">
                  {name} 레벨 2 요청
                </h2>
                <button
                  onClick={handleCloseLevel2Modal}
                  className="absolute right-0 text-gray-400 hover:text-gray-600 text-3xl leading-none w-8 h-8 flex items-center justify-center"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                {/* Total 섹션 */}
                <div className="border-2 border-gray-200 rounded-xl p-5">
                  <h3 className="text-lg font-semibold text-[#0F172A] mb-4">Total</h3>
                  <div className="space-y-4">
                    {dataItems.total.map((item) => (
                      <div key={item.id} className="space-y-2">
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={selectedDataItems[item.id] || false}
                            onChange={() => handleToggleDataItem(item.id)}
                            className="w-5 h-5 rounded border-2 border-gray-300 text-[#5B3BFA] focus:ring-2 focus:ring-[#5B3BFA] focus:ring-offset-2 cursor-pointer appearance-none checked:bg-[#5B3BFA] checked:border-[#5B3BFA] relative after:content-['✓'] after:absolute after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:text-white after:text-sm after:font-bold after:opacity-0 checked:after:opacity-100"
                          />
                          <span className="text-[#0F172A] text-base">{item.label}</span>
                        </label>
                        {selectedDataItems[item.id] && (
                          <div className="ml-8 mt-2">
                            <Textarea
                              placeholder="부가 설명을 입력하세요..."
                              value={dataItemDescriptions[item.id] || ''}
                              onChange={(e) => setDataItemDescriptions(prev => ({
                                ...prev,
                                [item.id]: e.target.value,
                              }))}
                              className="min-h-[80px] rounded-xl border-2 border-gray-200 focus:border-[#5B3BFA] focus:ring-2 focus:ring-[#5B3BFA]/20"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Environment 섹션 */}
                <div className="border-2 border-gray-200 rounded-xl p-5">
                  <h3 className="text-lg font-semibold text-[#0F172A] mb-4">Environment</h3>
                  <div className="space-y-4">
                    {dataItems.environment.map((item) => (
                      <div key={item.id} className="space-y-2">
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={selectedDataItems[item.id] || false}
                            onChange={() => handleToggleDataItem(item.id)}
                            className="w-5 h-5 rounded border-2 border-gray-300 text-[#5B3BFA] focus:ring-2 focus:ring-[#5B3BFA] focus:ring-offset-2 cursor-pointer appearance-none checked:bg-[#5B3BFA] checked:border-[#5B3BFA] relative after:content-['✓'] after:absolute after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:text-white after:text-sm after:font-bold after:opacity-0 checked:after:opacity-100"
                          />
                          <span className="text-[#0F172A] text-base">{item.label}</span>
                        </label>
                        {selectedDataItems[item.id] && (
                          <div className="ml-8 mt-2">
                            <Textarea
                              placeholder="부가 설명을 입력하세요..."
                              value={dataItemDescriptions[item.id] || ''}
                              onChange={(e) => setDataItemDescriptions(prev => ({
                                ...prev,
                                [item.id]: e.target.value,
                              }))}
                              className="min-h-[80px] rounded-xl border-2 border-gray-200 focus:border-[#5B3BFA] focus:ring-2 focus:ring-[#5B3BFA]/20"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Social 섹션 */}
                <div className="border-2 border-gray-200 rounded-xl p-5">
                  <h3 className="text-lg font-semibold text-[#0F172A] mb-4">Social</h3>
                  <div className="space-y-4">
                    {dataItems.social.map((item) => (
                      <div key={item.id} className="space-y-2">
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={selectedDataItems[item.id] || false}
                            onChange={() => handleToggleDataItem(item.id)}
                            className="w-5 h-5 rounded border-2 border-gray-300 text-[#5B3BFA] focus:ring-2 focus:ring-[#5B3BFA] focus:ring-offset-2 cursor-pointer appearance-none checked:bg-[#5B3BFA] checked:border-[#5B3BFA] relative after:content-['✓'] after:absolute after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:text-white after:text-sm after:font-bold after:opacity-0 checked:after:opacity-100"
                          />
                          <span className="text-[#0F172A] text-base">{item.label}</span>
                        </label>
                        {selectedDataItems[item.id] && (
                          <div className="ml-8 mt-2">
                            <Textarea
                              placeholder="부가 설명을 입력하세요..."
                              value={dataItemDescriptions[item.id] || ''}
                              onChange={(e) => setDataItemDescriptions(prev => ({
                                ...prev,
                                [item.id]: e.target.value,
                              }))}
                              className="min-h-[80px] rounded-xl border-2 border-gray-200 focus:border-[#5B3BFA] focus:ring-2 focus:ring-[#5B3BFA]/20"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Governance 섹션 */}
                <div className="border-2 border-gray-200 rounded-xl p-5">
                  <h3 className="text-lg font-semibold text-[#0F172A] mb-4">Governance</h3>
                  <div className="space-y-4">
                    {dataItems.governance.map((item) => (
                      <div key={item.id} className="space-y-2">
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={selectedDataItems[item.id] || false}
                            onChange={() => handleToggleDataItem(item.id)}
                            className="w-5 h-5 rounded border-2 border-gray-300 text-[#5B3BFA] focus:ring-2 focus:ring-[#5B3BFA] focus:ring-offset-2 cursor-pointer appearance-none checked:bg-[#5B3BFA] checked:border-[#5B3BFA] relative after:content-['✓'] after:absolute after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:text-white after:text-sm after:font-bold after:opacity-0 checked:after:opacity-100"
                          />
                          <span className="text-[#0F172A] text-base">{item.label}</span>
                        </label>
                        {selectedDataItems[item.id] && (
                          <div className="ml-8 mt-2">
                            <Textarea
                              placeholder="부가 설명을 입력하세요..."
                              value={dataItemDescriptions[item.id] || ''}
                              onChange={(e) => setDataItemDescriptions(prev => ({
                                ...prev,
                                [item.id]: e.target.value,
                              }))}
                              className="min-h-[80px] rounded-xl border-2 border-gray-200 focus:border-[#5B3BFA] focus:ring-2 focus:ring-[#5B3BFA]/20"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 버튼 */}
              <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={handleCloseLevel2Modal}
                  className="rounded-xl px-6 h-10 bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                >
                  취소
                </Button>
                <Button
                  onClick={handleSubmitLevel2Request}
                  className="bg-gradient-to-r from-[#5B3BFA] to-[#00B4FF] rounded-xl px-6 h-10 text-white hover:opacity-90 shadow-lg"
                >
                  수락
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Level 2 요청 모달 */}
      {isLevel2ModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="relative flex items-center justify-center mb-6">
                <h2 className="text-2xl font-bold text-[#0F172A] text-center">
                  {name} 레벨 2 요청
                </h2>
                <button
                  onClick={handleCloseLevel2Modal}
                  className="absolute right-0 text-gray-400 hover:text-gray-600 text-3xl leading-none w-8 h-8 flex items-center justify-center"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                {/* Total 섹션 */}
                <div className="border-2 border-gray-200 rounded-xl p-5">
                  <h3 className="text-lg font-semibold text-[#0F172A] mb-4">Total</h3>
                  <div className="space-y-4">
                    {dataItems.total.map((item) => (
                      <div key={item.id} className="space-y-2">
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={selectedDataItems[item.id] || false}
                            onChange={() => handleToggleDataItem(item.id)}
                            className="w-5 h-5 rounded border-2 border-gray-300 text-[#5B3BFA] focus:ring-2 focus:ring-[#5B3BFA] focus:ring-offset-2 cursor-pointer appearance-none checked:bg-[#5B3BFA] checked:border-[#5B3BFA] relative after:content-['✓'] after:absolute after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:text-white after:text-sm after:font-bold after:opacity-0 checked:after:opacity-100"
                          />
                          <span className="text-[#0F172A] text-base">{item.label}</span>
                        </label>
                        {selectedDataItems[item.id] && (
                          <div className="ml-8 mt-2">
                            <Textarea
                              placeholder="부가 설명을 입력하세요..."
                              value={dataItemDescriptions[item.id] || ''}
                              onChange={(e) => setDataItemDescriptions(prev => ({
                                ...prev,
                                [item.id]: e.target.value,
                              }))}
                              className="min-h-[80px] rounded-xl border-2 border-gray-200 focus:border-[#5B3BFA] focus:ring-2 focus:ring-[#5B3BFA]/20"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Environment 섹션 */}
                <div className="border-2 border-gray-200 rounded-xl p-5">
                  <h3 className="text-lg font-semibold text-[#0F172A] mb-4">Environment</h3>
                  <div className="space-y-4">
                    {dataItems.environment.map((item) => (
                      <div key={item.id} className="space-y-2">
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={selectedDataItems[item.id] || false}
                            onChange={() => handleToggleDataItem(item.id)}
                            className="w-5 h-5 rounded border-2 border-gray-300 text-[#5B3BFA] focus:ring-2 focus:ring-[#5B3BFA] focus:ring-offset-2 cursor-pointer appearance-none checked:bg-[#5B3BFA] checked:border-[#5B3BFA] relative after:content-['✓'] after:absolute after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:text-white after:text-sm after:font-bold after:opacity-0 checked:after:opacity-100"
                          />
                          <span className="text-[#0F172A] text-base">{item.label}</span>
                        </label>
                        {selectedDataItems[item.id] && (
                          <div className="ml-8 mt-2">
                            <Textarea
                              placeholder="부가 설명을 입력하세요..."
                              value={dataItemDescriptions[item.id] || ''}
                              onChange={(e) => setDataItemDescriptions(prev => ({
                                ...prev,
                                [item.id]: e.target.value,
                              }))}
                              className="min-h-[80px] rounded-xl border-2 border-gray-200 focus:border-[#5B3BFA] focus:ring-2 focus:ring-[#5B3BFA]/20"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Social 섹션 */}
                <div className="border-2 border-gray-200 rounded-xl p-5">
                  <h3 className="text-lg font-semibold text-[#0F172A] mb-4">Social</h3>
                  <div className="space-y-4">
                    {dataItems.social.map((item) => (
                      <div key={item.id} className="space-y-2">
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={selectedDataItems[item.id] || false}
                            onChange={() => handleToggleDataItem(item.id)}
                            className="w-5 h-5 rounded border-2 border-gray-300 text-[#5B3BFA] focus:ring-2 focus:ring-[#5B3BFA] focus:ring-offset-2 cursor-pointer appearance-none checked:bg-[#5B3BFA] checked:border-[#5B3BFA] relative after:content-['✓'] after:absolute after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:text-white after:text-sm after:font-bold after:opacity-0 checked:after:opacity-100"
                          />
                          <span className="text-[#0F172A] text-base">{item.label}</span>
                        </label>
                        {selectedDataItems[item.id] && (
                          <div className="ml-8 mt-2">
                            <Textarea
                              placeholder="부가 설명을 입력하세요..."
                              value={dataItemDescriptions[item.id] || ''}
                              onChange={(e) => setDataItemDescriptions(prev => ({
                                ...prev,
                                [item.id]: e.target.value,
                              }))}
                              className="min-h-[80px] rounded-xl border-2 border-gray-200 focus:border-[#5B3BFA] focus:ring-2 focus:ring-[#5B3BFA]/20"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Governance 섹션 */}
                <div className="border-2 border-gray-200 rounded-xl p-5">
                  <h3 className="text-lg font-semibold text-[#0F172A] mb-4">Governance</h3>
                  <div className="space-y-4">
                    {dataItems.governance.map((item) => (
                      <div key={item.id} className="space-y-2">
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={selectedDataItems[item.id] || false}
                            onChange={() => handleToggleDataItem(item.id)}
                            className="w-5 h-5 rounded border-2 border-gray-300 text-[#5B3BFA] focus:ring-2 focus:ring-[#5B3BFA] focus:ring-offset-2 cursor-pointer appearance-none checked:bg-[#5B3BFA] checked:border-[#5B3BFA] relative after:content-['✓'] after:absolute after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:text-white after:text-sm after:font-bold after:opacity-0 checked:after:opacity-100"
                          />
                          <span className="text-[#0F172A] text-base">{item.label}</span>
                        </label>
                        {selectedDataItems[item.id] && (
                          <div className="ml-8 mt-2">
                            <Textarea
                              placeholder="부가 설명을 입력하세요..."
                              value={dataItemDescriptions[item.id] || ''}
                              onChange={(e) => setDataItemDescriptions(prev => ({
                                ...prev,
                                [item.id]: e.target.value,
                              }))}
                              className="min-h-[80px] rounded-xl border-2 border-gray-200 focus:border-[#5B3BFA] focus:ring-2 focus:ring-[#5B3BFA]/20"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 버튼 */}
              <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={handleCloseLevel2Modal}
                  className="rounded-xl px-6 h-10 bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                >
                  취소
                </Button>
                <Button
                  onClick={handleSubmitLevel2Request}
                  className="bg-gradient-to-r from-[#5B3BFA] to-[#00B4FF] rounded-xl px-6 h-10 text-white hover:opacity-90 shadow-lg"
                >
                  수락
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}