import { DashboardLayout } from "./DashboardLayout";
import { AlertCircle } from "lucide-react";

const metrics = [
  { label: "Vitamin D", value: "18", unit: "ng/mL", status: "danger", range: "30-100" },
  { label: "Vitamin B12", value: "450", unit: "pg/mL", status: "normal", range: "200-900" },
  { label: "Folate", value: "12", unit: "ng/mL", status: "normal", range: "2-20" },
  { label: "Iron", value: "85", unit: "μg/dL", status: "normal", range: "60-170" },
];

const referenceData = [
  { label: "Vitamin D", value: 18, min: 30, max: 100, percentage: 25, lowRange: true },
  { label: "Vitamin B12", value: 450, min: 200, max: 900, percentage: 35 },
  { label: "Folate", value: 12, min: 2, max: 20, percentage: 55 },
  { label: "Iron", value: 85, min: 60, max: 170, percentage: 23 },
];

const flaggedItems = [
  {
    name: "Vitamin D",
    value: "18 ng/mL",
    range: "30-100 ng/mL",
    status: "danger",
  },
];

export function Vitamins() {
  return (
    <DashboardLayout breadcrumb="Nutrients & Vitamins">
      {/* Page title */}
      <h1 className="text-[22px] font-semibold text-[#111111] mb-[24px]">
        Nutrients & Vitamins
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
                  metric.status === "normal" ? "bg-[#16A34A]" : metric.status === "danger" ? "bg-[#DC2626]" : "bg-[#D97706]"
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
                  className={`absolute h-full rounded-full ${item.lowRange ? "bg-[#DC2626]" : "bg-[#1A6BFA]"}`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <div className="text-[12px] text-[#6B6B6B] mt-[4px]">
                Current: {item.value}
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
            {flaggedItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-[16px] border border-[#E5E5E5] rounded-[8px]"
              >
                <div className="text-left">
                  <div className="text-[14px] font-medium text-[#111111]">{item.name}</div>
                  <div className="text-[12px] text-[#6B6B6B]">
                    Reference: {item.range}
                  </div>
                </div>
                <div className="flex items-center gap-[12px]">
                  <div className="text-[15px] font-semibold text-[#111111]">{item.value}</div>
                  <span className="px-[12px] py-[4px] rounded-[8px] text-[11px] font-medium tracking-[0.04em] bg-[#FEE2E2] text-[#991B1B]">
                    LOW
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
