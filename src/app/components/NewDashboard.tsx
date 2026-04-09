import { useNavigate } from "react-router";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from "recharts";
import { AlertCircle, TrendingUp, Sparkles, Stethoscope, Upload } from "lucide-react";
import { DashboardLayout } from "./DashboardLayout";
import { useState, useEffect } from "react";
import { useDashboard } from "../../hooks/useData";
import { DoctorSummary } from "./DoctorSummary";
import { TrendsChart } from "./TrendsChart";

export function NewDashboard() {
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useDashboard();
  const [checked, setChecked] = useState(false);

  // Refetch if new upload happened recently
  useEffect(() => {
    const checkReports = () => {
      try {
        const refreshTrigger = localStorage.getItem("data_refresh_trigger");
        if (refreshTrigger) {
          const uploadTime = parseInt(refreshTrigger);
          const timeSinceUpload = Date.now() - uploadTime;
          
          // If upload was recent (within last 5 seconds), add delay then refetch
          if (timeSinceUpload < 5000) {
            setTimeout(() => {
              console.log("Refetching dashboard after upload...");
              refetch();
            }, 1500);
          }
        }
      } catch (err) {
        console.log("Report check issue, proceeding with dashboard");
      }
      setChecked(true);
    };
    checkReports();
  }, [refetch]);

  // Show loading until we've checked for reports
  if (!checked || isLoading) {
    return (
      <DashboardLayout breadcrumb="Dashboard">
        <div className="flex items-center justify-center h-[400px]">
          <div className="text-[16px] text-[#6B6B6B]">Loading dashboard...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !data) {
    return (
      <DashboardLayout breadcrumb="Dashboard">
        <div className="flex items-center justify-center h-[400px]">
          <div className="flex items-start gap-[8px] p-[16px] bg-[#FEE2E2] rounded-[8px] max-w-[400px]">
            <AlertCircle className="w-[14px] h-[14px] text-[#991B1B] mt-[2px] flex-shrink-0" strokeWidth={1.5} />
            <p className="text-[13px] text-[#991B1B]">
              Failed to load dashboard data. Please try refreshing the page.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout breadcrumb="Dashboard">
      {/* Metric cards */}
      <div className="grid grid-cols-3 gap-[16px] mb-[32px]">
        <div className="bg-white border border-[#E5E5E5] rounded-[12px] p-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          <div className="flex items-start justify-between mb-[12px]">
            <div className="text-[13px] text-[#6B6B6B] tracking-[0.04em]">GLUCOSE</div>
            <div className="w-2 h-2 rounded-full bg-[#D97706]" />
          </div>
          <div className="text-[24px] font-semibold text-[#111111]">{data.glucose}</div>
          <div className="text-[12px] text-[#6B6B6B]">mg/dL</div>
        </div>

        <button
          onClick={() => navigate("/biomarker/hba1c")}
          className="bg-white border border-[#E5E5E5] rounded-[12px] p-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] text-left hover:border-[#1A6BFA] transition-colors"
        >
          <div className="flex items-start justify-between mb-[12px]">
            <div className="text-[13px] text-[#6B6B6B] tracking-[0.04em]">HbA1c</div>
            <div className="w-2 h-2 rounded-full bg-[#D97706]" />
          </div>
          <div className="text-[24px] font-semibold text-[#111111]">{data.hba1c}</div>
          <div className="text-[12px] text-[#6B6B6B]">percentage</div>
        </button>

        <div className="bg-white border border-[#E5E5E5] rounded-[12px] p-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          <div className="flex items-start justify-between mb-[12px]">
            <div className="text-[13px] text-[#6B6B6B] tracking-[0.04em]">CHOLESTEROL</div>
            <div className="w-2 h-2 rounded-full bg-[#D97706]" />
          </div>
          <div className="text-[24px] font-semibold text-[#111111]">{data.cholesterol}</div>
          <div className="text-[12px] text-[#6B6B6B]">mg/dL</div>
        </div>
      </div>

      {/* AI Health Insights */}
      <div className="bg-white border border-[#E5E5E5] rounded-[12px] p-[24px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] mb-[24px]">
        <div className="flex items-center gap-[8px] mb-[20px]">
          <Sparkles className="w-[16px] h-[16px] text-[#1A6BFA]" strokeWidth={1.5} />
          <h2 className="text-[15px] font-semibold text-[#111111]">AI Health Insights</h2>
        </div>

        <div className="grid grid-cols-2 gap-[16px] mb-[16px]">
          <div className="p-[16px] bg-[#FEF3C7] rounded-[8px]">
            <div className="text-[12px] text-[#92400E] tracking-[0.04em] mb-[4px]">DIABETES RISK</div>
            <div className="text-[24px] font-semibold text-[#92400E]">{data.diabetesRisk}%</div>
            <div className="text-[11px] text-[#92400E] mt-[4px]">
              {data.diabetesRisk > 70 ? "High Risk" : data.diabetesRisk > 40 ? "Medium Risk" : "Low Risk"}
            </div>
          </div>
          <div className="p-[16px] bg-[#FEF3C7] rounded-[8px]">
            <div className="text-[12px] text-[#92400E] tracking-[0.04em] mb-[4px]">HEART DISEASE RISK</div>
            <div className="text-[24px] font-semibold text-[#92400E]">{data.heartDiseaseRisk}%</div>
            <div className="text-[11px] text-[#92400E] mt-[4px]">
              {data.heartDiseaseRisk > 70 ? "High Risk" : data.heartDiseaseRisk > 40 ? "Medium Risk" : "Low Risk"}
            </div>
          </div>
        </div>

        {data.alerts.length === 0 ? (
          <div className="text-[13px] text-[#6B6B6B]">No flagged insights yet. Upload a report to generate them.</div>
        ) : (
          <div className="flex items-start gap-[8px] p-[12px] bg-[#FEE2E2] rounded-[8px]">
            <AlertCircle className="w-[14px] h-[14px] text-[#991B1B] mt-[2px] flex-shrink-0" strokeWidth={1.5} />
            <p className="text-[13px] text-[#991B1B]">
              {data.alerts[0].name}: {data.alerts[0].value} (ref {data.alerts[0].range})
            </p>
          </div>
        )}
      </div>

      <div className="mb-[24px]">
        <DoctorSummary summary={data.doctorSummary} />
      </div>

      <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-[12px] p-[16px] mb-[24px]">
        <div className="text-[13px] text-[#1D4ED8] font-medium">Health Trend</div>
        <div className="text-[14px] text-[#1E3A8A] mt-[4px]">
          {data.healthTrendMessage || "Upload more reports to unlock trend guidance."}
        </div>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-3 gap-[16px] mb-[32px]">
        <button
          onClick={() => navigate("/ai-prediction")}
          className="bg-white border border-[#E5E5E5] rounded-[12px] p-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:border-[#1A6BFA] hover:shadow-[0_4px_12px_rgba(26,107,250,0.15)] transition-all flex items-center gap-[12px]"
        >
          <div className="w-[40px] h-[40px] bg-[#EFF6FF] rounded-[8px] flex items-center justify-center flex-shrink-0">
            <Stethoscope className="w-[20px] h-[20px] text-[#1A6BFA]" strokeWidth={1.5} />
          </div>
          <div className="text-left">
            <div className="text-[15px] font-semibold text-[#111111]">Check Symptoms</div>
            <div className="text-[12px] text-[#6B6B6B]">AI-powered analysis</div>
          </div>
        </button>

        <button
          onClick={() => navigate("/reports")}
          className="bg-white border border-[#E5E5E5] rounded-[12px] p-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:border-[#1A6BFA] hover:shadow-[0_4px_12px_rgba(26,107,250,0.15)] transition-all flex items-center gap-[12px]"
        >
          <div className="w-[40px] h-[40px] bg-[#EFF6FF] rounded-[8px] flex items-center justify-center flex-shrink-0">
            <Upload className="w-[20px] h-[20px] text-[#1A6BFA]" strokeWidth={1.5} />
          </div>
          <div className="text-left">
            <div className="text-[15px] font-semibold text-[#111111]">Open My Reports</div>
            <div className="text-[12px] text-[#6B6B6B]">Listen and view personalized plan</div>
          </div>
        </button>

        <button
          onClick={() => navigate("/upload-report")}
          className="bg-white border border-[#E5E5E5] rounded-[12px] p-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:border-[#1A6BFA] hover:shadow-[0_4px_12px_rgba(26,107,250,0.15)] transition-all flex items-center gap-[12px]"
        >
          <div className="w-[40px] h-[40px] bg-[#EFF6FF] rounded-[8px] flex items-center justify-center flex-shrink-0">
            <Upload className="w-[20px] h-[20px] text-[#1A6BFA]" strokeWidth={1.5} />
          </div>
          <div className="text-left">
            <div className="text-[15px] font-semibold text-[#111111]">Upload Report</div>
            <div className="text-[12px] text-[#6B6B6B]">Add new medical data</div>
          </div>
        </button>
      </div>

      {/* Trend chart */}
      <div className="bg-white border border-[#E5E5E5] rounded-[12px] p-[24px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] mb-[32px]">
        <div className="flex items-center gap-[8px] mb-[24px]">
          <TrendingUp className="w-[16px] h-[16px] text-[#6B6B6B]" strokeWidth={1.5} />
          <h2 className="text-[15px] font-semibold text-[#111111]">
            Glucose Trend (Last 3 visits)
          </h2>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data.trends}>
            <defs>
              <linearGradient id="glucoseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1A6BFA" stopOpacity={0.1} />
                <stop offset="100%" stopColor="#1A6BFA" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" vertical={false} />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B6B6B", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B6B6B", fontSize: 12 }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#1A6BFA"
              strokeWidth={3}
              dot={{ fill: "#1A6BFA", r: 5, strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mb-[32px]">
        <TrendsChart
          glucose={data.metricTrends?.glucose || []}
          cholesterol={data.metricTrends?.cholesterol || []}
          hba1c={data.metricTrends?.hba1c || []}
        />
      </div>

      {/* Flagged items */}
      <div className="bg-white border border-[#E5E5E5] rounded-[12px] p-[24px] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <div className="flex items-center gap-[8px] mb-[24px]">
          <AlertCircle className="w-[16px] h-[16px] text-[#DC2626]" strokeWidth={1.5} />
          <h2 className="text-[15px] font-semibold text-[#111111]">Flagged Items</h2>
        </div>
        <div className="space-y-[12px]">
          {data.alerts.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(`/biomarker/${item.name.toLowerCase().replace(/\s+/g, "-")}`)}
              className="w-full flex items-center justify-between p-[16px] border border-[#E5E5E5] rounded-[8px] hover:border-[#1A6BFA] transition-colors"
            >
              <div className="text-left">
                <div className="text-[14px] font-medium text-[#111111]">{item.name}</div>
                <div className="text-[12px] text-[#6B6B6B]">
                  Reference: {item.range}
                </div>
              </div>
              <div className="flex items-center gap-[12px]">
                <div className="text-[15px] font-semibold text-[#111111]">{item.value}</div>
                <span
                  className={`px-[12px] py-[4px] rounded-[8px] text-[11px] font-medium tracking-[0.04em] ${
                    item.status === "warning"
                      ? "bg-[#FEF3C7] text-[#92400E]"
                      : "bg-[#FEE2E2] text-[#991B1B]"
                  }`}
                >
                  {item.status === "warning" ? "ELEVATED" : "LOW"}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

    </DashboardLayout>
  );
}
