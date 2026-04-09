import { DashboardLayout } from "./DashboardLayout";
import { AlertCircle } from "lucide-react";
import { useHealthData } from "../../hooks/useData";

export function BloodCount() {
  const { data, isLoading, error } = useHealthData("blood");

  if (isLoading) {
    return (
      <DashboardLayout breadcrumb="Blood Count">
        <div className="flex items-center justify-center h-[400px]">
          <div className="text-[16px] text-[#6B6B6B]">Loading blood metrics...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !data) {
    return (
      <DashboardLayout breadcrumb="Blood Count">
        <div className="flex items-center justify-center h-[400px]">
          <div className="flex items-start gap-[8px] p-[16px] bg-[#FEE2E2] rounded-[8px] max-w-[400px]">
            <AlertCircle className="w-[14px] h-[14px] text-[#991B1B] mt-[2px] flex-shrink-0" strokeWidth={1.5} />
            <p className="text-[13px] text-[#991B1B]">
              Failed to load blood metrics. Please try again.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const bloodData = data.bloodCounts || {};
  
  const metrics = [
    { label: "RBC", value: bloodData.rbc?.toFixed(1) || "N/A", unit: "M/μL", status: "normal", range: "4.5-5.5" },
    { label: "WBC", value: bloodData.wbc?.toFixed(1) || "N/A", unit: "K/μL", status: "normal", range: "4.5-11.0" },
    { label: "Hemoglobin", value: bloodData.hemoglobin?.toFixed(1) || "N/A", unit: "g/dL", status: "normal", range: "13.5-17.5" },
    { label: "Platelets", value: bloodData.platelets?.toFixed(0) || "N/A", unit: "K/μL", status: "normal", range: "150-400" },
  ];

  const referenceData = [
    { label: "RBC", value: bloodData.rbc || 0, min: 4.5, max: 5.5, percentage: Math.min(100, ((bloodData.rbc || 4.5) / 5.5) * 100) },
    { label: "WBC", value: bloodData.wbc || 0, min: 4.5, max: 11.0, percentage: Math.min(100, ((bloodData.wbc || 8) / 11) * 100) },
    { label: "Hemoglobin", value: bloodData.hemoglobin || 0, min: 13.5, max: 17.5, percentage: Math.min(100, ((bloodData.hemoglobin || 14) / 17.5) * 100) },
    { label: "Platelets", value: bloodData.platelets || 0, min: 150, max: 400, percentage: Math.min(100, ((bloodData.platelets || 245) / 400) * 100) },
  ];

  const flaggedItems = data.trends?.filter((item: any) => item.status === "warning") || [];

  return (
    <DashboardLayout breadcrumb="Blood Count">
      {/* Page title */}
      <h1 className="text-[22px] font-semibold text-[#111111] mb-[24px]">
        Blood Count
      </h1>

      {/* Metric cards */}
      <div className="grid grid-cols-4 gap-[16px] mb-[32px]">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="bg-white border border-[#E5E5E5] rounded-[12px] p-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
          >
            <div className="flex items-start justify-between mb-[12px]">
              <div className="text-[13px] text-[#6B6B6B] tracking-[0.04em]">
                {metric.label.toUpperCase()}
              </div>
              <div
                className={`w-2 h-2 rounded-full ${
                  metric.status === "normal" ? "bg-[#16A34A]" : "bg-[#D97706]"
                }`}
              />
            </div>
            <div className="text-[24px] font-semibold text-[#111111] mb-[4px]">
              {metric.value}
            </div>
            <div className="text-[12px] text-[#6B6B6B]">{metric.unit}</div>
          </div>
        ))}
      </div>

      {/* Reference range bars */}
      <div className="bg-white border border-[#E5E5E5] rounded-[12px] p-[24px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] mb-[32px]">
        <h2 className="text-[15px] font-semibold text-[#111111] mb-[24px]">
          Values vs Reference Range
        </h2>
        <div className="space-y-[24px]">
          {referenceData.map((item, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-[8px]">
                <span className="text-[14px] text-[#111111] font-medium">
                  {item.label}
                </span>
                <span className="text-[14px] text-[#6B6B6B]">
                  {item.min} - {item.max}
                </span>
              </div>
              <div className="relative h-[8px] bg-[#F0F0EF] rounded-full">
                <div
                  className="absolute h-full bg-[#1A6BFA] rounded-full"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <div className="text-[12px] text-[#6B6B6B] mt-[4px]">
                Current: {item.value.toFixed(1)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Flagged section */}
      {flaggedItems.length > 0 && (
        <div className="bg-white border border-[#E5E5E5] rounded-[12px] p-[24px] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          <div className="flex items-center gap-[8px] mb-[24px]">
            <AlertCircle className="w-[16px] h-[16px] text-[#DC2626]" strokeWidth={1.5} />
            <h2 className="text-[15px] font-semibold text-[#111111]">Flagged Items</h2>
          </div>
          <div className="space-y-[12px]">
            {flaggedItems.map((item: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between p-[16px] border border-[#E5E5E5] rounded-[8px]"
              >
                <div className="text-left">
                  <div className="text-[14px] font-medium text-[#111111]">{item.name || 'Item'}</div>
                  <div className="text-[12px] text-[#6B6B6B]">
                    {item.range || 'Range: N/A'}
                  </div>
                </div>
                <div className="flex items-center gap-[12px]">
                  <div className="text-[15px] font-semibold text-[#111111]">{item.value || 'N/A'}</div>
                  <span className="px-[12px] py-[4px] rounded-[8px] text-[11px] font-medium tracking-[0.04em] bg-[#FEF3C7] text-[#92400E]">
                    {item.status?.toUpperCase() || 'STATUS'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
