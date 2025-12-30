export interface Company {
  id: string;
  name: string;
  industry: string;
  grade: string;
  score: number;
  date: string;
  logo: string;
}

export const mockCompanies: Company[] = [
  { id: '1', name: '테크솔루션 주식회사', industry: 'IT/소프트웨어', grade: 'A', score: 87, date: '2024.11.28', logo: '🏢' },
  { id: '2', name: '그린에너지 코퍼레이션', industry: '에너지', grade: 'B', score: 78, date: '2024.11.25', logo: '⚡' },
  { id: '3', name: '스마트제조 산업', industry: '제조', grade: 'A', score: 85, date: '2024.11.22', logo: '🏭' },
  { id: '4', name: '친환경 패키징', industry: '제조', grade: 'B', score: 76, date: '2024.11.20', logo: '📦' },
  { id: '5', name: '디지털 솔루션즈', industry: 'IT/소프트웨어', grade: 'A', score: 89, date: '2024.11.18', logo: '💻' },
  { id: '6', name: '바이오텍 연구소', industry: '바이오/헬스케어', grade: 'B', score: 79, date: '2024.11.15', logo: '🧬' },
  { id: '7', name: '청정수자원', industry: '환경', grade: 'A', score: 86, date: '2024.11.12', logo: '💧' },
  { id: '8', name: '스마트 물류', industry: '물류', grade: 'C', score: 68, date: '2024.11.10', logo: '🚚' },
];


