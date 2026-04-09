import { Link, useNavigate, useParams } from "react-router";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from "recharts";
import { ChevronRight, Info, Send } from "lucide-react";

const trendData = [
  { date: "Dec", value: 6.2 },
  { date: "Jan", value: 6.5 },
  { date: "Feb", value: 6.6 },
  { date: "Mar", value: 6.8 },
];

export function BiomarkerDetail() {
  const navigate = useNavigate();
  const { biomarker } = useParams();

  return (
    <div className="min-h-screen bg-[#F9F9F8] flex flex-col">
      {/* Header */}
      <header className="h-[72px] px-6 flex items-center bg-white border-b border-[#E5E5E5]">
        <button
          onClick={() => navigate("/")}
          className="text-[16px] font-medium text-[#111111] hover:text-[#1A6BFA] transition-colors"
        >
          MedHistory Lens
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 p-8">
        <div className="max-w-[900px] mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8 text-[13px]">
            <Link to="/dashboard" className="text-[#6B6B6B] hover:text-[#1A6BFA]">
              Reports
            </Link>
            <ChevronRight className="w-4 h-4 text-[#6B6B6B]" strokeWidth={1.5} />
            <span className="text-[#111111] font-medium">HbA1c</span>
          </div>

          {/* Value display */}
          <div className="bg-white border border-[#E5E5E5] rounded-[12px] p-8 shadow-[0_1px_3px_rgba(0,0,0,0.06)] mb-6">
            <div className="text-[13px] text-[#6B6B6B] mb-2 tracking-[0.04em]">
              CURRENT VALUE
            </div>
            <div className="text-[40px] font-semibold text-[#D97706] mb-6">6.8%</div>

            {/* Reference range bar */}
            <div className="mb-2">
              <div className="text-[12px] text-[#6B6B6B] mb-3">Reference Range</div>
              <div className="relative h-[8px] bg-[#F0F0EF] rounded-full">
                <div
                  className="absolute top-[-4px] w-3 h-3 bg-[#D97706] rounded-full border-2 border-white"
                  style={{ left: "85%" }}
                />
                <div className="absolute top-[12px] left-0 text-[11px] text-[#6B6B6B]">
                  4.0%
                </div>
                <div className="absolute top-[12px] right-0 text-[11px] text-[#6B6B6B]">
                  5.6%
                </div>
              </div>
            </div>
          </div>

          {/* Explanation card */}
          <div className="bg-white border border-[#E5E5E5] rounded-[12px] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-[#6B6B6B]" strokeWidth={1.5} />
              <h2 className="text-[15px] font-semibold text-[#111111]">What is HbA1c?</h2>
            </div>
            <p className="text-[14px] text-[#6B6B6B] leading-relaxed">
              Hemoglobin A1c (HbA1c) measures your average blood glucose levels over the past 2-3
              months. It's a key indicator for monitoring diabetes and prediabetes risk.
            </p>
          </div>

          {/* Trend chart */}
          <div className="bg-white border border-[#E5E5E5] rounded-[12px] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] mb-6">
            <h2 className="text-[15px] font-semibold text-[#111111] mb-6">
              Trend (Last 4 readings)
            </h2>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" vertical={false} />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6B6B6B", fontSize: 12 }}
                />
                <YAxis
                  domain={[5.5, 7]}
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

          {/* Ask AI input */}
          <div className="bg-white border border-[#E5E5E5] rounded-[24px] px-6 py-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)] flex items-center gap-3">
            <input
              type="text"
              placeholder="Why might my HbA1c be elevated?"
              className="flex-1 bg-transparent border-none outline-none text-[15px] text-[#111111] placeholder:text-[#6B6B6B]"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  navigate("/chat");
                }
              }}
            />
            <button
              onClick={() => navigate("/chat")}
              className="w-8 h-8 rounded-full bg-[#1A6BFA] flex items-center justify-center hover:bg-[#1557CC] transition-colors"
            >
              <Send className="w-4 h-4 text-white" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}