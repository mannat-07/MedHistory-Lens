import { DashboardLayout } from "./DashboardLayout";
import { PredictionCards } from "./PredictionCards";

export function AiPrediction() {
  return (
    <DashboardLayout breadcrumb="AI Prediction">
      <div className="max-w-[900px]">
        <PredictionCards />
      </div>
    </DashboardLayout>
  );
}
