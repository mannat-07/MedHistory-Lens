import { useNavigate } from "react-router";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from "recharts";
import { AlertCircle, TrendingUp, Sparkles, Stethoscope, UtensilsCrossed, Upload } from "lucide-react";
import { DashboardLayout } from "./DashboardLayout";
import { useState } from "react";
import { useDashboard } from "../../hooks/useData";

export function NewDashboard() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useDashboard();
  const [showDietPlan, setShowDietPlan] = useState(false);

  if (isLoading) {
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

        <div className="flex items-start gap-[8px] p-[12px] bg-[#FEE2E2] rounded-[8px]">
          <AlertCircle className="w-[14px] h-[14px] text-[#991B1B] mt-[2px] flex-shrink-0" strokeWidth={1.5} />
          <p className="text-[13px] text-[#991B1B]">Sugar levels increasing over time. Consider lifestyle adjustments.</p>
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
          onClick={() => setShowDietPlan(true)}
          className="bg-white border border-[#E5E5E5] rounded-[12px] p-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:border-[#1A6BFA] hover:shadow-[0_4px_12px_rgba(26,107,250,0.15)] transition-all flex items-center gap-[12px]"
        >
          <div className="w-[40px] h-[40px] bg-[#EFF6FF] rounded-[8px] flex items-center justify-center flex-shrink-0">
            <UtensilsCrossed className="w-[20px] h-[20px] text-[#1A6BFA]" strokeWidth={1.5} />
          </div>
          <div className="text-left">
            <div className="text-[15px] font-semibold text-[#111111]">Get Diet Plan</div>
            <div className="text-[12px] text-[#6B6B6B]">Personalized recommendations</div>
          </div>
        </button>

        <button
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

      {/* Diet Plan Modal */}
      {showDietPlan && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowDietPlan(false)}
        >
          <div
            className="bg-white rounded-[16px] w-[600px] max-h-[80vh] overflow-y-auto shadow-[0_20px_40px_rgba(0,0,0,0.2)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-[#E5E5E5] p-[24px] rounded-t-[16px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-[8px]">
                  <UtensilsCrossed className="w-[20px] h-[20px] text-[#1A6BFA]" strokeWidth={1.5} />
                  <h2 className="text-[18px] font-semibold text-[#111111]">Personalized Diet Plan</h2>
                </div>
                <button
                  onClick={() => setShowDietPlan(false)}
                  className="w-[32px] h-[32px] rounded-full hover:bg-[#F5F5F4] flex items-center justify-center transition-colors"
                >
                  <span className="text-[20px] text-[#6B6B6B]">×</span>
                </button>
              </div>
            </div>

            <div className="p-[24px]">
              {/* Alert */}
              <div className="flex items-start gap-[8px] p-[16px] bg-[#EFF6FF] rounded-[8px] mb-[24px]">
                <Sparkles className="w-[14px] h-[14px] text-[#1A6BFA] mt-[2px] flex-shrink-0" strokeWidth={1.5} />
                <p className="text-[13px] text-[#1A6BFA]">
                  Based on your current health metrics, this plan helps manage blood sugar and cholesterol levels.
                </p>
              </div>

              {/* Meals */}
              <div className="space-y-[24px]">
                <div>
                  <div className="text-[13px] text-[#6B6B6B] tracking-[0.04em] mb-[12px]">BREAKFAST</div>
                  <div className="p-[16px] bg-[#F9F9F8] rounded-[8px] space-y-[8px]">
                    <p className="text-[14px] text-[#111111]">• Oatmeal with berries and nuts</p>
                    <p className="text-[14px] text-[#111111]">• Boiled eggs (2 whites)</p>
                    <p className="text-[14px] text-[#111111]">• Green tea or black coffee</p>
                  </div>
                </div>

                <div>
                  <div className="text-[13px] text-[#6B6B6B] tracking-[0.04em] mb-[12px]">LUNCH</div>
                  <div className="p-[16px] bg-[#F9F9F8] rounded-[8px] space-y-[8px]">
                    <p className="text-[14px] text-[#111111]">• Grilled chicken or fish</p>
                    <p className="text-[14px] text-[#111111]">• Quinoa or brown rice (1 cup)</p>
                    <p className="text-[14px] text-[#111111]">• Mixed vegetables salad</p>
                    <p className="text-[14px] text-[#111111]">• Olive oil dressing</p>
                  </div>
                </div>

                <div>
                  <div className="text-[13px] text-[#6B6B6B] tracking-[0.04em] mb-[12px]">DINNER</div>
                  <div className="p-[16px] bg-[#F9F9F8] rounded-[8px] space-y-[8px]">
                    <p className="text-[14px] text-[#111111]">• Vegetable soup</p>
                    <p className="text-[14px] text-[#111111]">• Grilled tofu or lean meat</p>
                    <p className="text-[14px] text-[#111111]">• Steamed broccoli and spinach</p>
                  </div>
                </div>

                <div>
                  <div className="text-[13px] text-[#6B6B6B] tracking-[0.04em] mb-[12px]">FOODS TO AVOID</div>
                  <div className="p-[16px] bg-[#FEE2E2] rounded-[8px] space-y-[8px]">
                    <p className="text-[14px] text-[#991B1B]">• Refined sugar and sweets</p>
                    <p className="text-[14px] text-[#991B1B]">• Fried and processed foods</p>
                    <p className="text-[14px] text-[#991B1B]">• White bread and pasta</p>
                    <p className="text-[14px] text-[#991B1B]">• Sugary beverages</p>
                  </div>
                </div>

                <div>
                  <div className="text-[13px] text-[#6B6B6B] tracking-[0.04em] mb-[12px]">RECOMMENDATIONS</div>
                  <div className="p-[16px] bg-[#ECFDF5] rounded-[8px] space-y-[8px]">
                    <p className="text-[14px] text-[#065F46]">• Drink 8-10 glasses of water daily</p>
                    <p className="text-[14px] text-[#065F46]">• Exercise 30 minutes per day</p>
                    <p className="text-[14px] text-[#065F46]">• Eat small meals every 3-4 hours</p>
                    <p className="text-[14px] text-[#065F46]">• Monitor portion sizes</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowDietPlan(false)}
                className="w-full mt-[24px] bg-[#1A6BFA] text-white py-[12px] px-[24px] rounded-[8px] text-[15px] font-semibold hover:bg-[#1557D0] transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
