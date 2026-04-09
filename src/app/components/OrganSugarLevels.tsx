import { DashboardLayout } from "./DashboardLayout";
import { AlertCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from "recharts";

const metrics = [
  { label: "Glucose", value: "110", unit: "mg/dL", status: "warning", range: "70-100" },
  { label: "HbA1c", value: "6.8", unit: "%", status: "warning", range: "4.0-5.6" },
  { label: "Creatinine", value: "1.0", unit: "mg/dL", status: "normal", range: "0.7-1.3" },
  { label: "ALT", value: "28", unit: "U/L", status: "normal", range: "7-56" },
];

const glucoseTrendData = [
  { date: "Dec", value: 95 },
  { date: "Jan", value: 98 },
  { date: "Feb", value: 105 },
  { date: "Mar", value: 110 },
];

const flaggedItems = [
  {
    name: "HbA1c",
    value: "6.8%",
    range: "4.0-5.6%",
    status: "warning",
  },
  {
    name: "Glucose",
    value: "110 mg/dL",
    range: "70-100 mg/dL",
    status: "warning",
  },
];

export function OrganSugarLevels() {
  return (
    <DashboardLayout breadcrumb="Organ & Sugar Levels">
      {/* Page title */}
      <h1 className="text-[22px] font-semibold text-[#111111] mb-[24px]">
        Organ & Sugar Levels
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

      {/* Glucose Trend */}
      <div className="bg-white border border-[#E5E5E5] rounded-[12px] p-[24px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] mb-[32px]">
        <h2 className="text-[15px] font-semibold text-[#111111] mb-[24px]">
          Glucose Trend (Last 4 visits)
        </h2>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={glucoseTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" vertical={false} />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B6B6B", fontSize: 12 }}
            />
            <YAxis
              domain={[80, 120]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B6B6B", fontSize: 12 }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#1A6BFA"
              strokeWidth={2}
              dot={{ fill: "#1A6BFA", r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Diabetes Risk Indicator */}
      <div className="bg-white border border-[#E5E5E5] rounded-[12px] p-[24px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] mb-[32px]">
        <h2 className="text-[15px] font-semibold text-[#111111] mb-[16px]">
          Diabetes Risk
        </h2>
        <div className="flex items-center gap-[24px]">
          <div className="text-center">
            <div className="text-[32px] font-semibold text-[#D97706] mb-[8px]">
              6.8%
            </div>
            <div className="text-[13px] text-[#6B6B6B]">HbA1c Level</div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-[8px] mb-[12px]">
              <span
                className="px-[16px] py-[8px] rounded-[8px] text-[14px] font-medium bg-[#FEF3C7] text-[#92400E]"
              >
                Pre-diabetic range
              </span>
            </div>
            <div className="text-[13px] text-[#6B6B6B] leading-relaxed">
              Your HbA1c is in the pre-diabetic range (5.7-6.4%). This indicates an increased risk
              of developing type 2 diabetes. Lifestyle modifications are recommended.
            </div>
          </div>
        </div>
        <div className="mt-[24px] p-[16px] bg-[#F9F9F8] rounded-[8px]">
          <div className="text-[12px] text-[#6B6B6B] mb-[8px] tracking-[0.04em]">
            REFERENCE RANGES
          </div>
          <div className="space-y-[4px] text-[13px]">
            <div className="flex justify-between">
              <span className="text-[#6B6B6B]">Normal:</span>
              <span className="text-[#111111]">&lt;5.7%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B6B6B]">Pre-diabetic:</span>
              <span className="text-[#111111]">5.7-6.4%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B6B6B]">Diabetic:</span>
              <span className="text-[#111111]">≥6.5%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Flagged section */}
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
                <span className="px-[12px] py-[4px] rounded-[8px] text-[11px] font-medium tracking-[0.04em] bg-[#FEF3C7] text-[#92400E]">
                  ELEVATED
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
