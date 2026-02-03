import { CoverPage } from "./pdf-pages/CoverPage";
import { PurposePage } from "./pdf-pages/PurposePage";
import { ManagementStatusPage } from "./pdf-pages/ManagementStatusPage";
import { RiskAssessmentPage } from "./pdf-pages/RiskAssessmentPage";
import { ReasonableEffortPage } from "./pdf-pages/ReasonableEffortPage";
import { ConfirmationPage } from "./pdf-pages/ConfirmationPage";

export function PDFPreview() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <CoverPage />
        <div className="border-t border-gray-200 my-8" />
        <PurposePage />
        <div className="border-t border-gray-200 my-8" />
        <ManagementStatusPage />
        <div className="border-t border-gray-200 my-8" />
        <RiskAssessmentPage />
        <div className="border-t border-gray-200 my-8" />
        <ReasonableEffortPage />
        <div className="border-t border-gray-200 my-8" />
        <ConfirmationPage />
      </div>
    </div>
  );
}

