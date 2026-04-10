import { useNavigate } from "react-router";
import { XAxis, YAxis, ResponsiveContainer, CartesianGrid, AreaChart, Area, Tooltip } from "recharts";
import { AlertCircle, TrendingUp, Sparkles, Stethoscope, Upload, Activity, Heart, Droplets } from "lucide-react";
import { DashboardLayout } from "./DashboardLayout";
import { useMemo } from "react";
import { useDashboard } from "../../hooks/useData";

export function NewDashboard() {
  const navigate = useNavigate();
  const { data, isLoading } = useDashboard();

  const numericHbA1c = useMemo(() => {
    if (!data?.hba1c) return null;
    const parsed = Number(String(data.hba1c).replace("%", "").trim());
    return Number.isFinite(parsed) ? parsed : null;
  }, [data?.hba1c]);

  const riskScore = useMemo(() => {
    const diabetes = data?.diabetesRisk ?? 0;
    const heart = data?.heartDiseaseRisk ?? 0;
    return Math.round((diabetes + heart) / 2);
  }, [data?.diabetesRisk, data?.heartDiseaseRisk]);

  const trendData = useMemo(() => {
    const glucoseTrend = data?.metricTrends?.glucose ?? data?.trends ?? [];
    const cholesterolTrend = data?.metricTrends?.cholesterol ?? [];
    const hba1cTrend = data?.metricTrends?.hba1c ?? [];

    const byDate = new Map<string, { name: string; glucose?: number; cholesterol?: number; hba1c?: number }>();

    glucoseTrend.forEach((point) => {
      if (!byDate.has(point.date)) byDate.set(point.date, { name: point.date });
      byDate.get(point.date)!.glucose = point.value;
    });

    cholesterolTrend.forEach((point) => {
      if (!byDate.has(point.date)) byDate.set(point.date, { name: point.date });
      byDate.get(point.date)!.cholesterol = point.value;
    });

    hba1cTrend.forEach((point) => {
      if (!byDate.has(point.date)) byDate.set(point.date, { name: point.date });
      byDate.get(point.date)!.hba1c = point.value;
    });

    return Array.from(byDate.values());
  }, [data?.metricTrends, data?.trends]);

  const glucoseTrendText = useMemo(() => buildTrendText(data?.metricTrends?.glucose ?? data?.trends), [data?.metricTrends?.glucose, data?.trends]);
  const cholesterolTrendText = useMemo(() => buildTrendText(data?.metricTrends?.cholesterol), [data?.metricTrends?.cholesterol]);
  const hba1cTrendText = useMemo(() => buildTrendText(data?.metricTrends?.hba1c), [data?.metricTrends?.hba1c]);

  const riskLevel = getRiskLevel(riskScore);
  const insights = useMemo(() => {
    const items: Array<{ text: string; color: string }> = [];

    if (data?.doctorSummary) {
      items.push({ text: data.doctorSummary, color: "#10B981" });
    }
    if (data?.healthTrendMessage) {
      items.push({ text: data.healthTrendMessage, color: "#D97706" });
    }
    if (data?.alerts?.length) {
      const alertText = data.alerts
        .slice(0, 2)
        .map((a) => `${a.name}: ${a.value} (ref ${a.range})`)
        .join(" | ");
      items.push({ text: `Watch list from latest report: ${alertText}`, color: "#4C1D95" });
    }

    if (items.length === 0) {
      items.push({ text: "Upload reports to generate AI insights from your real metrics.", color: "#4C1D95" });
    }

    return items;
  }, [data?.alerts, data?.doctorSummary, data?.healthTrendMessage]);

  if (isLoading) {
    return (
      <DashboardLayout breadcrumb="Overview">
        <div className="flex items-center justify-center h-[50vh]">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full border-2 border-[#4C1D95]/20 animate-ping"></div>
            <div className="absolute inset-2 rounded-full border-2 border-[#10B981]/40 animate-[spin_2s_linear_infinite]"></div>
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-[#4C1D95] to-[#10B981] opacity-50 blur-sm animate-pulse"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout breadcrumb="Intelligence Overview">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-bold text-[#18181B] tracking-tight flex items-center gap-3">
            Health Intelligence 
            <Sparkles className="w-5 h-5 text-[#4C1D95] animate-pulse" />
          </h1>
          <p className="text-[#52525B] text-[14px] mt-1">Real-time analysis of your biomarkers and health trends</p>
        </div>
        <button
          onClick={() => navigate("/upload-report")}
          className="group px-5 py-2.5 bg-white hover:bg-[#FAFAF7] border border-[#E4E4E7] backdrop-blur-md rounded-xl text-[14px] font-semibold transition-all shadow-sm shadow-[#4C1D95]/5 flex items-center gap-2 text-[#18181B]"
        >
          <Upload className="w-4 h-4 text-[#4C1D95] group-hover:scale-110 transition-transform" />
          <span>Analyze Report</span>
          <div className="absolute inset-0 border border-[#4C1D95]/0 group-hover:border-[#4C1D95]/30 rounded-xl transition-colors pointer-events-none" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard 
            title="HbA1c" 
            value={numericHbA1c ?? "N/A"}
            unit={numericHbA1c !== null ? "%" : ""}
            trend={hba1cTrendText}
            status={getHba1cStatus(numericHbA1c)}
            icon={Heart} 
            color="#10B981" 
          />
          <MetricCard 
            title="Avg. Glucose" 
            value={data?.glucose ?? "N/A"}
            unit={data?.glucose !== null && data?.glucose !== undefined ? "mg/dL" : ""}
            trend={glucoseTrendText}
            status={getGlucoseStatus(data?.glucose)}
            icon={Activity} 
            color="#D97706" 
          />
          <MetricCard 
            title="Cholesterol" 
            value={data?.cholesterol ?? "N/A"}
            unit={data?.cholesterol !== null && data?.cholesterol !== undefined ? "mg/dL" : ""}
            trend={cholesterolTrendText}
            status={getCholesterolStatus(data?.cholesterol)}
            icon={Droplets} 
            color="#EF4444" 
          />
        </div>

        <div className="bg-white border border-[#E4E4E7] rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#4C1D95]/5 blur-3xl rounded-full" />
          <h3 className="text-[13px] uppercase tracking-wider font-bold text-[#52525B] w-full text-left mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#4C1D95]" /> Health Risk
          </h3>
          
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="56" fill="transparent" stroke="#F4F4F5" strokeWidth="12" />
              <circle 
                cx="64" 
                cy="64" 
                r="56" 
                fill="transparent" 
                stroke="url(#gradient)" 
                strokeWidth="12" 
                strokeDasharray="351.85" 
                strokeDashoffset={351.85 - (351.85 * riskScore) / 100}
                className="transition-all duration-1000 ease-out"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="50%" stopColor="#D97706" />
                  <stop offset="100%" stopColor="#EF4444" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-[#18181B] tracking-tighter">{riskScore}</span>
              <span className="text-[10px] text-[#A1A1AA] uppercase font-bold tracking-widest">Score</span>
            </div>
          </div>
          <p className="text-center mt-4 text-[13px] text-[#52525B] font-medium leading-relaxed">
            Your risk profile is currently <span className="text-[#10B981] font-bold">{riskLevel}</span>. {data?.healthTrendMessage || "Keep uploading reports to refine your risk model."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-[#E4E4E7] rounded-2xl p-6 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute inset-0 bg-gradient-to-br from-[#4C1D95] to-[#10B981] opacity-0 group-hover:opacity-[0.02] transition-opacity pointer-events-none" />
          <h3 className="text-[15px] font-bold text-[#18181B] mb-6 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#4C1D95]" />
            Biomarker Trends
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHb" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4C1D95" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#4C1D95" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSugar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F4F4F5" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#A1A1AA', fontSize: 12, fontWeight: 500 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#A1A1AA', fontSize: 12, fontWeight: 500 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #E4E4E7', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
                  itemStyle={{ fontSize: 13, fontWeight: 600 }}
                  labelStyle={{ color: '#18181B', fontWeight: 700, marginBottom: '4px' }}
                />
                <Area type="monotone" dataKey="cholesterol" name="Cholesterol" stroke="#4C1D95" strokeWidth={3} fillOpacity={1} fill="url(#colorHb)" />
                <Area type="monotone" dataKey="glucose" name="Glucose" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorSugar)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#FAFAF7] border border-[#E4E4E7] rounded-2xl p-6 shadow-sm relative overflow-hidden flex flex-col hover:shadow-md transition-shadow">
          <h3 className="text-[15px] font-bold text-[#18181B] mb-5 flex items-center gap-2 relative z-10">
            <Stethoscope className="w-5 h-5 text-[#4C1D95]" />
            AI Insights
          </h3>
          
          <div className="space-y-4 flex-1 relative z-10">
            {insights.map((insight, idx) => (
              <div key={`${idx}-${insight.color}`} className="p-4 bg-white border border-[#E4E4E7] rounded-xl hover:border-[#4C1D95]/30 transition-all group cursor-pointer relative overflow-hidden shadow-sm">
                <div className="absolute left-0 top-0 bottom-0 w-1 group-hover:w-1.5 transition-all" style={{ backgroundColor: insight.color }} />
                <p className="text-[13px] text-[#52525B] leading-relaxed font-medium">{insight.text}</p>
              </div>
            ))}
          </div>
          
          <button onClick={() => navigate("/reports")} className="mt-6 w-full py-2.5 bg-white hover:bg-[#F4F4F5] border border-[#E4E4E7] text-[#18181B] text-[13px] font-bold rounded-xl transition-colors shadow-sm">
            View All Insights
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

function buildTrendText(series?: Array<{ date: string; value: number }>) {
  if (!series || series.length < 2) return "No trend yet";
  const prev = series[series.length - 2]?.value;
  const curr = series[series.length - 1]?.value;
  if (prev === undefined || curr === undefined || prev === 0) return "No trend yet";

  const diffPct = ((curr - prev) / Math.abs(prev)) * 100;
  if (Math.abs(diffPct) < 0.5) return "Stable trend";
  const sign = diffPct > 0 ? "+" : "";
  return `${sign}${diffPct.toFixed(1)}% vs previous`;
}

function getRiskLevel(score: number) {
  if (score >= 67) return "high";
  if (score >= 34) return "moderate";
  return "low";
}

function getGlucoseStatus(glucose?: number | null) {
  if (glucose === null || glucose === undefined) return "neutral";
  if (glucose >= 126 || glucose < 70) return "danger";
  if (glucose >= 100) return "warning";
  return "optimal";
}

function getHba1cStatus(hba1c?: number | null) {
  if (hba1c === null || hba1c === undefined) return "neutral";
  if (hba1c >= 6.5) return "danger";
  if (hba1c >= 5.7) return "warning";
  return "optimal";
}

function getCholesterolStatus(cholesterol?: number | null) {
  if (cholesterol === null || cholesterol === undefined) return "neutral";
  if (cholesterol >= 240) return "danger";
  if (cholesterol >= 200) return "warning";
  return "optimal";
}

function MetricCard({ title, value, unit, trend, status, icon: Icon, color }: any) {
  const getStatusColor = () => {
    if (status === "optimal") return "text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20";
    if (status === "warning") return "text-[#D97706] bg-[#D97706]/10 border-[#D97706]/20";
    if (status === "neutral") return "text-[#52525B] bg-[#F4F4F5] border-[#E4E4E7]";
    return "text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/20";
  };

  return (
    <div className="bg-white border border-[#E4E4E7] rounded-2xl p-5 shadow-sm relative overflow-hidden group hover:-translate-y-1 hover:shadow-md transition-all duration-300">
      <div className="flex justify-between items-start mb-4 relative z-10">
        <h3 className="text-[12px] uppercase tracking-widest font-bold text-[#52525B]">{title}</h3>
        <div className="w-8 h-8 rounded-lg bg-[#FAFAF7] border border-[#E4E4E7] flex items-center justify-center group-hover:bg-white transition-colors">
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
      </div>
      <div className="flex items-baseline gap-1 relative z-10 mb-3">
        <span className="text-[32px] font-bold text-[#18181B] tracking-tighter">{value}</span>
        <span className="text-[13px] text-[#A1A1AA] font-semibold">{unit}</span>
      </div>
      <div className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold border ${getStatusColor()}`}>
        {trend}
      </div>
    </div>
  );
}
