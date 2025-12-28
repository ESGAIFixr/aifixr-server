import { Info, ShieldCheck } from "lucide-react";

export function InfoBanner() {
  return (
    <div className="mb-8 bg-blue-50 border border-blue-200 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <div className="flex items-center gap-2 mt-0.5">
          <Info className="w-5 h-5 text-blue-600" />
          <ShieldCheck className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex-1">
          <p className="text-blue-900">
            본 문서는 대기업 공급망 ESG 관리 대응을 위한 확인서로,{" "}
            <strong>성과 평가, ESG 등급, 공시 자료가 아닙니다.</strong>
          </p>
          <p className="text-blue-700 text-sm mt-1">
            협력사의 합리적 노력(Reasonable Effort)을 증빙하기 위한 관리 문서입니다.
          </p>
        </div>
      </div>
    </div>
  );
}

