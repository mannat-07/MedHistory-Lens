import { DashboardLayout } from "./DashboardLayout";
import { AlertCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { useHealthData } from "../../hooks/useData";

export function HeartCholesterol() {
  const { data, isLoading, error } = useHealthData("heart");

  if (isLoading) {
    return (
      <DashboardLayout breadcrumb="Heart & Cholesterol">
        <div className="flex items-center justify-center h-[400px]">
          <div className="text-[16px] text-[#6B6B6B]">Loading heart metrics...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !data) {
    return (
      <DashboardLayout breadcrumb="Heart & Cholesterol">
        <div className="flex items-center justify-center h-[400px]">
          <div className="flex items-start gap-[8px] p-[16px] bg-[#FEE2E2] rounded-[8px] max-w-[400px]">
            <AlertCircle className="w-[14px] h-[14px] text-[#991B1B] mt-[2px] flex-shrink-0" strokeWidth={1.5} />
            <p className="text-[13px] text-[#991B1B]">
              Failed to load heart metrics. Please try again.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const heartData = data.heart || {};
  
  const metrics = [
    { label: "Total Cholesterol", value: heartData.totalCholesterol?.toFixed(0) || "N/A", unit: "mg/dL", status: (heartData.totalCholesterol || 0) > 200 ? "warning" : "normal", range: "<200" },
    { label: "LDL", value: heartData.ldl?.toFixed(0) || "N/A", unit: "mg/dL", status: (heartData.ldl || 0) > 100 ? "warning" : "normal", range: "<100" },
    { label: "HDL", value: heartData.hdl?.toFixed(0) || "N/A", unit: "mg/dL", status: (heartData.hdl || 0) > 40 ? "normal" : "warning", range: ">40" },
    { label: "Triglycerides", value: heartData.triglycerides?.toFixed(0) || "N/A", unit: "mg/dL", status: "normal", range: "<150" },
  ];

  const comparisonData = data.trends?.slice(-3) || [
    { visit: "Jan", LDL: heartData.ldl || 0, HDL: heartData.hdl || 0 },
  ];

  const flaggedItems = [
    ...(heartData.ldl && heartData.ldl > 100 ? [{
      name: "LDL Cholesterol",
      value: `${heartData.ldl.toFixed(0)} mg/dL`,
      range: "<100 mg/dL",
      status: "warning",
    }] : []),
    ...(heartData.totalCholesterol && heartData.totalCholesterol > 200 ? [{
      name: "Total Cholesterol",
      value: `${heartData.totalCholesterol.toFixed(0)} mg/dL`,
      range: "<200 mg/dL",
      status: "warning",
    }] : []),
  ];

  // Calculate cardiovascular risk
  const totalChol = heartData.totalCholesterol || 0;
  const ldl = heartData.ldl || 0;
  const hdl = heartData.hdl || 0;
  
  let riskLevel = "Low";
  let riskPosition = "20%";
  
  if (totalChol > 240 || ldl > 130) {
    riskLevel = "High";
    riskPosition = "80%";
  } else if (totalChol > 200 || ldl > 100) {
    riskLevel = "Moderate";
    riskPosition = "60%";
  }

  return (
    <DashboardLayout breadcrumb="Heart & Cholesterol">
      {/* Page title */}
      <h1 className="text-[22px] font-semibold text-[#111111] mb-[24px]">
        Heart & Cholesterol
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

      {/* LDL vs HDL Comparison */}
      <div className="bg-white border border-[#E5E5E5] rounded-[12px] p-[24px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] mb-[32px]">
        <h2 className="text-[15px] font-semibold text-[#111111] mb-[24px]">
          LDL vs HDL Comparison (Trends)
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" vertical={false} />
            <XAxis
              dataKey="visit"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B6B6B", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B6B6B", fontSize: 12 }}
            />
            <Legend
              wrapperStyle={{ fontSize: "12px", color: "#6B6B6B" }}
              iconType="circle"
            />
            <Bar dataKey="LDL" fill="#DC2626" radius={[4, 4, 0, 0]} />
            <Bar dataKey="HDL" fill="#16A34A" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Risk Indicator */}
      <div className="bg-white border border-[#E5E5E5] rounded-[12px] p-[24px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] mb-[32px]">
        <h2 className="text-[15px] font-semibold text-[#111111] mb-[16px]">
          Cardiovascular Risk Indicator
        </h2>
        <div className="space-y-[16px]">
          <div className="relative h-[40px] rounded-[8px] overflow-hidden flex">
            <div className="flex-1 bg-[#16A34A] flex items-center justify-center text-[12px] font-medium text-white">
              Low
            </div>
            <div className="flex-1 bg-[#D97706] flex items-center justify-center text-[12px] font-medium text-white">
              Moderate
            </div>
            <div className="flex-1 bg-[#DC2626] flex items-center justify-center text-[12px] font-medium text-white">
              High
            </div>
          </div>
          <div className="relative">
            <div className="absolute" style={{ left: riskPosition, top: "-8px" }}>
              <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-[#111111]" />
            </div>
          </div>
          <p className="text-[13px] text-[#6B6B6B] text-center mt-[8px]">
            Your cholesterol levels indicate {riskLevel.toLowerCase()} cardiovascular risk
          </p>
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
                  <span className="px-[12px] py-[4px] rounded-[8px] text-[11px] font-medium tracking-[0.04em] bg-[#FEF3C7] text-[#92400E]">
                    ELEVATED
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
